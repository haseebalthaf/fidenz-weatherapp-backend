export interface City {
  id: number
  name: string
  temperature: number
  status: string
}

export interface RawCity {
  CityCode: string
  CityName: string
  Temp: string
  Status: string
}

export interface CitiesData {
  List: RawCity[]
}

export interface Weather {
  id: number
  name: string
  country: string
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  cloudiness: number
  description: string
  visibility: number
  icon: string
  updatedAt: string
}

export type CacheStatus = 'HIT' | 'MISS'

export interface WeatherResult extends Weather {
  cache: CacheStatus
}

export interface RankedWeather extends Weather {
  cache?: 'HIT' | 'MISS'
  score: number
  rank: number
}

export interface WeatherPayload {
  cities: RankedWeather[]
  generatedAt: string
  source: string
  cityCount: number
}

export interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export interface CacheConfig {
  ttl: number
  weather: Map<number, CacheEntry<Weather>>
  processed: Map<string, CacheEntry<WeatherPayload>>
}
