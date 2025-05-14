export class QueryCache {
  private queries: Map<string, Query>

  constructor() {
    this.queries = new Map()
  }
}
