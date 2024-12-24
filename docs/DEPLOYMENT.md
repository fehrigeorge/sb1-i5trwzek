# Deployment Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Supabase project
- Environment variables

## Build Process
```bash
# Install dependencies
pnpm install

# Build application
pnpm build

# Preview build
pnpm preview
```

## Environment Setup
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ADMIN_EMAIL_1=admin@example.com
VITE_ADMIN_EMAIL_2=admin2@example.com
```

## Deployment Options
1. Netlify
2. Vercel
3. Self-hosted
4. Docker

## Post-Deployment
- SSL/TLS setup
- Domain configuration
- CDN setup
- Monitoring