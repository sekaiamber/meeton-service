import { Context } from 'telegraf'
import { User } from '../../db/models'
import { MeetonContext } from '../types'
import { debug } from '../../utils'

export default async function userModelMiddleware(
  ctx: Context,
  next: () => void
): Promise<void> {
  debug('enter userModelMiddleware')
  const from = ctx.message?.from ?? ctx.callbackQuery?.from
  if (!from) return
  const userModel = await User.findOrCreateUser(from.id)
  const mctx = ctx as MeetonContext
  mctx.userModel = userModel
  next()
}
