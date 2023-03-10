import TonWeb from 'tonweb'

const API_KEY =
  '228aa2fd9108cf17eef8fb1449605776c7a33753e996de88aa761f533f8555fa'

const tonweb = new TonWeb(
  new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {
    apiKey: API_KEY,
  })
)

async function pr(): Promise<void> {
  const blockTransactions = await tonweb.provider.getBlockTransactions(
    0,
    '-9223372036854775808',
    33537289
  )
  // console.log(blockTransactions)
  const addresses = (blockTransactions.transactions as any[]).map(
    (tx) => new TonWeb.Address(tx.account)
  )
  const addressStrings = addresses.map((addr) =>
    addr.toString(true, true, true)
  )

  // find shortTx
  const shortTx = (blockTransactions.transactions as any[]).filter(
    (tx) =>
      new TonWeb.Address(tx.account).toString(true, true, true) ===
      'EQCp8R6bV7jHITXbLbu0atkKCeBtNEExf-xmSFdxoQQXROJV'
  )[0]

  const transactions = await tonweb.provider.getTransactions(
    shortTx.account,
    1,
    shortTx.lt,
    shortTx.hash
  )

  const tx = transactions[0]

  const msgBody = TonWeb.utils.base64ToBytes(tx.in_msg.msg_data.body)
  const cell = TonWeb.boc.Cell.oneFromBoc(msgBody)
  const slice = cell.beginParse()
  const op = slice.loadUint(32)
  console.log(op)
  // op == transfer_notification
  // https://tonscan.org/jetton/EQBhZbgECRv85wEVPVTrq_W2G1zpGPEmKJnhcoeJAorHHlai#source
  // imports/op-codes.fc
  if (!op.eq(new TonWeb.utils.BN(0x7362d09c))) {
    console.log('not a transfer_notification event')
    return
  }
  const queryId = slice.loadUint(64)
  // console.log(queryId)
  const amount = slice.loadCoins()
  const from = slice.loadAddress()
  // const maybeRef = slice.loadBit()
  // const payload = maybeRef ? slice.loadRef().beginParse() : slice
  // const payloadOp = payload.loadUint(32)
  // if (!payloadOp.eq(new TonWeb.utils.BN(0))) {
  //   console.log('no text comment in transfer_notification')
  //   return
  // }
  // const payloadBytes = payload.loadBits(slice.getFreeBits())
  // const comment = new TextDecoder().decode(payloadBytes)
  console.log(queryId)
  console.log(amount.toString())
  console.log(from.toString(true, true, true))
}

pr().catch((e) => console.log(e))
