import { User } from '@src/models/user'

describe('User functional tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  describe('When creating a new user', () => {
    it('should sucessfully create a new user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@email.com',
        password: '1234',
      }

      const response = await global.testRequest.post('/users').send(newUser)
      expect(response.status).toBe(201)
      expect(response.body).toEqual(expect.objectContaining(newUser))
    })
  })
})
