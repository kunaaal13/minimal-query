# Minimal Query

A minimal, educational re-implementation of the core ideas behind [React Query](https://tanstack.com/query/latest) for learning and experimentation.  
This project demonstrates the essential architecture and flow of a query caching and subscription system for React apps.

---

## 🏗️ Architecture Overview

![Architecture Diagram](/public/architecture.png)

### Basic Structure

- **QueryClient**: The main entry point. Holds global defaults and a reference to the query cache.
- **QueryCache**: Stores and manages all active queries, ensuring deduplication and cache management.
- **Query**: Represents a single query's state, data, and lifecycle (fetching, error, success, etc).
- **Defaults for Query**: Global options (like stale time, GC time) provided to all queries unless overridden.

### Query Working

- **useQuery**: React hook that creates a `QueryObserver` for a given query.
- **QueryObserver**: Subscribes to a `Query`, listens for changes, and notifies the hook/component.
- **Query**: Informs observers of state changes (data, error, status).
- **Flow**:
  1. `useQuery` creates a `QueryObserver`.
  2. Observer subscribes to a `Query` (from cache or new).
  3. Observer notifies the React component on changes.
  4. Query manages its own state, fetching, and garbage collection.

---

## 🧩 Core Concepts & Files

| Concept             | File(s)                                                          | Description                                                        |
| ------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| QueryClient         | `src/core/query-client.ts`                                       | Main interface for consumers. Manages cache and global options.    |
| QueryCache          | `src/core/query-cache.ts`                                        | Stores and manages all queries. Handles deduplication and removal. |
| Query               | `src/core/query.ts`                                              | Represents a single query's state, data, and lifecycle.            |
| QueryObserver       | `src/core/query-observer.ts`                                     | Subscribes to a query, notifies React hook/component on changes.   |
| useQuery            | `src/query-hooks/use-query.tsx`                                  | React hook for using queries in components.                        |
| QueryClientProvider | `src/query-hooks/query-client-provider.tsx`                      | React context provider for the QueryClient.                        |
| Types & Utils       | `src/core/types.ts`, `src/core/hash.ts`, `src/core/constants.ts` | Type definitions, hashing, and default options.                    |

---

## ⚙️ How It Works

1. **Setup**:  
   Wrap your app in a `QueryClientProvider` and provide a `QueryClient` instance.

2. **Using Queries**:  
   Call `useQuery({ queryKey, queryFn })` in your component.

   - The hook creates a `QueryObserver` for the query.
   - The observer subscribes to the query (from cache or new).
   - The observer triggers re-renders on state changes.

3. **Query Lifecycle**:
   - If the query is not in cache, it's created and added.
   - Query state is managed (pending, fetching, success, error).
   - Observers are notified on state changes.
   - When no observers remain, the query is garbage collected after a timeout.

---

## 🚀 Usage Example

```tsx
import { QueryClient, QueryClientProvider, useQuery } from 'minimal-query'

const queryClient = new QueryClient({})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  )
}

function Todos() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/api/todos').then((res) => res.json()),
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error!</div>
  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  )
}
```

---

## 📝 Design Decisions & Approach

- **Minimalism**: Only the core logic is implemented—no retries, no background refetch, no devtools, etc.
- **Cache & GC**: Queries are cached and garbage collected after a configurable timeout when unused.
- **Stale Data**: Queries become stale after a configurable time, triggering refetches as needed.
- **Subscription Model**: Observers subscribe to queries and are notified on state changes, enabling React reactivity.
- **TypeScript**: All logic is strongly typed for safety and clarity.
- **Inspired by React Query**: The architecture and many patterns are inspired by TanStack Query, but simplified for learning.

---

## 🆚 How is this different from React Query?

- No background refetch, retries, or advanced features.
- No mutation support.
- No devtools or React Native support.
- Designed for clarity and learning, not production.

---

## 📁 File Structure

```
src/
  core/
    query-client.ts
    query-cache.ts
    query.ts
    query-observer.ts
    types.ts
    constants.ts
    hash.ts
  query-hooks/
    use-query.tsx
    query-client-provider.tsx
```

---

## 📚 References

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Query Source Code](https://github.com/TanStack/query)

---

Let me know if you want to add more details, code samples, or a section on extending this further!
