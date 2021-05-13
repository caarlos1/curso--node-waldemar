import { Beach } from '@src/models/beach'
import { User } from '@src/models/user'
import AuthService from '@src/services/auth'

describe('Beaches functional tests', () => {
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
  })

  describe('When creating a beach', () => {
    it('should create a beach with sucess', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      }

      const response = await global.testRequest
        .post('/beaches')
        .set({ 'x-access-token': token })
        .send(newBeach)
      expect(response.status).toBe(201)
      expect(response.body).toEqual(expect.objectContaining(newBeach))
    })

    it('should return 422 when there is a validation error', async () => {
      const newBeach = {
        lat: 'invalid_string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      }

      const response = await global.testRequest
        .post('/beaches')
        .set({ 'x-access-token': token })
        .send(newBeach)
      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        code: 422,
        error:
          'Beach validation failed: lat: Cast to Number failed for value "invalid_string" at path "lat"',
      })
    })

    // it.skip('should return 500 when there is any error other than validation error', async () => {
    //   // O professor não implementou e deixou aberto para os alunos enviarem sugestões.
    // })
  })
})
