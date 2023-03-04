import { Context, Telegraf } from 'telegraf'
import { UserLanguage } from '../../db/models/User'
import { MeetonContext } from '../types'
import replyOptionQuestion from '../utils/replyOptionQuestions'
import Reply from './base'

interface CallbackData {
  userId: number
  index: number
  value: '+' | '-'
}

// InitFavorabilityTest::0000,1,+
const actionReg = /InitFavorabilityTest::[0-9]+,[0-9]+,(\+|-)/

const i18nPrefix = 'initFavorabilityTest.questions'

export class InitFavorabilityTestReply extends Reply {
  private makeOptionValue(
    ctx: MeetonContext,
    index: number,
    value: string
  ): string {
    return `InitFavorabilityTest::${ctx.userModel.id},${index},${value}`
  }

  private parseCallbackData(callbackData: string): CallbackData {
    const [, data] = callbackData.split('::')
    const [userIdStr, indexStr, value] = data.split(',')
    return {
      userId: parseInt(userIdStr),
      index: parseInt(indexStr),
      value: value as '+' | '-',
    }
  }

  register(bot: Telegraf): void {
    bot.action(actionReg, async (ctx) => {
      const data = this.parseCallbackData(ctx.match[0])
      const mctx = ctx as unknown as MeetonContext
      const { userModel } = mctx
      await userModel.initFavorabilityTest.setAnswer(data.index, data.value)
      const { i18n } = userModel
      // TODO: check data.userId eq ctx.userModel.id
      await ctx.editMessageText(
        [
          `<b>${i18n.t(`${i18nPrefix}.${data.index}.question`)}</b>`,
          '',
          `<em> > ${i18n.t(
            `${i18nPrefix}.${data.index}.options.${
              data.value === '+' ? '0' : '1'
            }.label`
          )}</em>`,
        ].join('\n'),
        {
          parse_mode: 'HTML',
        }
      )
      await this.tryReplyNextQeustion(mctx)
    })
  }

  private async replyQuestionByIndex(
    ctx: MeetonContext,
    index: number
  ): Promise<void> {
    const { i18n } = ctx.userModel
    await replyOptionQuestion(
      ctx,
      {
        question: i18n.t(`${i18nPrefix}.${index}.question`),
        options: [
          {
            label: i18n.t(`${i18nPrefix}.${index}.options.0.label`),
            value: this.makeOptionValue(
              ctx,
              index,
              i18n.t(`${i18nPrefix}.${index}.options.0.value`)
            ),
          },
          {
            label: i18n.t(`${i18nPrefix}.${index}.options.1.label`),
            value: this.makeOptionValue(
              ctx,
              index,
              i18n.t(`${i18nPrefix}.${index}.options.1.value`)
            ),
          },
        ],
      },
      {
        randomOptions: true,
        optionInQuesion: true,
      }
    )
  }

  private async tryReplyNextQeustion(ctx: MeetonContext): Promise<void> {
    const { i18n, initFavorabilityTest } = ctx.userModel
    if (initFavorabilityTest.finished) {
      const successMsg = i18n.t('initFavorabilityTest.success')
      await ctx.reply(successMsg)
      return
    }
    await this.reply(ctx)
  }

  async reply(ctx: MeetonContext): Promise<void> {
    const { userModel } = ctx
    const { initFavorabilityTest } = userModel
    // TODO: reply menu
    if (initFavorabilityTest.finished) return
    await this.replyQuestionByIndex(
      ctx,
      initFavorabilityTest.getFirstUndoQuestionIndex
    )
  }
}

const initFavorabilityTestReply = new InitFavorabilityTestReply()
export default initFavorabilityTestReply
