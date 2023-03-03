import {
  KeyPair,
  mnemonicNew,
  mnemonicToPrivateKey,
  mnemonicToWalletKey,
  mnemonicValidate,
} from 'ton-crypto'
import { WalletContractV4 } from 'ton'

async function pr(): Promise<void> {
  console.log('.')
  const n1 = new Date()
  const password = '111'
  const mnemonics: string[] = await mnemonicNew(24, password)
  console.log(mnemonics)

  const n2 = new Date()
  console.log('..')
  console.log(n2.getTime() - n1.getTime())

  const mnemonicsValid: boolean = await mnemonicValidate(mnemonics, password)
  console.log(mnemonicsValid)
  console.log('...')

  const keypair1: KeyPair = await mnemonicToPrivateKey(mnemonics, password)
  const keypair2: KeyPair = await mnemonicToWalletKey(mnemonics, password)

  console.log(keypair1.publicKey.toString('hex'))
  console.log(keypair1.secretKey.toString('hex'))
  console.log(keypair2)
  console.log('....')

  const wallet = WalletContractV4.create({
    publicKey: keypair2.publicKey,
    workchain: 0,
  })

  console.log(wallet.address.toString({ testOnly: true }))
  console.log(wallet.address.toString())
}

pr().catch((e) => console.log(e))
