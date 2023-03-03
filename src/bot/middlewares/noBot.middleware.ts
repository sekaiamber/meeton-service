import { Context } from 'telegraf'

export default async function noBotMiddleware(
  ctx: Context,
  next: () => void
): Promise<void> {
  console.log('enter noBotMiddleware')
  const from = ctx.message?.from ?? ctx.callbackQuery?.from
  if (!from) return
  if (from.is_bot) return
  next()
}
