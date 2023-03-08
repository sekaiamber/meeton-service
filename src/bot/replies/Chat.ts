import { pickRandom } from 'mathjs'
import { Telegraf } from 'telegraf'
import { MeetonContext } from '../types'
import replyMenu from '../utils/replyMenu'
import Reply from './base'
import questions from '../../i18n/resources/en/favorabilityQuestions'
import { randomPickInt } from '../../utils'
import replyOptionQuestion from '../utils/replyOptionQuestions'

interface CallbackData {
  userId: number
  index: number
  value: '+' | '-'
}

const questionsCount = questions.length

// Chat::0000,1,+
const actionReg = /Chat::[0-9]+,[0-9]+,(\+|-)/
const i18nPrefix = 'chat.questions'

export class ChatReply extends Reply {
  private makeOptionValue(
    ctx: MeetonContext,
    index: number,
    value: string
  ): string {
    return `Chat::${ctx.userModel.id},${index},${value}`
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
      await userModel.status.onTalk(data.value === '+' ? 2 : -2)
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
      await this.reply(mctx)
    })
  }

  private async replyQuestionByIndex(
    ctx: MeetonContext,
    index: number
  ): Promise<void> {
    const { i18n, isAdmin } = ctx.userModel
    await replyOptionQuestion(
      ctx,
      {
        question: i18n.t(`${i18nPrefix}.${index}.question`),
        options: [
          {
            label: `${i18n.t(`${i18nPrefix}.${index}.options.0.label`)}${
              isAdmin ? '(+)' : ''
            }`,
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

  async reply(ctx: MeetonContext): Promise<void> {
    console.log(1)
    const { i18n, status } = ctx.userModel

    if (status.isSleeping) {
      await replyMenu(ctx, i18n.t('status.sleeping'), [
        [
          {
            label: i18n.t('menu.back'),
            value: `BackMenu::${ctx.userModel.id},1`,
          },
        ],
      ])
      return
    }

    if (status.talkPoints < 1) {
      await replyMenu(ctx, i18n.t('status.noTalkPoints'), [
        [
          {
            label: i18n.t('menu.back'),
            value: `BackMenu::${ctx.userModel.id},1`,
          },
        ],
      ])
      return
    }

    const index = randomPickInt(questionsCount)
    await this.replyQuestionByIndex(ctx, index)
  }
}

const chatReply = new ChatReply()
export default chatReply
