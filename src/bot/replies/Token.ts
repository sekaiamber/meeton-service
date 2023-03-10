import { Telegraf } from 'telegraf'
import { BalanceAssets } from '../../db/models/Balance'
import { MeetonContext } from '../types'
import replyMenu from '../utils/replyMenu'
import Reply from './base'

export class TokenReply extends Reply {
  register(bot: Telegraf): void {
    //
  }

  async reply(ctx: MeetonContext): Promise<void> {
    const { i18n, wallet } = ctx.userModel
    await wallet.updateAllBalances()
    const meeBalance = await wallet.getBalance(BalanceAssets.mee)
    const msg = i18n.t('token.template', {
      address: wallet.address,
      meeBalance: meeBalance.humanBalance,
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

const tokenReply = new TokenReply()
export default tokenReply
