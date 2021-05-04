import { StormGlass } from '@src/clients/stormGlass'
import axios from 'axios'
import stormGlassWather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json'
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json'

jest.mock('axios') //  Limpar mocks da dependencia.

describe('StormGlass client', () => {
  // Adicionando os tipos dos jest mocked no axios (somente para testes).
  const mockedAxios = axios as jest.Mocked<typeof axios>

  it('should return the normalized forecast from the StormGlass service', async () => {
    const lat = -33.792726
    const lng = 151.289824

    // Fiz um mock para que a função axios.get retorne esse objeto.
    mockedAxios.get.mockResolvedValue({ data: stormGlassWather3HoursFixture })

    const stormGlass = new StormGlass(mockedAxios)
    const response = await stormGlass.fetchPoints(lat, lng)
    expect(response).toEqual(stormGlassNormalized3HoursFixture)
  })

  it('should exclude incomplete data poinst', async () => {
    const lat = -33.792726
    const lng = 151.289824
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-04-26T00:00:00+00:00',
        },
      ],
    }

    mockedAxios.get.mockResolvedValue({ data: incompleteResponse })

    const stormGlass = new StormGlass(mockedAxios)
    const response = await stormGlass.fetchPoints(lat, lng)

    expect(response).toEqual([])
  })

  it('should get a generic error from StormClass service hen the request fail before reaching the service', async () => {
    const lat = -33.792726
    const lng = 151.289824

    mockedAxios.get.mockRejectedValue({ message: 'Network Error' })

    const stormGlass = new StormGlass(mockedAxios)

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    )
  })

  it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    const lat = -33.792726
    const lng = 151.289824

    mockedAxios.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      },
    })

    const stormGlass = new StormGlass(mockedAxios)

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    )
  })
})
