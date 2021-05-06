import { SetupServer } from '@src/server'
import supertest from 'supertest'

let server: SetupServer

beforeAll(async () => {
  server = new SetupServer()
  await server.init() // iniciando o servidor.
  // Setando o servidor de modo global para os testes.
  global.testRequest = supertest(server.getApp())
})

afterAll(async () => await server.close())
