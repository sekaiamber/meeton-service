import { Context, Telegraf } from 'telegraf'
import { APPOtions } from '../types'
import noGroupMiddleware from './noGroup.middleware'

export default class Bot {
  private readonly bot

  constructor(private readonly options: APPOtions) {
    this.bot = new Telegraf(options.botToken)
  }

  async init(): Promise<void> {
    this.initMiddlewares()
    this.initCommands()

    // Enable graceful stop
    process.once('SIGINT', () => this.bot.stop('SIGINT'))
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'))
  }

  private initMiddlewares(): void {
    this.bot.use(Telegraf.log())
    this.bot.use(noGroupMiddleware)
  }

  private initCommands(): void {
    this.bot.start(this.handleStart.bind(this))
  }

  async start(): Promise<void> {
    await this.bot.launch()
  }

  private async handleStart(ctx: Context): Promise<void> {
    await ctx.reply('Welcome')
  }
}
