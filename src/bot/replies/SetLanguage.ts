import { Context, Telegraf } from 'telegraf'
import { UserLanguage } from '../../db/models/User'
import { MeetonContext } from '../types'
import replyOptionQuestion from '../utils/replyOptionQuestions'
import Reply from './base'
import initFavorabilityTestReply from './InitFavorabilityTest'

interface CallbackData {
  userId: number
  language: UserLanguage
}

// SetLanguage::00000,en
const actionReg = /SetLanguage::[0-9]+,(en|zh-cn)/

export class SetLanguageReply extends Reply {
  private makeOptionValue(ctx: MeetonContext, value: string): string {
    return `SetLanguage::${ctx.userModel.id},${value}`
  }

  private parseCallbackData(callbackData: string): CallbackData {
    const [, data] = callbackData.split('::')
    const [userIdStr, language] = data.split(',')
    return {
      userId: parseInt(userIdStr),
      language: language as UserLanguage,
    }
  }

  register(bot: Telegraf): void {
    bot.action(actionReg, async (ctx) => {
      const data = this.parseCallbackData(ctx.match[0])
      const mctx = ctx as unknown as MeetonContext
      const { userModel } = mctx
      const { i18n } = userModel
      // TODO: check data.userId eq ctx.userModel.id
      await userModel.setLanguage(data.language)
      await ctx.editMessageText(
        [i18n.t('setLanguage.question'), i18n.t('setLanguage.success')].join(
          '\n'
        )
      )
      await initFavorabilityTestReply.reply(ctx as unknown as MeetonContext)
      // console.log(ctx.update)
      // const update1 = JSON.stringify(ctx.update)
      // console.log(update1)
      // const ctx2 = new Context(
      //   JSON.parse(update1),
      //   ctx.telegram,
      //   ctx.botInfo
      // )
      // await ctx2.reply('222')
      // return await ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
    })
  }

  async reply(ctx: MeetonContext): Promise<void> {
    const { i18n, languageInited } = ctx.userModel
    // TODO: reply menu
    if (languageInited) return
    await replyOptionQuestion(ctx, {
      question: i18n.t('setLanguage.question'),
      options: [
        {
          label: i18n.t('setLanguage.options.0.label'),
          value: this.makeOptionValue(
            ctx,
            i18n.t('setLanguage.options.0.value')
          ),
        },
        {
          label: i18n.t('setLanguage.options.1.label'),
          value: this.makeOptionValue(
            ctx,
            i18n.t('setLanguage.options.1.value')
          ),
        },
      ],
    })
  }
}

const setLanguageReply = new SetLanguageReply()
export default setLanguageReply
