import { Telegraf, Markup } from 'telegraf'
import { APPOtions } from '../types'

export function getExampleBot(token: string): Telegraf {
  const bot = new Telegraf(token)

  bot.use(Telegraf.log())

  // bot.command(
  //   'onetime',
  //   async (ctx) =>
  //     await ctx.reply(
  //       'One time keyboard',
  //       Markup.keyboard(['/simple', '/inline', '/pyramid']).oneTime().resize()
  //     )
  // )

  // bot.command('custom', async (ctx) => {
  //   return await ctx.reply(
  //     'Custom buttons keyboard',
  //     Markup.keyboard([
  //       ['🔍 Search', '😎 Popular'], // Row1 with 2 buttons
  //       ['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
  //       ['📢 Ads', '⭐️ Rate us', '👥 Share'], // Row3 with 3 buttons
  //     ])
  //       .oneTime()
  //       .resize()
  //   )
  // })

  // bot.hears('🔍 Search', async (ctx) => await ctx.reply('Yay!'))
  // bot.hears('📢 Ads', async (ctx) => await ctx.reply('Free hugs. Call now!'))

  // bot.command('special', async (ctx) => {
  //   return await ctx.reply(
  //     'Special buttons keyboard',
  //     Markup.keyboard([
  //       Markup.button.contactRequest('Send contact'),
  //       Markup.button.locationRequest('Send location'),
  //     ]).resize()
  //   )
  // })

  // bot.command('pyramid', async (ctx) => {
  //   return await ctx.reply(
  //     'Keyboard wrap',
  //     Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
  //       wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2,
  //     })
  //   )
  // })

  // bot.command('simple', async (ctx) => {
  //   return await ctx.replyWithHTML(
  //     '<b>Coke</b> or <i>Pepsi?</i>',
  //     Markup.keyboard(['Coke', 'Pepsi'])
  //   )
  // })

  bot.command('inline', async (ctx) => {
    return await ctx.reply('Please set your favorite language', {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        Markup.button.callback('English', `SetLanguage::${ctx.from.id},en`),
        Markup.button.callback('简体中文', `SetLanguage::${ctx.from.id},zh-cn`),
      ]),
    })
  })

  // bot.command('random', async (ctx) => {
  //   return await ctx.reply(
  //     'random example',
  //     Markup.inlineKeyboard([
  //       Markup.button.callback('Coke', 'Coke'),
  //       Markup.button.callback('Dr Pepper', 'Dr Pepper', Math.random() > 0.5),
  //       Markup.button.callback('Pepsi', 'Pepsi'),
  //     ])
  //   )
  // })

  // bot.command('caption', async (ctx) => {
  //   return await ctx.replyWithPhoto(
  //     { url: 'https://picsum.photos/200/300/?random' },
  //     {
  //       caption: 'Caption',
  //       parse_mode: 'Markdown',
  //       ...Markup.inlineKeyboard([
  //         Markup.button.callback('Plain', 'plain'),
  //         Markup.button.callback('Italic', 'italic'),
  //       ]),
  //     }
  //   )
  // })

  // bot.hears(/\/wrap (\d+)/, async (ctx) => {
  //   return await ctx.reply(
  //     'Keyboard wrap',
  //     Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
  //       columns: parseInt(ctx.match[1]),
  //     })
  //   )
  // })

  // bot.action('Dr Pepper', async (ctx, next) => {
  //   return await ctx.reply('👍').then(async () => await next())
  // })

  // bot.action('plain', async (ctx) => {
  //   await ctx.answerCbQuery()
  //   await ctx.editMessageCaption(
  //     'Caption',
  //     Markup.inlineKeyboard([
  //       Markup.button.callback('Plain', 'plain'),
  //       Markup.button.callback('Italic', 'italic'),
  //     ])
  //   )
  // })

  // bot.action('italic', async (ctx) => {
  //   await ctx.answerCbQuery()
  //   await ctx.editMessageCaption('_Caption_', {
  //     parse_mode: 'Markdown',
  //     ...Markup.inlineKeyboard([
  //       Markup.button.callback('Plain', 'plain'),
  //       Markup.button.callback('* Italic *', 'italic'),
  //     ]),
  //   })
  // })

  bot.action(/.+/, async (ctx) => {
    return await ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
  })

  return bot
}

export default class Bot {
  private readonly bot

  constructor(private readonly options: APPOtions) {
    this.bot = getExampleBot(options.botToken)
  }

  async init(): Promise<void> {
    // Enable graceful stop
    process.once('SIGINT', () => this.bot.stop('SIGINT'))
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'))
  }

  async start(): Promise<void> {
    await this.bot.launch()
  }
}
