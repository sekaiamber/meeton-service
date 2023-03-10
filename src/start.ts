import APP from '.'

const { BOT_TOKEN } = process.env

const app = new APP({
  botToken: BOT_TOKEN,
})

app
  .init()
  .then(() => {
    console.log('bot inited')
  })
  .then(async () => await app.start())
  .catch((e) => {
    console.log(e)
  })
