import type { Weather } from '../types/index.js'

function clamp(
  value: number,
  minimum = 0,
  maximum = 100,
): number {
  return Math.min(maximum, Math.max(minimum, value))
}

function rangeScore(
  value: number,
  idealMin: number,
  idealMax: number,
  tolerance: number,
): number {
  if (value >= idealMin && value <= idealMax) {
    return 100
  }

  const distance =
    value < idealMin
      ? idealMin - value
      : value - idealMax

  return clamp(100 - (distance / tolerance) * 100)
}

function calculateApparentTemperature(
  temperature: number,
  humidity: number,
): number {
  const humidityEffect =
    ((humidity - 50) / 50) *
    Math.max(0, temperature - 15) *
    0.12

  return temperature + humidityEffect
}

function calculateWindScore(
  temperature: number,
  windSpeed: number,
): number {
  if (temperature >= 24) {
    if (windSpeed <= 3) {
      return 100
    }

    return clamp(100 - ((windSpeed - 3) / 10) * 100)
  }

  if (windSpeed <= 1.5) {
    return 100
  }

  return clamp(100 - ((windSpeed - 1.5) / 8) * 100)
}

function calculateCloudinessScore(
  temperature: number,
  cloudiness: number,
): number {
  if (temperature >= 28) {
    return rangeScore(cloudiness, 20, 70, 40)
  }

  return rangeScore(cloudiness, 0, 50, 50)
}

export function calculateComfortIndex({
  temperature,
  humidity,
  windSpeed,
  cloudiness,
  visibility,
}: Pick<
  Weather,
  'temperature' |
  'humidity' |
  'windSpeed' |
  'cloudiness' |
  'visibility'
>): number {

  const visibilityScore = rangeScore (
    visibility,
    5000,
    10000,
    5000,
  )

  const apparentTemperature =
    calculateApparentTemperature(
      temperature,
      humidity,
    )

  const temperatureScore = rangeScore(
    apparentTemperature,
    20,
    26,
    15,
  )

  const humidityScore = rangeScore(
    humidity,
    40,
    60,
    40,
  )

  const windScore = calculateWindScore(
    temperature,
    windSpeed,
  )

  const cloudinessScore = calculateCloudinessScore(
    temperature,
    cloudiness,
  )

  const weightedScore =
    temperatureScore * 0.55 +
    humidityScore * 0.20 +
    windScore * 0.15 +
    cloudinessScore * 0.10 +
    visibilityScore * 0.05

  return Math.round(clamp(weightedScore))
}