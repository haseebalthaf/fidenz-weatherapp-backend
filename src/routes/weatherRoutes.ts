import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getCacheConfig } from '../config/index.js'
import { countValidEntries, getCachedValue } from '../lib/cache.js'
import { getWeatherPayload } from '../services/weatherService.js'

export const weatherRouter = Router()

weatherRouter.get('/health', (_request, response) => {
  response.json({ status: 'ok' })
})

weatherRouter.get('/cache', requireAuth, (_request, response) => {
  const { ttl: cacheTtl, weather: weatherCache, processed: processedCache } = getCacheConfig()

  response.json({
    rawEntries: weatherCache.size,
    rawHitsAvailable: countValidEntries(weatherCache),
    processed: getCachedValue(processedCache, 'weather').hit,
    ttlSeconds: cacheTtl / 1000,
  })
})

weatherRouter.get('/weather', requireAuth, async (_request, response) => {
  const payload = await getWeatherPayload()
  response.json(payload)
})
