import { Telegraf } from 'telegraf'
import CONSTANTS from '../../constants'
import { MeetonContext } from '../types'
import replyMenu from '../utils/replyMenu'
import Reply from './base'

const { timeScale } = CONSTANTS

export class AdminReply extends Reply {
  register(bot: Telegraf): void {
    //
  }

  async reply(ctx: MeetonContext): Promise<void> {
    const { i18n, id } = ctx.userModel
    const msg = i18n.t('admin.template', {
      userId: id,
      timeScale,
      speedUp: Math.floor(1 / timeScale),
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
