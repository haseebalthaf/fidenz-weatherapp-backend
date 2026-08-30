import type { CitiesData, City } from '../types/index.js'

export function deserializeCities(cities: CitiesData): City[] {
  return cities.List.map((city) => ({
    id: Number(city.CityCode),
    name: city.CityName,
    temperature: Number(city.Temp),
    status: city.Status,
  }))
}
