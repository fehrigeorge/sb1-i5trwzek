# ORM Migration Guide

## Table of Contents
1. [Prisma Migration](#prisma-migration)
2. [Drizzle Migration](#drizzle-migration)

## Prisma Migration

### 1. Setup

```bash
# Install Prisma
pnpm add -D prisma
pnpm add @prisma/client

# Initialize Prisma
npx prisma init
```

### 2. Schema Definition

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Participant {
  id         String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name       String
  lastActive DateTime  @default(now()) @map("last_active") @db.Timestamptz
  avatarUrl  String?   @map("avatar_url")
  createdAt  DateTime  @default(now()) @map("created_at") @db.Timestamptz
  messages   Message[]
  favorites  Favorite[]
  protected  ProtectedChat?

  @@map("participants")
}

model Message {
  id           String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  participantId String    @map("participant_id") @db.Uuid
  senderId     String     @map("sender_id") @db.Uuid
  message      String
  timestamp    DateTime   @db.Timestamptz
  isRead       Boolean    @default(false) @map("is_read")
  createdAt    DateTime   @default(now()) @map("created_at") @db.Timestamptz
  participant  Participant @relation(fields: [participantId], references: [id], onDelete: Cascade)

  @@index([participantId])
  @@index([timestamp])
  @@map("messages")
}

model Favorite {
  id            String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId        String     @map("user_id") @db.Uuid
  participantId String     @map("participant_id") @db.Uuid
  createdAt     DateTime   @default(now()) @map("created_at") @db.Timestamptz
  participant   Participant @relation(fields: [participantId], references: [id], onDelete: Cascade)

  @@unique([userId, participantId])
  @@map("favorites")
}

model ProtectedChat {
  id            String     @id @map("participant_id") @db.Uuid
  pinHash       String     @map("pin_hash")
  lastAttempt   DateTime?  @map("last_attempt") @db.Timestamptz
  attemptCount  Int        @default(0) @map("attempt_count")
  createdAt     DateTime   @default(now()) @map("created_at") @db.Timestamptz
  updatedAt     DateTime   @default(now()) @map("updated_at") @db.Timestamptz
  participant   Participant @relation(fields: [id], references: [id], onDelete: Cascade)

  @@map("protected_chats")
}
```

### 3. Migration

```bash
# Generate migration
npx prisma migrate dev --name init

# Apply migration
npx prisma migrate deploy
```

### 4. Client Updates

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 5. Query Updates

```typescript
// Before (Supabase)
const { data } = await supabase
  .from('messages')
  .select('*')
  .eq('participant_id', id);

// After (Prisma)
const messages = await prisma.message.findMany({
  where: { participantId: id },
  include: { participant: true }
});
```

## Drizzle Migration

### 1. Setup

```bash
# Install Drizzle
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit @types/pg
```

### 2. Schema Definition

Create `db/schema.ts`:

```typescript
import { pgTable, uuid, text, timestamp, boolean, integer, unique } from 'drizzle-orm/pg-core';

export const participants = pgTable('participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  lastActive: timestamp('last_active', { withTimezone: true }).defaultNow(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  participantId: uuid('participant_id')
    .references(() => participants.id, { onDelete: 'cascade' })
    .notNull(),
  senderId: uuid('sender_id').notNull(),
  message: text('message').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

export const favorites = pgTable('favorites', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  participantId: uuid('participant_id')
    .references(() => participants.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  userParticipant: unique().on(table.userId, table.participantId)
}));

export const protectedChats = pgTable('protected_chats', {
  id: uuid('participant_id').primaryKey()
    .references(() => participants.id, { onDelete: 'cascade' }),
  pinHash: text('pin_hash').notNull(),
  lastAttempt: timestamp('last_attempt', { withTimezone: true }),
  attemptCount: integer('attempt_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});
```

### 3. Migration

```bash
# Generate migration
pnpm drizzle-kit generate:pg

# Apply migration
pnpm drizzle-kit push:pg
```

### 4. Client Setup

```typescript
// lib/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const db = drizzle(pool, { schema });
```

### 5. Query Updates

```typescript
// Before (Supabase)
const { data } = await supabase
  .from('messages')
  .select('*')
  .eq('participant_id', id);

// After (Drizzle)
const messages = await db.query.messages.findMany({
  where: eq(schema.messages.participantId, id),
  with: {
    participant: true
  }
});
```

## Comparison

### Prisma
#### Pros:
- Type safety
- Auto-generated types
- Rich query API
- Great documentation
- Schema migrations
- Studio GUI

#### Cons:
- Larger bundle size
- Performance overhead
- Complex setup
- Limited raw SQL

### Drizzle
#### Pros:
- Lightweight
- Type safety
- Better performance
- Raw SQL support
- Simple setup

#### Cons:
- Less mature
- Fewer features
- Manual type writing
- Basic migrations

## Migration Steps

1. **Backup Data**
```bash
pg_dump -U postgres chat_history > backup.sql
```

2. **Create New Schema**
- Generate schema from existing database
- Review and adjust relations
- Add indexes and constraints

3. **Test Migration**
- Create test database
- Run migrations
- Verify data integrity
- Test application features

4. **Update Application**
- Replace Supabase queries
- Update types
- Add error handling
- Test thoroughly

5. **Production Migration**
- Schedule maintenance window
- Apply migrations
- Verify functionality
- Monitor performance

## Best Practices

1. **Type Safety**
```typescript
// Prisma
type Message = Prisma.MessageGetPayload<{
  include: { participant: true }
}>;

// Drizzle
type Message = typeof messages.$inferSelect;
```

2. **Query Optimization**
```typescript
// Prisma
const messages = await prisma.message.findMany({
  where: { participantId: id },
  select: {
    id: true,
    message: true,
    timestamp: true
  }
});

// Drizzle
const messages = await db
  .select({
    id: schema.messages.id,
    message: schema.messages.message,
    timestamp: schema.messages.timestamp
  })
  .from(schema.messages)
  .where(eq(schema.messages.participantId, id));
```

3. **Transactions**
```typescript
// Prisma
await prisma.$transaction(async (tx) => {
  // ... queries
});

// Drizzle
await db.transaction(async (tx) => {
  // ... queries
});
```

## Performance Monitoring

```typescript
// Prisma
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Drizzle
import { LogWriter } from 'drizzle-orm';
const queryLogger: LogWriter = {
  write(log) {
    console.log(log);
  },
};
```