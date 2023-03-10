import sequelize from '../db'
import { Sequelize } from 'sequelize-typescript'
import TonWeb from 'tonweb'
import { BlockSubscription } from 'tonweb/dist/types/providers/block-subscription/block-subscription'
import { Wallet } from '../db/models'
import { Op } from 'sequelize'
import MeeMonitor from './meeMonitor'

const { TONCENTER_API_KEY } = process.env

// TODO: add db storage
function log(): void {
  //
}

export interface BlockHeaderId {
  workchain: number
  shard: string
  seqno: number
}

export interface BlockHeader {
  id: BlockHeaderId
}

export interface BlockShortTransaction {
  mode: number
  account: string
  lt: string
  hash: string
}

export interface BlockTransaction {
  transaction_id: {
    lt: string
    hash: string
  }
  in_msg?: {
    source: string
    destination: string
    msg_data?: {
      body: string
    }
  }
}

export default class TaskRunner {
  private db?: Sequelize
  private blockSubscribe?: BlockSubscription
  private readonly tonweb = new TonWeb(
    new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {
      apiKey: TONCENTER_API_KEY,
    })
  )

  private readonly meeMonitor = new MeeMonitor(this.tonweb)
  // private readonly userTaskRunner

  // constructor() {}

  async init(): Promise<void> {
    await this.initializeDatabase()
    await this.initializeBlockSubscription()
    await this.meeMonitor.init()
  }

  async start(): Promise<void> {
    // await this.userTaskRunner.start()
    if (this.blockSubscribe) {
      await this.blockSubscribe.start()
    }
  }

  private async initializeDatabase(force = false): Promise<void> {
    // return await Promise.resolve()
    this.db = await sequelize.sync({ force })
  }

  private async initializeBlockSubscription(): Promise<void> {
    const storage = new TonWeb.InMemoryBlockStorage(log)
    const blockSubscribe = new TonWeb.BlockSubscription(
      this.tonweb.provider,
      storage,
      this.handleBlockData.bind(this)
    )
    this.blockSubscribe = blockSubscribe
  }

  private async initializeConstants(): Promise<void> {
    // const currentNodeVersion = await Constant.get('CurrentNodeVersion')
    // if (!currentNodeVersion) {
    //   throw new Error('CurrentNodeVersion not set')
    // }
    // const bootEndpoints = await Constant.get('BootEndpoints')
    // if (!bootEndpoints) {
    //   throw new Error('BootEndpoints not set')
    // }
  }

  private async handleBlockData(blockHeader: BlockHeader): Promise<void> {
    const workchain = blockHeader.id.workchain
    if (workchain !== 0) return
    const shard = blockHeader.id.shard
    const blockNumber = blockHeader.id.seqno
    try {
      await this.processBlockData(blockNumber, shard, workchain)
    } catch (error) {
      console.log(`E: #${blockNumber}`)
      console.log(error)
    }
  }

  async processBlockData(
    blockNumber: number,
    shard: string,
    workchain = 0
  ): Promise<void> {
    // 1. get all short tx
    const blockTransactionsInfo =
      await this.tonweb.provider.getBlockTransactions(
        workchain,
        shard,
        blockNumber
      )
    const blockTransactions =
      blockTransactionsInfo.transactions as BlockShortTransaction[]
    const addresses = blockTransactions.map((tx) =>
      new TonWeb.Address(tx.account).toString(true, true, true)
    )

    // 2. find address in db
    const wallets = await Wallet.findAll({
      where: {
        address: {
          [Op.in]: addresses,
        },
      },
    })
    if (wallets.length === 0) return
    const walletsAddresses = wallets.map((w) => w.address)

    // 3. filter all related tx
    const shortTxs = blockTransactions.filter((tx) =>
      walletsAddresses.includes(
        new TonWeb.Address(tx.account).toString(true, true, true)
      )
    )

    // 4. process short tx
    shortTxs.forEach((tx) => {
      this.processShortTransction(
        blockNumber,
        tx.account,
        tx.lt,
        tx.hash
      ).catch((error) => {
        console.log(`E: @${tx.account} #${tx.hash}`)
        console.log(error)
      })
    })
  }

  async processShortTransction(
    blockNumber: number,
    account: string,
    lt: string,
    hash: string,
    limit = 1
  ): Promise<void> {
    const transactions = (await this.tonweb.provider.getTransactions(
      account,
      limit,
      lt as any,
      hash
    )) as BlockTransaction[]

    const tx = transactions[0]

    // pass to all monitors
    this.meeMonitor.processTransction(blockNumber, tx).catch((error) => {
      console.log(`E: meeMonitor @${account} #${hash}`)
      console.log(error)
    })
  }
}
