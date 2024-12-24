# Architecture Overview

## Core Technologies
- React 18.3
- TypeScript
- Vite
- Supabase/PostgreSQL
- TanStack Query
- Zustand

## Project Structure
```
src/
├── components/     # UI components
│   ├── auth/      # Authentication components
│   ├── chat/      # Chat interface components
│   ├── metrics/   # Analytics components
│   └── ui/        # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/          
│   ├── queries/   # Database queries
│   └── utils/     # Utility functions
├── routes/        # Route components
├── stores/        # Zustand stores
└── types/         # TypeScript types
```

## Key Features
1. Authentication
   - Email/password auth via Supabase
   - Admin role support
   - Avatar management

2. Chat Interface
   - Real-time updates
   - Message search
   - Virtualized lists
   - PIN protection

3. Analytics
   - Message metrics
   - Response times
   - Activity patterns
   - Engagement tracking

4. Data Migration
   - Supabase ↔ Docker PostgreSQL
   - Data verification
   - Progress tracking

## State Management
- Zustand for global state
- React Query for server state
- Context for theme/auth

## Performance
- Virtualized lists
- Batch processing
- Optimized queries
- Lazy loading