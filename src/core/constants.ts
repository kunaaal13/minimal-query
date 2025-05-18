import { QueryOptions, QueryState } from './types'

export const DEFAULT_QUERY_OPTIONS: QueryOptions = {
  enabled: true,
  gcTime: 1000 * 60 * 5,
  staleTime: 1000 * 60 * 5,
  refetchOnWindowFocus: true,
}

export const DEFAULT_QUERY_STATE: QueryState<unknown, Error> = {
  data: undefined,
  error: undefined,
  status: 'pending',
  fetchStatus: 'idle',
}
