import TonWeb from 'tonweb'

const API_KEY =
  '228aa2fd9108cf17eef8fb1449605776c7a33753e996de88aa761f533f8555fa'

const tonweb = new TonWeb(
  new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {
    apiKey: API_KEY,
  })
)

function log(): void {
  //
}

async function init(): Promise<void> {
  const storage = new TonWeb.InMemoryBlockStorage(log)

  const onBlock = async (blockHeader: any): Promise<void> => {
    const workchain = blockHeader.id.workchain
    if (workchain !== 0) return
    const shardId = blockHeader.id.shardId
    const blockNumber = blockHeader.id.seqno
    console.log(`#${blockNumber}`)
    console.log(blockHeader.id)
    // const blockTransactions = await tonweb.provider.getBlockTransactions(
    //   workchain,
    //   shardId,
    //   blockNumber
    // )

    // console.log(blockTransactions.transactions)
  }

  const blockSubscribe = new TonWeb.BlockSubscription(
    tonweb.provider,
    storage,
    onBlock
  )
  await blockSubscribe.start()
}

init().catch((e) => console.log(e))
