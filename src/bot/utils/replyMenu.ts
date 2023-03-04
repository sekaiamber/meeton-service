import { Context, Markup } from 'telegraf'

export interface MenuItem {
  label: string
  value: string
}

export type MenuRow = MenuItem[]

export type Menu = MenuRow[]

export default async function replyMenu(
  ctx: Context,
  message: string,
  data: Menu
): Promise<void> {
  await ctx.reply(message ?? '', {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard(
      data.map((row) =>
        row.map((item) => Markup.button.callback(item.label, item.value))
      )
    ),
  })
}
