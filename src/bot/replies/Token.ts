import { Telegraf } from 'telegraf'
import { MeetonContext } from '../types'
import replyMenu from '../utils/replyMenu'
import Reply from './base'

export class TokenReply extends Reply {
  register(bot: Telegraf): void {
    //
  }

  async reply(ctx: MeetonContext): Promise<void> {
    const { i18n, wallet } = ctx.userModel
    const msg = i18n.t('token.template', { address: wallet.address })
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

const tokenReply = new TokenReply()
export default tokenReply
