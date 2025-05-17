import Query from './query'

class QueryCache {
  private queries: Map<string, Query>

  constructor() {
    this.queries = new Map<string, Query>()
  }
}

export default QueryCache
