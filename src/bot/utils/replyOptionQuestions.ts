import { Context, Markup } from 'telegraf'

export interface OptionQuestionOption {
  label: string
  value: string
}

export interface OptionQuestion {
  question: string
  options: OptionQuestionOption[]
}

export default async function replyOptionQuestion(
  ctx: Context,
  data: OptionQuestion
): Promise<void> {
  await ctx.reply(data.question, {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard(
      data.options.map((option) =>
        Markup.button.callback(option.label, option.value)
      )
    ),
  })
}
