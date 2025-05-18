import { DEFAULT_QUERY_OPTIONS } from './constants'
import { QueryConfig } from './query'
import QueryCache from './query-cache'
import { QueryKey, QueryOptions } from './types'

class QueryClient {
  private queryCache: QueryCache
  queryOptions: QueryOptions

  constructor() {
    this.queryCache = new QueryCache()
    this.queryOptions = DEFAULT_QUERY_OPTIONS
  }

  getQuery<T = unknown, E = Error>(
    queryKey: QueryKey,
    queryConfig: QueryConfig<T, E>
  ) {
    return this.queryCache.buildQuery(this, queryKey, queryConfig)
  }
}

export default QueryClient
