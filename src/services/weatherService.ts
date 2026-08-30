import { getCachedValue, setCachedValue } from '../lib/cache.js'
import { getCacheConfig, getCityList } from '../config/index.js'
import { AppError } from '../lib/errors.js'
import { calculateComfortIndex } from '../utils/comfortIndex.js'
import type { City, RankedWeather, WeatherPayload, WeatherResult } from '../types/index.js'

interface OpenWeatherResponse {
  name: string
  sys?: { country?: string }
  main: { temp: number; feels_like: number; humidity: number }
  wind?: { speed?: number }
  clouds?: { all?: number }
  weather?: Array<{ description?: string; icon?: string }>
}

export async function fetchCityWeather(city: City): Promise<WeatherResult> {
  const { ttl: cacheTtl, weather: weatherCache } = getCacheConfig()
  const cached = getCachedValue(weatherCache, city.id)

  if (cached.hit) {
    return { ...cached.value, cache: 'HIT' }
  }

  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey) {
    throw new AppError('Weather service is unavailable: OPENWEATHER_API_KEY is not configured', 500)
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?id=${city.id}&appid=${apiKey}&units=metric`
  const response = await fetch(url)

  if (!response.ok) {
    throw new AppError(`OpenWeatherMap returned ${response.status}`, 502)
  }

  const data = await response.json() as OpenWeatherResponse
  const value = {
    id: city.id,
    name: data.name,
    country: data.sys?.country || 'N/A',
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    windSpeed: data.wind?.speed || 0,
    cloudiness: data.clouds?.all || 0,
    description: data.weather?.[0]?.description || 'Unknown',
    icon: data.weather?.[0]?.icon || '01d',
    updatedAt: new Date().toISOString(),
  }

  setCachedValue(weatherCache, city.id, value, cacheTtl)
  return { ...value, cache: 'MISS' }
}

export async function getWeatherPayload() {
  const cityList = await getCityList()
  const { ttl: cacheTtl, processed: processedCache } = getCacheConfig()
  const cached = getCachedValue(processedCache, 'weather')

  if (cached.hit) {
    return { ...cached.value, cache: 'HIT' as const }
  }

  const weather = await Promise.all(cityList.map(fetchCityWeather))
  const ranked: RankedWeather[] = weather
    .map((city) => ({ ...city, score: calculateComfortIndex(city) }))
    .sort((a, b) => b.score - a.score)
    .map((city, index) => ({ ...city, rank: index + 1 }))

  const payload: WeatherPayload = {
    cities: ranked,
    generatedAt: new Date().toISOString(),
    source: 'OpenWeatherMap',
    cityCount: cityList.length,
  }

  setCachedValue(processedCache, 'weather', payload, cacheTtl)
  return { ...payload, cache: 'MISS' as const }
}
