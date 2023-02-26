import { Context } from 'telegraf'

export default async function noGroupMiddleware(
  ctx: Context,
  next: () => void
): Promise<void> {
  const chat = ctx.message?.chat
  if (!chat) return
  if (chat.type !== 'private') return
  next()
}
