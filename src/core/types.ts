export type QueryKey = ReadonlyArray<unknown>

export type DefaultOptions = {
  enabled: boolean
  staleTime: number
  gcTime: number
  refetchOnWindowFocus: boolean
}
