import BlockMonitor from '../blockMonitor'

async function init(): Promise<void> {
  const bm = new BlockMonitor()
  await bm.init()
  await bm.processBlockData(33537289, '-9223372036854775808')
}

init().catch((e) => console.log(e))
