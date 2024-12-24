# Chat History Viewer Technical Overview

## Tech Stack

### Core Technologies
- **React** (v18.3) - Frontend framework
- **TypeScript** - Type safety and developer experience
- **Vite** - Build tool and development server
- **Supabase** - Backend and real-time database

### Key Libraries
- **@tanstack/react-query** - Data fetching and caching
- **@tanstack/react-virtual** - Virtualized list rendering
- **react-router-dom** - Client-side routing
- **date-fns** - Date manipulation
- **zustand** - State management
- **lucide-react** - Icons
- **clsx** + **tailwind-merge** - CSS utilities

### UI & Styling
- **Tailwind CSS** - Utility-first CSS
- **Custom Glass UI** - Glassmorphism effects
- **Dark/Light Themes** - Multiple theme support including Catppuccin and Dracula

## Architecture

### Core Components
- `AuthProvider` - Authentication context and user management
- `QueryProvider` - React Query configuration
- `ThemeProvider` - Theme management and system preferences
- `RouterProvider` - React Router setup

### Feature Organization
```
src/
├── components/
│   ├── auth/       # Authentication components
│   ├── chat/       # Chat interface components
│   ├── metrics/    # Analytics and metrics
│   └── ui/         # Reusable UI components
├── hooks/          # Custom React hooks
├── lib/           
│   ├── queries/    # Database queries
│   └── utils/      # Utility functions
├── routes/         # Route components
├── stores/         # Zustand stores
└── types/          # TypeScript types
```

### Key Features

#### Authentication
- Email/password authentication
- Admin role support
- Avatar management
- Account deletion

#### Chat Interface
- Virtualized message list
- Real-time updates
- Message search
- Favorites system
- PIN protection for sensitive chats

#### Performance Optimizations
- Code splitting with React.lazy
- Virtualized lists for large datasets
- Optimized database queries
- Efficient re-renders with memo and useMemo
- Image lazy loading

#### UI/UX Features
- Responsive design
- Keyboard shortcuts
- Loading states
- Error boundaries
- Toast notifications
- Glass UI effects
- Theme system

## Database Schema

### Core Tables
- `participants` - Chat participants
- `messages` - Chat messages
- `favorites` - User favorites
- `protected_chats` - PIN-protected chats

### Security
- Row Level Security (RLS)
- Role-based access control
- PIN protection system

## Performance Considerations

### Frontend
- Virtualized rendering for large lists
- Lazy loading of routes and components
- Efficient state management with Zustand
- Optimized re-renders
- Asset optimization

### Backend
- Optimized database queries
- Efficient joins and aggregations
- Proper indexing
- Caching strategies

## Development Workflow

### Setup
1. Clone repository
2. Install dependencies with `pnpm install`
3. Set up environment variables
4. Start development server with `pnpm dev`

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ADMIN_EMAIL_1=admin_email
VITE_ADMIN_EMAIL_2=secondary_admin_email
```

### Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint