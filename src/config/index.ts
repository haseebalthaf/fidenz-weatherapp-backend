import { deserializeCities } from '../deserializers/citiesDeserializer.js'
import type { CacheConfig, CitiesData, City } from '../types/index.js'

let cityListPromise: Promise<City[]> | undefined
let cacheConfig: CacheConfig | undefined

export function getCityList(): Promise<City[]> {
  cityListPromise ??= import('../data/cities.json', {
    with: { type: 'json' },
  }).then(({ default: cities }: { default: CitiesData }) => deserializeCities(cities))

  return cityListPromise
}

export function getCacheConfig(): CacheConfig {
  cacheConfig ??= {
    ttl: 5 * 60 * 1000,
    weather: new Map(),
    processed: new Map(),
  }

  return cacheConfig
}
