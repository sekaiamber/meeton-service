import sequelize from '../db'
import { Sequelize } from 'sequelize-typescript'
import UserTaskRunner from './userTaskRunner'

export default class TaskRunner {
  private db?: Sequelize
  private readonly userTaskRunner

  constructor() {
    this.userTaskRunner = new UserTaskRunner()
  }

  async init(): Promise<void> {
    await this.initializeDatabase()
    await this.userTaskRunner.init()
  }

  async start(): Promise<void> {
    await this.userTaskRunner.start()
  }

  private async initializeDatabase(force = false): Promise<void> {
    // return await Promise.resolve()
    this.db = await sequelize.sync({ force })
  }

  private async initializeConstants(): Promise<void> {
    // const currentNodeVersion = await Constant.get('CurrentNodeVersion')
    // if (!currentNodeVersion) {
    //   throw new Error('CurrentNodeVersion not set')
    // }
    // const bootEndpoints = await Constant.get('BootEndpoints')
    // if (!bootEndpoints) {
    //   throw new Error('BootEndpoints not set')
    // }
  }
}
