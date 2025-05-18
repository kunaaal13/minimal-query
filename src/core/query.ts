import { hashKey } from './hash'
import { QueryKey, QueryOptions, QueryState } from './types'

export type QueryConfig<T = unknown, E = Error> = {
  key: QueryKey
  options: QueryOptions
  state: QueryState<T, E>
  fetchFn: () => Promise<T>
}

class Query<T = unknown, E = Error> {
  private key: QueryKey
  queryHash: string
  private options: QueryOptions
  private state: QueryState<T, E>
  private fetchFn: () => Promise<T>
  private activePromise: Promise<T> | undefined = undefined
  private subscribers: Set<() => void> = new Set()

  constructor({ key, options, state, fetchFn }: QueryConfig<T, E>) {
    this.key = key
    this.queryHash = hashKey(key)
    this.options = options
    this.state = state
    this.fetchFn = fetchFn
  }

  // Update the state of the query - this is used to update the state of the query
  // updateFn is a function that takes the current state and returns the new state
  updateState(updateFn: (state: QueryState<T, E>) => QueryState<T, E>) {
    this.state = updateFn(this.state)
  }

  // This is the main function that fetches the data from the API
  // Storing a promise in the class instance allows us to avoid race conditions when multiple calls to fetch are made
  // If a promise is already active, return it
  async fetch() {
    if (this.activePromise) {
      return this.activePromise
    }

    const executeFetch = async (): Promise<T> => {
      // 1. Update state to loading and fetching
      this.updateState((state) => ({
        ...state,
        fetchStatus: 'fetching',
        error: undefined,
      }))

      // 2. Fetch data
      try {
        const data = await this.fetchFn()
        this.updateState((state) => ({
          ...state,
          data,
          status: 'success',
        }))

        return data
      } catch (error) {
        this.updateState((state) => ({
          ...state,
          data: undefined,
          status: 'error',
          error: error as E,
        }))

        throw error
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

    return await executeFetch()
  }
}

export default Query
