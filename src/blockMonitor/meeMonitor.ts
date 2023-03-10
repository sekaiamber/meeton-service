import TonWeb from 'tonweb'
import * as tonMnemonic from 'tonweb-mnemonic'
import { JettonMinter } from 'tonweb/dist/types/contract/token/ft/jetton-minter'
import { BlockTransaction } from '.'
import { Wallet } from '../db/models'
import { BalanceAssets } from '../db/models/Balance'

const { MEE_CONTRACT_ADDRESS } = process.env

export default class MeeMonitor {
  private jettonMinter?: JettonMinter

  constructor(private readonly tonweb: TonWeb) {}

  async init(): Promise<void> {
    this.jettonMinter = new TonWeb.token.jetton.JettonMinter(
      this.tonweb.provider,
      {
        address: MEE_CONTRACT_ADDRESS as unknown,
      }
    )
  }

  async getMeeWalletAddress(wallet: Wallet): Promise<string | null> {
    const seed = await tonMnemonic.mnemonicToSeed(wallet.mnemonics.split(' '))
    const keyPair = TonWeb.utils.keyPairFromSeed(seed)
    const WalletClass = this.tonweb.wallet.all.v3R2
    const userWallet = new WalletClass(this.tonweb.provider, {
      publicKey: keyPair.publicKey,
      wc: 0,
    })
    const userWalletAddress = await userWallet.getAddress()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const meeWalletAddress = await this.jettonMinter!.getJettonWalletAddress(
      userWalletAddress
    )
    const meeWalletAddressString = meeWalletAddress.toString(true, true, true)
    return meeWalletAddressString
  }

  async processTransction(
    blockNumber: number,
    tx: BlockTransaction
  ): Promise<void> {
    if (!tx?.in_msg?.msg_data) return
    const wallet = await Wallet.findOne({
      where: { address: tx.in_msg.destination },
    })
    if (!wallet) return

    // check if is user's mee wallet send to destination
    const meeWalletAddress = await this.getMeeWalletAddress(wallet)
    // not mee, other jetton
    if (meeWalletAddress !== tx.in_msg.source) return

    const msgBody = TonWeb.utils.base64ToBytes(tx.in_msg.msg_data.body)
    const cell = TonWeb.boc.Cell.oneFromBoc(msgBody)
    const slice = cell.beginParse()
    const op = slice.loadUint(32)
    // op == transfer_notification
    // https://tonscan.org/jetton/EQBhZbgECRv85wEVPVTrq_W2G1zpGPEmKJnhcoeJAorHHlai#source
    // imports/op-codes.fc
    if (!op.eq(new TonWeb.utils.BN(0x7362d09c))) return
    slice.loadUint(64)
    const amount = slice.loadCoins()
    const from = slice.loadAddress()
    const deposit = await wallet.createDeposit({
      asset: BalanceAssets.mee,
      amount: amount.toString(),
      from: from.toString(true, true, true),
      to: tx.in_msg.destination,
      hash: tx.transaction_id.hash,
      logicalTime: tx.transaction_id.lt,
      blockNumber,
    })
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`#${wallet.id} deposit ${amount.toString()} MEE`)
  }
}
