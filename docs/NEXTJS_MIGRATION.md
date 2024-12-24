# Next.js Migration Guide

[Previous content remains the same until Phase 1...]

### Phase 1: Project Setup & Dependencies

1. **Initialize Next.js Project**
```bash
pnpm create next-app chat-history-viewer --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

2. **Update Dependencies**
```json
{
  "dependencies": {
    "next": "14.1.0",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "@supabase/ssr": "0.1.0",  // New SSR-focused package
    "@supabase/supabase-js": "2.39.7",
    "@tanstack/react-query": "5.24.1",
    "zustand": "4.5.1"
  }
}
```

[Previous content remains the same until Server Components section...]

### New Sections to Add:

## Server Actions & Forms

```typescript
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createServerActionClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function sendMessage(formData: FormData) {
  const supabase = createServerActionClient({ cookies })
  const message = formData.get('message')
  const participantId = formData.get('participantId')

  await supabase
    .from('messages')
    .insert({ message, participant_id: participantId })

  revalidatePath(`/chats/${participantId}`)
}

// app/chats/[id]/page.tsx
import { sendMessage } from '@/app/actions'

export default function ChatPage() {
  return (
    <form action={sendMessage}>
      <input type="text" name="message" />
      <button type="submit">Send</button>
    </form>
  )
}
```

## Partial Prerendering (Next.js 14.1+)

```typescript
// app/page.tsx
import { Suspense } from 'react'
import { unstable_noStore as noStore } from 'next/cache'

async function ChatList() {
  noStore()
  // Fetch chats...
}

export default function HomePage() {
  return (
    <main>
      <h1>Chat History</h1>
      <Suspense fallback={<ChatListSkeleton />}>
        <ChatList />
      </Suspense>
    </main>
  )
}
```

## Parallel Routes & Intercepting Routes

```typescript
// app/@modal/(.)chats/[id]/page.tsx
export default function InterceptedChatModal({ params }) {
  return (
    <div className="modal">
      <ChatDetail participantId={params.id} />
    </div>
  )
}

// app/layout.tsx
export default function RootLayout({ 
  children,
  modal
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
        {modal}
      </body>
    </html>
  )
}
```

## View Transitions

```typescript
// app/layout.tsx
import { useViewTransition } from 'next/navigation'

export default function Layout({ children }) {
  const viewTransition = useViewTransition()

  return (
    <div style={{ viewTransitionName: viewTransition ? 'page' : '' }}>
      {children}
    </div>
  )
}
```

[Rest of the previous content remains the same...]