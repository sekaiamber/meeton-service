import { Telegraf } from 'telegraf'
import { Travel } from '../../db/models'
import { BalanceAssets } from '../../db/models/Balance'
import { MeetonContext } from '../types'

import Reply from './base'

export class TestReply extends Reply {
  register(bot: Telegraf): void {
    //
  }

  async reply(ctx: MeetonContext): Promise<void> {
    const wallet = ctx.userModel.wallet
    const deposit = await wallet.createDeposit({
      asset: BalanceAssets.mee,
      amount: '1234000000000',
      from: 'from',
      to: 'to',
      hash: 'hash',
      logicalTime: 'lt',
      blockNumber: 10,
    })
    await ctx.reply('done')
  }
}

const testReply = new TestReply()
export default testReply
