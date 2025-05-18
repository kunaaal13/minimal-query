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

  subscribe(callback: () => void) {
    // Set the notify function to the callback -> This is the render function that will be called when the query changes
    this.notify = callback

    // Subscribe to the query -> This is the function that will be called when the query changes
    // This will return a function that will be called when the observer is unsubscribed
    const unsubscribe = this.query.subscribe(this)

    // Fetch the data from the query
    this.query.fetch()

    // Return the unsubscribe function -> This is the function that will be called when the observer is unsubscribed
    return unsubscribe
  }

  getResult<T = unknown, E = Error>(): QueryState<T, E> {
    return this.query.state as QueryState<T, E>
  }
}

export default QueryObserver
