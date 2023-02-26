import { APPOtions } from './types'
import Bot from './bot/exampleBot'

const defaultOptions: APPOtions = {
  botToken: '',
}

export default class APP {
  private readonly option
  private readonly bot

  constructor(options: Partial<APPOtions>) {
    this.option = {
      ...defaultOptions,
      ...options,
    }
    this.bot = new Bot(this.option)
  }

  async init(): Promise<void> {
    await this.bot.init()
  }

  async start(): Promise<void> {
    await this.bot.start()
  }
}
