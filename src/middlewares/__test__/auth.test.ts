import AuthService from '@src/services/auth'
import { authMiddleware } from '../auth'

describe('AuthMiddleare', () => {
  it('should verify a JWT token and call the next middleware', () => {
    const jwtToken = AuthService.generateToken({ data: 'fake ' })
    const reqFake = {
      headers: {
        'x-acess-token': jwtToken,
      },
    }
    const resFake = {}
    const nextFake = jest.fn()
    authMiddleware(reqFake, resFake, nextFake)
    expect(nextFake).toHaveBeenCalled()
  })

  it('should return UNAUTHORIZED if there is a problem on the token verification', () => {
    const reqFake = {
      headers: {
        'x-acess-token': 'invalid token',
      },
    }
    const sendMock = jest.fn()
    const resFake = {
      status: jest.fn((status: number) => ({
        send: sendMock,
        status,
      })),
    }
    const nextFake = jest.fn()

    authMiddleware(reqFake, resFake as object, nextFake)

    expect(resFake.status).toHaveBeenCalledWith(401)
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt malformed',
    })
  })

  it('should return UNAUTHORIZED middleware if theres no token', () => {
    const reqFake = {
      headers: {},
    }
    const sendMock = jest.fn()
    const resFake = {
      status: jest.fn((status: number) => ({
        send: sendMock,
        status,
      })),
    }
    const nextFake = jest.fn()

    authMiddleware(reqFake, resFake as object, nextFake)

    expect(resFake.status).toHaveBeenCalledWith(401)
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt must be provided',
    })
  })
})
