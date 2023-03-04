import { Telegraf } from 'telegraf'
import { MeetonContext } from '../types'
import replyMenu from '../utils/replyMenu'
import Reply from './base'

export class ComingReply extends Reply {
  register(bot: Telegraf): void {
    //
  }

  async reply(ctx: MeetonContext): Promise<void> {
    const { i18n } = ctx.userModel
    const msg = i18n.t('coming.template')
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

const comingReply = new ComingReply()
export default comingReply
