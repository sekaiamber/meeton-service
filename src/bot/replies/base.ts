import { Telegraf } from 'telegraf'
import { MeetonContext } from '../types'

export default class Reply {
  register(bot: Telegraf): void {
    throw new Error('not impl')
  }

  async reply(ctx: MeetonContext): Promise<void> {
    throw new Error('not impl')
  }
}
