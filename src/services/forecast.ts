import { ForecastPoint, StormGlass } from '@src/clients/stormGlass'

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  name: string
  position: BeachPosition
  lat: number
  lng: number
  user: string
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export interface TimeForecast {
  time: string
  forecast: BeachForecast[]
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = []
    for (const beach of beaches) {
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng)
      const enrichedBeachData = points.map((e) => ({
        ...{},
        ...{
          lat: beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          rating: 1,
        },
        ...e,
      }))
      pointsWithCorrectSources.push(...enrichedBeachData)
    }
    return this.mapForecasByTime(pointsWithCorrectSources)
  }

  private mapForecasByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = []
    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time == point.time) // caso exista, retorna o primeiro valor.
      // Caso exista um time
      if (timePoint) timePoint.forecast.push(point)
      // caso contrario cria um time
      else
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        })
    }
    return forecastByTime
  }
}
