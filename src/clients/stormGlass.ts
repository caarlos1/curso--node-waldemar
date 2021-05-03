import { AxiosStatic } from 'axios' // Importando o tipo AxiosStatic

export interface StormGlassPointSource {
  [key: string]: number // Pegando a chave de forma dinâmica.
}

export interface StormGlassPoint {
  readonly time: string
  readonly waveHeight: StormGlassPointSource
  readonly waveDirection: StormGlassPointSource
  readonly swellHeight: StormGlassPointSource
  readonly swellDirection: StormGlassPointSource
  readonly swellPeriod: StormGlassPointSource
  readonly windDirection: StormGlassPointSource
  readonly windSpeed: StormGlassPointSource
}

// Resposta da API externa.
export interface StormGlassForecastResponse {
  hours: StormGlassPoint[] // Espera uma lista de tipo StormGlassPoint
}

export interface ForecastPoint {
  time: string
  waveHeight: number
  waveDirection: number
  swellHeight: number
  swellDirection: number
  swellPeriod: number
  windDirection: number
  windSpeed: number
}

export class StormGlass {
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed'
  readonly stormGlassAPISource = 'noaa'
  constructor(protected request: AxiosStatic) {}

  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    const response = await this.request.get<StormGlassForecastResponse>(
      `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&end=1592113802&lat=${lat}&lng=${lng}`
    )

    return this.normalizeResponse(response.data)
  }

  // Método que normaliza os dados recebidos pela requisição.
  private normalizeResponse(
    points: StormGlassForecastResponse
  ): ForecastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      time: point.time,
      waveHeight: point.waveHeight[this.stormGlassAPISource],
      waveDirection: point.waveDirection[this.stormGlassAPISource],
      swellHeight: point.swellHeight[this.stormGlassAPISource],
      swellDirection: point.swellDirection[this.stormGlassAPISource],
      swellPeriod: point.swellPeriod[this.stormGlassAPISource],
      windDirection: point.windDirection[this.stormGlassAPISource],
      windSpeed: point.windSpeed[this.stormGlassAPISource],
    }))
  }

  // Método que valida os Points
  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    // Verifica se existem todos os valores válidos.
    // Não entendi direito o que o ? faz ali em baixo.
    return !!(
      point.time &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    )
  }
}
