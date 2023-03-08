import { Telegraf } from 'telegraf'
import { Travel } from '../../db/models'
import { MeetonContext } from '../types'

import Reply from './base'

export class TestReply extends Reply {
  register(bot: Telegraf): void {
    //
  }

  async reply(ctx: MeetonContext): Promise<void> {
    await ctx.userModel.initFavorabilityTest.onFinish()
    await ctx.reply('done')
  }
}

const testReply = new TestReply()
export default testReply
