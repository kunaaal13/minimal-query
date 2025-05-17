import { QueryKey, QueryOptions, QueryState } from './types'

type QueryConfig<T = unknown, E = Error> = {
  key: QueryKey
  options: QueryOptions
  state: QueryState<T, E>
}

class Query<T = unknown, E = Error> {
  private key: QueryKey
  private options: QueryOptions
  private state: QueryState<T, E>

  constructor({ key, options, state }: QueryConfig<T, E>) {
    this.key = key
    this.options = options
    this.state = state
  }
}

export default Query
