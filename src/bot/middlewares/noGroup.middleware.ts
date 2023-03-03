import { Context } from 'telegraf'

export default async function noGroupMiddleware(
  ctx: Context,
  next: () => void
): Promise<void> {
  console.log('enter noGroupMiddleware')
  const chat = ctx.message?.chat ?? ctx.callbackQuery?.message?.chat
  if (!chat) return
  if (chat.type !== 'private') return
  next()
}
