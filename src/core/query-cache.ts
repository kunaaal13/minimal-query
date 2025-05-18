import { hashKey } from './hash'
import Query, { QueryConfig } from './query'
import QueryClient from './query-client'
import { QueryKey } from './types'

class QueryCache {
  private queries: Map<string, Query>

  constructor() {
    this.queries = new Map<string, Query>()
  }

  clear() {
    this.queries.clear()
  }

  getQueryFromCache<T = unknown, E = Error>(
    key: QueryKey
  ): Query<T, E> | undefined {
    const hashedKey = hashKey(key)
    return this.queries.get(hashedKey) as Query<T, E>
  }

  buildQuery<T = unknown, E = Error>(
    client: QueryClient,
    queryKey: QueryKey,
    queryConfig: QueryConfig<T, E>
  ): Query<T, E> {
    // Check if the query is already in the cache, if so, return it
    const existingQuery = this.getQueryFromCache<T, E>(queryKey)
    if (existingQuery) {
      return existingQuery
    }

    // If not, create a new query and add it to the cache
    const query = new Query<T, E>(client, queryConfig)
    this.addQuery(query)

    return query
  }

  addQuery<T = unknown, E = Error>(query: Query<T, E>) {
    if (!this.queries.has(query.queryHash)) {
      this.queries.set(query.queryHash, query as Query)
    }
  }

  removeQuery(queryKey: QueryKey) {
    const hashedKey = hashKey(queryKey)
    if (this.queries.has(hashedKey)) {
      this.queries.delete(hashedKey)
    }
  }
}

export default QueryCache
