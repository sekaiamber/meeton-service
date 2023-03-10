import TonWeb from 'tonweb'
import * as tonMnemonic from 'tonweb-mnemonic'
import { WalletV3ContractR2 } from 'tonweb/dist/types/contract/wallet/v3/wallet-v3-contract-r2'

const API_KEY =
  '228aa2fd9108cf17eef8fb1449605776c7a33753e996de88aa761f533f8555fa'

const tonweb = new TonWeb(
  new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {
    apiKey: API_KEY,
  })
)

const JETTON_INFO = {
  address: 'EQBhZbgECRv85wEVPVTrq_W2G1zpGPEmKJnhcoeJAorHHlai',
  decimals: 9,
}
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {
  address: JETTON_INFO.address,
})

// const JettonAddress = 'EQBhZbgECRv85wEVPVTrq_W2G1zpGPEmKJnhcoeJAorHHlai'
const ownerAddress = 'EQCjrNjgzRowoSpiQO7b7qzVK9PIXNGDep6Z6ALo5mMF1ibf'
const targetAddress = 'EQCp8R6bV7jHITXbLbu0atkKCeBtNEExf-xmSFdxoQQXROJV'
const txHash = 'GZe0p3bhgcb3qP2HeThIH3YGGBByJhpu0ywpgLSYfoQ='

async function getWallet(mnemonics: string[]): Promise<WalletV3ContractR2> {
  const seed = await tonMnemonic.mnemonicToSeed(mnemonics)
  const keyPair = TonWeb.utils.keyPairFromSeed(seed)
  // console.log(seed)
  const WalletClass = tonweb.wallet.all.v3R2
  const wallet = new WalletClass(tonweb.provider, {
    publicKey: keyPair.publicKey,
    wc: 0,
  })
  return wallet
}

async function getJettonWalletAddress(
  wallet: WalletV3ContractR2
): Promise<string> {
  const walletAddress = await wallet.getAddress()
  const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(
    walletAddress
  )
  const jettonWalletAddressString = jettonWalletAddress.toString(
    true,
    true,
    true
  )
  return jettonWalletAddressString
}

async function listAllTx(mnemonics: string[]): Promise<any[]> {
  const wallet = await getWallet(mnemonics)
  const walletAddress = await wallet.getAddress()
  // const jettonWalletAddressString = await getJettonWalletAddress(wallet)

  // const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
  //   address: jettonWalletAddress,
  // })
  // console.log(jettonWalletAddressString)

  const fromTxs = await tonweb.provider.getTransactions(
    walletAddress.toString(true, true, true)
  )
  // const fromTx = fromTxs.filter((tx: any) => tx.transaction_id.hash === txHash)

  // const toTxs = await tonweb.provider.getTransactions(targetAddress)
  // const toTx = toTxs.filter((tx: any) => tx.transaction_id.hash === txHash)

  return fromTxs
}

async function processTx(tx: any): Promise<void> {
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
  // console.log(
  //   `Got MEET jetton deposit ${amount.toString()} from ${from.toString()} units with text comment ${comment}"`
  // )
}

async function pr(): Promise<void> {
  const txs = await listAllTx(
    'dream spell exercise slice page mechanic front cable carpet number access camp reduce girl shoulder beach manual prize elite laptop mistake diet trophy guess'.split(
      ' '
    )
  )
  for (let i = 0; i < txs.length; i++) {
    const tx = txs[i]
    await processTx(tx)
  }
}

pr().catch((e) => console.log(e))
