export type QueryKey = ReadonlyArray<unknown>

export type QueryStatus = 'pending' | 'error' | 'success'
export type FetchStatus = 'fetching' | 'paused' | 'idle'

export type QueryOptions = {
  enabled: boolean
  staleTime: number
  gcTime: number
  refetchOnWindowFocus: boolean
}

export type QueryState<T = unknown, E = Error> = {
  data: T | undefined
  error: E | undefined
  status: QueryStatus
  fetchStatus: FetchStatus
  lastUpdatedAt: Date | undefined
}

export type UseQueryResult<T = unknown, E = Error> = {
  data: T | undefined
  error: E | undefined
  status: QueryStatus
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  isStale: boolean
  lastUpdatedAt: Date | undefined
  fetchStatus: FetchStatus
}
