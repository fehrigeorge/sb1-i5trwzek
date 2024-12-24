# Database Documentation

## Schema Overview

### participants
```sql
CREATE TABLE participants (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  last_active timestamptz,
  avatar_url text,
  created_at timestamptz
);
```

### messages
```sql
CREATE TABLE messages (
  id uuid PRIMARY KEY,
  participant_id uuid REFERENCES participants,
  sender_id uuid NOT NULL,
  message text NOT NULL,
  timestamp timestamptz,
  is_read boolean,
  created_at timestamptz
);
```

### protected_chats
```sql
CREATE TABLE protected_chats (
  participant_id uuid PRIMARY KEY,
  pin_hash text NOT NULL,
  last_attempt timestamptz,
  attempt_count int,
  created_at timestamptz,
  updated_at timestamptz
);
```

## Security
- Row Level Security (RLS)
- PIN protection system
- Admin role checks

## Optimization
- Proper indexing
- Batch processing
- Connection pooling

## Migration Support
- Full schema compatibility
- Data integrity checks
- Automatic rollback