import BlockMonitor from './blockMonitor'

const monitor = new BlockMonitor()

monitor
  .init()
  .then(() => {
    console.log('monitor inited')
  })
  .then(async () => await monitor.start())
  .catch((e) => {
    console.log(e)
  })
