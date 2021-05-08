import './util/module-alias' // importando alias.
import { Controller, Server } from '@overnightjs/core'
import bodyParser from 'body-parser'
import { ForecastController } from './controllers/forecast'
import { BeachesController } from './controllers/beaches'
import { UsersController } from './controllers/users'
import { Application } from 'express'
import * as database from '@src/database'

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super()
  }

  public async init(): Promise<void> {
    this.setupExpress()
    this.setupControllers()
    await this.setupDatabase()
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json())
  }

  private setupControllers(): void {
    const forecastController = new ForecastController()
    const beachesController = new BeachesController()
    const userController = new UsersController()
    this.addControllers([forecastController, beachesController, userController])
  }

  private async setupDatabase(): Promise<void> {
    await database.connect()
  }

  public async close(): Promise<void> {
    await database.close()
  }

  public getApp(): Application {
    return this.app // Retornando o servidor "app" heradodo do overnight
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.info('Server listeing of port:', this.port)
    })
  }
}
