import { useEffect, useReducer, useRef } from 'react'
import { QueryConfig } from '~/core/query'
import QueryObserver from '~/core/query-observer'
import { useQueryClient } from './query-client-provider'

function useQuery<T = unknown, E = Error>(queryConfig: QueryConfig<T, E>) {
  const client = useQueryClient()
  const observerRef = useRef<QueryObserver | undefined>(undefined)

  // This is a hack to force a re-render when the query changes
  const [_, renderer] = useReducer((i) => i + 1, 0)

  // Register an observer to the query
  if (!observerRef.current) {
    observerRef.current = new QueryObserver(
      client,
      queryConfig as QueryConfig<T, Error>
    )
  }

  // Subscribe to the query
  useEffect(() => {
    return observerRef.current?.subscribe(renderer)
  }, [])

  return observerRef.current?.getResult<T, E>()
}

export default useQuery
