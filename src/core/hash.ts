import { QueryKey } from './types'
import { isPlainObject } from '@tanstack/react-router'

export function hashQueryKey(queryKey: QueryKey): string {
  return JSON.stringify(queryKey, (_, val) =>
    isPlainObject(val)
      ? Object.keys(val)
          .sort()
          .reduce(
            (result: Record<string, unknown>, key: string) => {
              // Type assertion here since we know it's a plain object
              const obj = val as Record<string, unknown>
              result[key] = obj[key]
              return result
            },
            {} as Record<string, unknown>
          )
      : val
  )
}
