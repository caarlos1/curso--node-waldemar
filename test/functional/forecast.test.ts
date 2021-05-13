import { Beach, BeachPosition } from '@src/models/beach'
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json'
import apiForecastResponse1BeachFixture from '@test/fixtures/api_forecast_response_1_beach.json'
import { User } from '@src/models/user'
import nock from 'nock'
import AuthService from '@src/services/auth'

// Descrevendo bloco de teste:
describe('Beacth forecast functional tests', () => {
  const dafaultUser = {
    name: 'John Doe',
    email: 'john@email.com',
    password: '1234',
  }
  let token: string
  beforeEach(async () => {
    await Beach.deleteMany({})
    await User.deleteMany({})

    const user = await new User(dafaultUser).save()
    token = AuthService.generateToken(user.toJSON())

    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E,
      user: user.id
    }
    await new Beach(defaultBeach).save()
  })

  it('should return a forecast with just a few times', async () => {
    // nock.recorder.rec() // Interceptar a requisição feita.

    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: { Authorization: (): boolean => true },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' }) // controle de CORS
      .get('/v2/weather/point')
      .query({
        params: /(.*)/,
        source: 'noaa',
        lat: '-33.792726',
        lng: '151.289824',
      })
      .reply(200, stormGlassWeather3HoursFixture)

    const { body, status } = await global.testRequest
      .get('/forecast')
      .set({ 'x-access-token': token })
    expect(status).toBe(200) // Espero que seja estritamente igual.
    expect(body).toEqual(apiForecastResponse1BeachFixture)
  })

  it('should return 500 if something goes wrong during the processing', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: { Authorization: (): boolean => true },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' }) // controle de CORS
      .get('/v2/weather/point')
      .query({ lat: '-33.792726', lng: '151.289824' })
      .replyWithError('Something went wrong')

    const { status } = await global.testRequest
      .get('/forecast')
      .set({ 'x-access-token': token })
    expect(status).toBe(500)
  })
})
