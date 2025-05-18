import Query, { QueryConfig } from './query'
import QueryClient from './query-client'
import { QueryState } from './types'

class QueryObserver {
  private query: Query
  notify: (() => void) | undefined

  constructor(queryClient: QueryClient, queryConfig: QueryConfig) {
    const query = queryClient.getQuery(queryConfig.queryKey, queryConfig)

    this.query = query
    this.notify = undefined
  }

  fetch() {
    // If the query is not enabled, return
    if (!this.query.options.enabled) {
      return
    }

    // If the query is stale, fetch the data
    const lastUpdatedAt = this.query.state.lastUpdatedAt
    if (
      !lastUpdatedAt ||
      Date.now() - lastUpdatedAt.getTime() > this.query.options.staleTime
    ) {
      this.query.fetch()
    }
  }

  subscribe(callback: () => void) {
    // Set the notify function to the callback -> This is the render function that will be called when the query changes
    this.notify = callback

    // Subscribe to the query -> This is the function that will be called when the query changes
    // This will return a function that will be called when the observer is unsubscribed
    const unsubscribe = this.query.subscribe(this)

    // Fetch the data from the query
    this.fetch()

    // Return the unsubscribe function -> This is the function that will be called when the observer is unsubscribed
    return unsubscribe
  }

  getResult<T = unknown, E = Error>(): QueryState<T, E> {
    return this.query.state as QueryState<T, E>
  }
}

export default QueryObserver
