import { SetupServer } from '@src/server'
import supertest from 'supertest'

// Antes de todos os testes da aplicação:
beforeAll(() => {
  const server = new SetupServer()
  server.init() // iniciando o servidor.
  // Setando o servidor de modo global para os testes.
  global.testRequest = supertest(server.getApp())
})
