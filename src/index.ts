import { APPOtions } from './types'
import Bot from './bot'
import sequelize from './db'
import { Sequelize } from 'sequelize-typescript'

const defaultOptions: APPOtions = {
  botToken: '',
}

export default class APP {
  private readonly option
  private readonly bot
  private db?: Sequelize

  constructor(options: Partial<APPOtions>) {
    this.option = {
      ...defaultOptions,
      ...options,
    }
    this.bot = new Bot(this.option)
  }

  async init(): Promise<void> {
    await this.bot.init()
    await this.initializeDatabase()
    await this.initializeConstants()
  }

  async start(): Promise<void> {
    await this.bot.start()
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
