import QueryCache from './query-cache'

class QueryClient {
  private queryCache: QueryCache

  constructor() {
    this.queryCache = new QueryCache()
  }
}

export default QueryClient
