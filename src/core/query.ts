import { DEFAULT_QUERY_STATE } from './constants'
import { hashKey } from './hash'
import QueryClient from './query-client'
import QueryObserver from './query-observer'
import { QueryKey, QueryOptions, QueryState } from './types'

export type QueryConfig<T = unknown, E = Error> = {
  queryKey: QueryKey
  options?: Partial<QueryOptions>
  queryFn: () => Promise<T>
}

class Query<T = unknown, E = Error> {
  private queryKey: QueryKey
  private client: QueryClient
  queryHash: string
  options: QueryOptions
  state: QueryState<T, E>
  private queryFn: () => Promise<T>
  private activePromise: Promise<T | undefined> | undefined = undefined
  private subscribers: Set<QueryObserver>
  private gcTimeout: NodeJS.Timeout | undefined

  constructor(
    client: QueryClient,
    { queryKey, options, queryFn }: QueryConfig<T, E>
  ) {
    this.queryKey = queryKey

    this.client = client

    this.queryHash = hashKey(queryKey)

    this.options = options
      ? { ...this.client.queryOptions, ...options }
      : this.client.queryOptions

    this.state = DEFAULT_QUERY_STATE as QueryState<T, E>

    this.queryFn = queryFn
    this.subscribers = new Set()
  }

  // Schedule a Garbage Collection
  scheduleGarbageCollection() {
    this.gcTimeout = setTimeout(() => {
      this.client.removeQuery(this.queryKey)
    }, this.options.gcTime)
  }

  // Clear the Garbage Collection timeout
  clearGarbageCollection() {
    if (this.gcTimeout) {
      clearTimeout(this.gcTimeout)
      this.gcTimeout = undefined
    }
  }

  // Subscribe to the query
  subscribe(observer: QueryObserver) {
    this.subscribers.add(observer)

    // Clear the Garbage Collection timeout when a subscriber is added
    this.clearGarbageCollection()

    return () => this.unsubscribe(observer)
  }

  // Unsubscribe from the query
  unsubscribe(observer: QueryObserver) {
    this.subscribers.delete(observer)

    if (this.subscribers.size === 0) {
      // Schedule a Garbage Collection when the last subscriber is removed
      this.scheduleGarbageCollection()
    }
  }

  // Notify all subscribers
  notifySubscribers() {
    this.subscribers.forEach((observer) => observer.notify?.())
  }

  // Update the state of the query - this is used to update the state of the query
  // updateFn is a function that takes the current state and returns the new state
  // This function will notify all subscribers when the state is updated
  updateState(updateFn: (state: QueryState<T, E>) => QueryState<T, E>) {
    this.state = updateFn(this.state)
    this.notifySubscribers()
  }

  // This is the main function that fetches the data from the API
  // Storing a promise in the class instance allows us to avoid race conditions when multiple calls to fetch are made
  // If a promise is already active, return it
  async fetch() {
    if (this.activePromise) {
      return this.activePromise
    }

    const executeFetch = async (): Promise<T | undefined> => {
      // 1. Update state to loading and fetching
      this.updateState((state) => ({
        ...state,
        fetchStatus: 'fetching',
        error: undefined,
      }))

      // 2. Fetch data
      try {
        const data = await this.queryFn()
        this.updateState((state) => ({
          ...state,
          data,
          status: 'success',
          lastUpdatedAt: new Date(),
        }))

        return data
      } catch (error) {
        this.updateState((state) => ({
          ...state,
          data: undefined,
          status: 'error',
          error: error as E,
        }))
      } finally {
        // 3. Update state to idle
        this.updateState((state) => ({
          ...state,
          fetchStatus: 'idle',
        }))

        // 4. Reset the promise to undefined to allow for a new fetch
        this.activePromise = undefined
      }
    }

    this.activePromise = executeFetch()

    return this.activePromise
  }
}

export default Query
