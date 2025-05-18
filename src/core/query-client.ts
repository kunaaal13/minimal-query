import { DEFAULT_QUERY_OPTIONS } from './constants'
import { QueryConfig } from './query'
import QueryCache from './query-cache'
import { QueryKey, QueryOptions } from './types'

class QueryClient {
  private queryCache: QueryCache
  queryOptions: QueryOptions

  constructor(queryOptions: Partial<QueryOptions>) {
    this.queryCache = new QueryCache()
    this.queryOptions = { ...DEFAULT_QUERY_OPTIONS, ...queryOptions }
  }

  getQuery<T = unknown, E = Error>(queryConfig: QueryConfig<T, E>) {
    return this.queryCache.buildQuery(this, queryConfig.queryKey, queryConfig)
  }

  // Remove a query from the cache
  removeQuery(queryKey: QueryKey) {
    this.queryCache.removeQuery(queryKey)
  }
}

export default QueryClient
