import { Context, Markup } from 'telegraf'
import _ from 'lodash'

export interface OptionQuestionOption {
  label: string
  value: string
}

export interface OptionQuestion {
  question: string
  options: OptionQuestionOption[]
}

export interface ReplyOptionQuestionOption {
  randomOptions: boolean
  oneLineButton: boolean
  optionInQuesion: boolean
}

const defaultReplyOptionQuestionOption: ReplyOptionQuestionOption = {
  randomOptions: false,
  oneLineButton: false,
  optionInQuesion: false,
}

const INDEX_MAP = 'ABCDEFGHIJKLM'

export default async function replyOptionQuestion(
  ctx: Context,
  data: OptionQuestion,
  options: Partial<ReplyOptionQuestionOption> = {}
): Promise<void> {
  const useOptions = {
    ...defaultReplyOptionQuestionOption,
    ...options,
  }
  let questionText = data.question
  let questionOptions = [...data.options]
  if (useOptions.randomOptions) {
    questionOptions = _.shuffle(questionOptions)
  }
  if (useOptions.optionInQuesion) {
    const lines: string[] = [`<b>${questionText}</b>`, '']
    questionOptions.forEach((questionOption, i) => {
      const tag = INDEX_MAP[i]
      lines.push(`${tag}: ${questionOption.label}`)
      questionOption.label = tag
    })
    questionText = lines.join('\n')
  }
  if (useOptions.oneLineButton) {
    await ctx.reply(questionText, {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard(
        questionOptions.map((option) => [
          Markup.button.callback(option.label, option.value),
        ])
      ),
    })
  } else {
    await ctx.reply(questionText, {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard(
        questionOptions.map((option) =>
          Markup.button.callback(option.label, option.value)
        )
      ),
    })
  }
}
