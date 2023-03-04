import { Context } from 'telegraf'
import { debug } from '../../utils'

export default async function noBotMiddleware(
  ctx: Context,
  next: () => void
): Promise<void> {
  debug('enter noBotMiddleware')
  const from = ctx.message?.from ?? ctx.callbackQuery?.from
  if (!from) return
  if (from.is_bot) return
  next()
}
