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
    await ctx.replyWithPhoto({
      url: 'http://localhost:8000/test.png',
      // url: 'https://picsum.photos/200/300/?random',
      // url: 'https://assets.zjzsxhy.com/upload/42a0d69b-c90b-4c8a-974c-7367492ea8d7.svg',
    })
  }
}

const testReply = new TestReply()
export default testReply
