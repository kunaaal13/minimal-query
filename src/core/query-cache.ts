import { hashKey } from './hash'
import Query, { QueryConfig } from './query'
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
    queryConfig: QueryConfig<T, E>
  ): Query<T, E> {
    // Check if the query is already in the cache, if so, return it
    const existingQuery = this.getQueryFromCache<T, E>(queryConfig.key)
    if (existingQuery) {
      return existingQuery
    }

    // If not, create a new query and add it to the cache
    const query = new Query<T, E>(queryConfig)
    this.addQuery(query)

    return query
  }

  addQuery<T = unknown, E = Error>(query: Query<T, E>) {
    if (!this.queries.has(query.queryHash)) {
      this.queries.set(query.queryHash, query as Query)
    }
  }

  removeQuery(query: Query) {
    if (this.queries.has(query.queryHash)) {
      this.queries.delete(query.queryHash)
    }
  }
}

export default QueryCache
