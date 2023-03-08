import { Telegraf } from 'telegraf'
import { MeetonContext } from '../types'
import replyMenu from '../utils/replyMenu'
import Reply from './base'

const TIMESCALE = process.env.DEV_TIMESCALE
  ? parseFloat(process.env.DEV_TIMESCALE)
  : 1

export class AdminReply extends Reply {
  register(bot: Telegraf): void {
    //
  }

  async reply(ctx: MeetonContext): Promise<void> {
    const { i18n, id } = ctx.userModel
    const msg = i18n.t('admin.template', {
      userId: id,
      timeScale: TIMESCALE,
      speedUp: Math.floor(1 / TIMESCALE),
    })
    await replyMenu(ctx, msg, [
      [
        {
          label: i18n.t('menu.back'),
          value: `BackMenu::${ctx.userModel.id},1`,
        },
      ],
    ])
  }
}

const adminReply = new AdminReply()
export default adminReply
