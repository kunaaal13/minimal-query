import { hashQueryKey } from './hash'
import { QueryKey } from './types'

type CacheEntry<T> = {
  state: 'pending' | 'success' | 'error'
  queryFn: () => Promise<T>
}

export class QueryCache {
  private queryCache: Map<string, CacheEntry<any>>

  constructor() {
    this.queryCache = new Map<string, CacheEntry<any>>()
  }

  getQueryData<T>(queryKey: QueryKey) {
    const cacheKey = hashQueryKey(queryKey)
  }
}
