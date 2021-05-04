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

    const stormGlass = new StormGlass(axios)
    const response = await stormGlass.fetchPoints(lat, lng)
    expect(response).toEqual(stormGlassNormalized3HoursFixture)
  })
})
