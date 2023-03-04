import { Context } from 'telegraf'
import { debug } from '../../utils'

export default async function noGroupMiddleware(
  ctx: Context,
  next: () => void
): Promise<void> {
  debug('enter noGroupMiddleware')
  const chat = ctx.message?.chat ?? ctx.callbackQuery?.message?.chat
  if (!chat) return
  if (chat.type !== 'private') return
  next()
}
