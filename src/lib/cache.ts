import type { CacheEntry } from '../types/index.js'

export type CacheLookup<T> =
  | { hit: true; value: T }
  | { hit: false }

export function getCachedValue<K, T>(cache: Map<K, CacheEntry<T>>, key: K): CacheLookup<T> {
  const entry = cache.get(key)
  if (!entry || entry.expiresAt <= Date.now()) return { hit: false }
  return { hit: true, value: entry.value }
}

export function setCachedValue<K, T>(
  cache: Map<K, CacheEntry<T>>,
  key: K,
  value: T,
  ttl: number,
): void {
  cache.set(key, { value, expiresAt: Date.now() + ttl })
}

export function countValidEntries<K, T>(cache: Map<K, CacheEntry<T>>): number {
  let count = 0
  for (const key of cache.keys()) {
    if (getCachedValue(cache, key).hit) count += 1
  }
  return count
}
