# Complete Database Migration Guide

## Table of Contents
1. [Export Options](#export-options)
2. [Docker Setup](#docker-setup)
3. [Cloud Migration](#cloud-migration)
4. [Data Verification](#data-verification)
5. [Performance Tuning](#performance-tuning)

## Export Options

### 1. Using pg_dump
```bash
# Full database dump
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql

# Schema only
pg_dump -h db.xxx.supabase.co -U postgres -d postgres --schema-only > schema.sql

# Data only
pg_dump -h db.xxx.supabase.co -U postgres -d postgres --data-only > data.sql
```

### 2. Using Supabase CLI
```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref <project-id>

# Download backup
supabase db dump -f backup.sql
```

## Docker Setup

### 1. Docker Compose Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-chat_history}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init:/docker-entrypoint-initdb.d
    command: 
      - "postgres"
      - "-c"
      - "max_connections=100"
      - "-c"
      - "shared_buffers=256MB"
      - "-c"
      - "work_mem=16MB"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  pgadmin:
    image: dpage/pgadmin4
    ports:
      - "5050:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_EMAIL:-admin@admin.com}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD:-admin}
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### 2. Environment Configuration

```bash
# .env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=chat_history
PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=admin
```

### 3. Initialize Database

```bash
# Start containers
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f postgres
```

## Cloud Migration

### 1. Preparation
```bash
# Create migration directory
mkdir -p migrations/functions

# Export functions separately
pg_dump -h db.xxx.supabase.co -U postgres -d postgres --schema=public --section=pre-data > migrations/functions/functions.sql
```

### 2. Data Transfer Script

```javascript
// scripts/migrate-data.js
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

const sourcePool = new Pool({
  connectionString: process.env.SOURCE_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const targetPool = new Pool({
  connectionString: process.env.TARGET_DATABASE_URL
});

async function migrateData() {
  console.log('Starting migration...');
  
  try {
    // Migrate in order of dependencies
    await migrateTable('participants');
    await migrateTable('messages');
    await migrateTable('favorites');
    await migrateTable('protected_chats');
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sourcePool.end();
    await targetPool.end();
  }
}

async function migrateTable(tableName, batchSize = 1000) {
  console.log(`Migrating ${tableName}...`);
  
  let offset = 0;
  let total = 0;
  
  while (true) {
    const { rows } = await sourcePool.query(
      `SELECT * FROM ${tableName} ORDER BY created_at LIMIT $1 OFFSET $2`,
      [batchSize, offset]
    );
    
    if (rows.length === 0) break;
    
    await targetPool.query(`
      INSERT INTO ${tableName} 
      SELECT * FROM json_populate_recordset(null::${tableName}, $1)
    `, [JSON.stringify(rows)]);
    
    total += rows.length;
    offset += batchSize;
    
    console.log(`Migrated ${total} rows from ${tableName}`);
  }
}

migrateData();
```

## Data Verification

### 1. Count Verification
```sql
-- Run on both source and target
SELECT 
  (SELECT COUNT(*) FROM participants) as participant_count,
  (SELECT COUNT(*) FROM messages) as message_count,
  (SELECT COUNT(*) FROM favorites) as favorite_count,
  (SELECT COUNT(*) FROM protected_chats) as protected_count;
```

### 2. Data Integrity Checks
```sql
-- Check for orphaned messages
SELECT COUNT(*) 
FROM messages m 
LEFT JOIN participants p ON m.participant_id = p.id 
WHERE p.id IS NULL;

-- Verify message timestamps
SELECT 
  MIN(timestamp) as oldest_message,
  MAX(timestamp) as newest_message,
  COUNT(*) as total_messages
FROM messages;

-- Check favorite constraints
SELECT COUNT(*) 
FROM favorites f 
LEFT JOIN participants p ON f.participant_id = p.id 
WHERE p.id IS NULL;
```

### 3. Performance Verification
```sql
-- Test common queries
EXPLAIN ANALYZE
SELECT m.* 
FROM messages m
WHERE m.participant_id = 'some-uuid'
ORDER BY m.timestamp DESC
LIMIT 50;
```

## Performance Tuning

### 1. Database Configuration
```sql
-- Adjust based on available memory
ALTER SYSTEM SET shared_buffers = '1GB';
ALTER SYSTEM SET work_mem = '32MB';
ALTER SYSTEM SET maintenance_work_mem = '256MB';
ALTER SYSTEM SET effective_cache_size = '3GB';

-- For write-heavy workload
ALTER SYSTEM SET synchronous_commit = 'off';
ALTER SYSTEM SET wal_buffers = '16MB';
```

### 2. Indexing Strategy
```sql
-- Create indexes for common queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_participant_timestamp 
ON messages (participant_id, timestamp DESC);

-- Add partial indexes for common filters
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_unread_messages 
ON messages (participant_id) 
WHERE NOT is_read;
```

### 3. Vacuum and Analyze
```sql
-- Regular maintenance
VACUUM ANALYZE messages;
VACUUM ANALYZE participants;

-- Monitor bloat
SELECT schemaname, tablename, n_dead_tup, n_live_tup
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
```

## Monitoring Setup

### 1. Create Monitoring Views
```sql
CREATE VIEW vw_database_stats AS
SELECT
  (SELECT COUNT(*) FROM participants) as total_participants,
  (SELECT COUNT(*) FROM messages) as total_messages,
  (SELECT pg_size_pretty(pg_database_size(current_database()))) as database_size,
  (SELECT COUNT(*) FROM messages WHERE timestamp > now() - interval '24 hours') as messages_last_24h;

CREATE VIEW vw_performance_stats AS
SELECT
  relname as table_name,
  n_live_tup as live_rows,
  n_dead_tup as dead_rows,
  last_vacuum,
  last_analyze
FROM pg_stat_user_tables;
```

### 2. Monitoring Queries
```sql
-- Check table sizes
SELECT
  relname as table_name,
  pg_size_pretty(pg_total_relation_size(relid)) as total_size,
  pg_size_pretty(pg_table_size(relid)) as table_size,
  pg_size_pretty(pg_indexes_size(relid)) as index_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;

-- Monitor query performance
SELECT
  query,
  calls,
  total_time / 1000 as total_seconds,
  mean_time / 1000 as mean_seconds,
  rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```