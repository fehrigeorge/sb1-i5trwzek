# Migration Guide

## Overview
This guide explains how to migrate data between Supabase and Docker PostgreSQL while maintaining authentication and storage in Supabase.

## Prerequisites
- Node.js 18+
- Docker
- PostgreSQL 15+
- Supabase project
- Environment variables configured

## Environment Setup
Copy `.env.example` to `.env` and configure:
```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Docker PostgreSQL
DOCKER_DB_HOST=localhost
DOCKER_DB_PORT=5432
DOCKER_DB_NAME=chat_history
DOCKER_DB_USER=postgres
DOCKER_DB_PASSWORD=postgres
```

## Migration Scripts

### To Docker PostgreSQL
```bash
pnpm migrate:to-docker
```
Migrates data from Supabase to local Docker PostgreSQL instance.

### To Supabase
```bash
pnpm migrate:to-supabase
```
Migrates data from Docker PostgreSQL back to Supabase.

### Verify Migration
```bash
pnpm migrate:verify
```
Verifies data consistency between both databases.

## Data Preservation
- Authentication remains in Supabase
- Storage buckets stay in Supabase
- Only database tables are migrated:
  - participants
  - messages
  - protected_chats

## Error Handling
- Automatic rollback on failure
- Detailed error logging
- Progress tracking
- Batch processing for large datasets