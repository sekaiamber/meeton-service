import { Telegraf } from 'telegraf'
import { MeetonContext } from '../types'
import replyMenu from '../utils/replyMenu'
import Reply from './base'
import comingReply from './Coming'
import tokenReply from './Token'

interface ShowMenuCallbackData {
  userId: number
  key: 'chat' | 'status' | 'atlas' | 'token' | 'document' | 'market'
}

interface BackMenuCallbackData {
  userId: number
  deleteMessage: boolean
}

// ShowMenu::00000,key
const showMenuActionReg =
  /ShowMenu::[0-9]+,(chat|status|atlas|token|document|market)/
// BackMenu::00000,0
const backToMenuActionReg = /BackMenu::[0-9]+,(0|1)/

const menu = [
  ['chat', 'status'],
  ['atlas', 'token'],
  ['document', 'market'],
]

export class ShowMenuReply extends Reply {
  private makeOptionValue(ctx: MeetonContext, key: string): string {
    return `ShowMenu::${ctx.userModel.id},${key}`
  }

  private parseShowMenuCallbackData(
    callbackData: string
  ): ShowMenuCallbackData {
    const [, data] = callbackData.split('::')
    const [userIdStr, key] = data.split(',')
    return {
      userId: parseInt(userIdStr),
      key: key as any,
    }
  }

  private parseBackMenuCallbackData(
    callbackData: string
  ): BackMenuCallbackData {
    const [, data] = callbackData.split('::')
    const [userIdStr, deleteMessage] = data.split(',')
    return {
      userId: parseInt(userIdStr),
      deleteMessage: deleteMessage === '1',
    }
  }

  register(bot: Telegraf): void {
    bot.action(showMenuActionReg, async (ctx) => {
      const data = this.parseShowMenuCallbackData(ctx.match[0])
      const mctx = ctx as unknown as MeetonContext
      switch (data.key) {
        case 'chat': {
          // TODO:
          await ctx.deleteMessage()
          await comingReply.reply(mctx)
          break
        }
        case 'status': {
          // TODO:
          await ctx.deleteMessage()
          await comingReply.reply(mctx)
          break
        }
        case 'atlas': {
          // TODO:
          await ctx.deleteMessage()
          await comingReply.reply(mctx)
          break
        }
        case 'token': {
          await ctx.deleteMessage()
          await tokenReply.reply(mctx)
          break
        }
        case 'document': {
          // TODO:
          await ctx.deleteMessage()
          await comingReply.reply(mctx)
          break
        }
        case 'market': {
          // TODO:
          await ctx.deleteMessage()
          await comingReply.reply(mctx)
          break
        }
        default:
          break
      }
    })

    bot.action(backToMenuActionReg, async (ctx) => {
      const data = this.parseBackMenuCallbackData(ctx.match[0])
      if (data.deleteMessage) {
        await ctx.deleteMessage()
      }
      await this.reply(ctx as unknown as MeetonContext)
    })
  }

  async reply(ctx: MeetonContext): Promise<void> {
    const { i18n } = ctx.userModel
    await replyMenu(
      ctx,
      i18n.t('menu.title'),
      menu.map((row) =>
        row.map((key) => ({
          label: i18n.t(`menu.${key}`),
          value: this.makeOptionValue(ctx, key),
        }))
      )
    )
  }
}

const showMenuReply = new ShowMenuReply()
export default showMenuReply
