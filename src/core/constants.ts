import { DefaultOptions } from './types'

export const QUERY_KEY_PREFIX = 'query'

export const DEFAULT_OPTIONS: DefaultOptions = {
  enabled: true,
  staleTime: 0, // 0 seconds
  gcTime: 1000 * 60 * 5, // 5 minutes
  refetchOnWindowFocus: true,
}
