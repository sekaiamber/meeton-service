import { Context, Telegraf } from 'telegraf'
import { APPOtions } from '../types'
import noGroupMiddleware from './middlewares/noGroup.middleware'
import noBotMiddleware from './middlewares/noBot.middleware'
import userModelMiddleware from './middlewares/userModel.middleware'
import { MeetonContext } from './types'
import setLanguageReply from './replies/SetLanguage'
import initFavorabilityTestReply from './replies/InitFavorabilityTest'
import showMenuReply from './replies/ShowMenu'
import tokenReply from './replies/Token'
import statusReply from './replies/Status'
import adminReply from './replies/Admin'
import chatReply from './replies/Chat'
import marketReply from './replies/Market'
import atlasReply from './replies/Atlas'

const { DEBUG } = process.env

export default class Bot {
  private readonly bot

  constructor(private readonly options: APPOtions) {
    this.bot = new Telegraf(options.botToken)
  }

  async init(): Promise<void> {
    this.initMiddlewares()
    this.initCommands()
    this.initActions()

    // Enable graceful stop
    process.once('SIGINT', () => this.bot.stop('SIGINT'))
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'))
  }

  private initMiddlewares(): void {
    if (DEBUG === '1') {
      this.bot.use(Telegraf.log())
    }
    this.bot.use(noGroupMiddleware)
    this.bot.use(noBotMiddleware)
    this.bot.use(userModelMiddleware)
  }

  private initCommands(): void {
    this.bot.start(this.handleStart.bind(this))
  }

  private initActions(): void {
    setLanguageReply.register(this.bot)
    initFavorabilityTestReply.register(this.bot)
    showMenuReply.register(this.bot)
    tokenReply.register(this.bot)
    statusReply.register(this.bot)
    adminReply.register(this.bot)
    chatReply.register(this.bot)
    marketReply.register(this.bot)
    atlasReply.register(this.bot)
  }

  async start(): Promise<void> {
    await this.bot.launch()
  }

  private async handleStart(ctx: Context): Promise<void> {
    const mctx = ctx as MeetonContext
    const { userModel } = mctx
    if (!userModel.languageInited) {
      await setLanguageReply.reply(mctx)
      return
    }
    if (!userModel.initFavorabilityTest.finished) {
      await initFavorabilityTestReply.reply(mctx)
      return
    }
    await showMenuReply.reply(mctx)
  }
}
