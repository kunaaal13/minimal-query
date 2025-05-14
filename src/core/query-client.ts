import { DEFAULT_OPTIONS } from './constants'
import { QueryCache } from './query-cache'
import { DefaultOptions } from './types'

type QueryClientProps = {
  defaultOptions?: Partial<DefaultOptions>
}

export class QueryClient {
  private queryCache: QueryCache
  private defaultOptions: DefaultOptions

  constructor({ defaultOptions }: QueryClientProps) {
    this.queryCache = new QueryCache()
    this.defaultOptions = { ...DEFAULT_OPTIONS, ...defaultOptions }
  }
}
