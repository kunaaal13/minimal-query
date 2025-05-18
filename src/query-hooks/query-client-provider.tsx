import { createContext, useContext } from 'react'
import QueryClient from '../core/query-client'

const context = createContext<QueryClient | undefined>(undefined)

export const QueryClientProvider = ({
  children,
  client,
}: {
  children: React.ReactNode
  client: QueryClient
}) => {
  return <context.Provider value={client}>{children}</context.Provider>
}

export const useQueryClient = () => {
  const client = useContext(context)

  if (!client) {
    throw new Error('QueryClient not found in context')
  }

  return client
}
