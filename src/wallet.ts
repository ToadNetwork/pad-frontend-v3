import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'

export default new Web3Modal({
  network: 'binance',
  cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          56: 'https://bsc-dataseed1.defibit.io/',
          1285: 'https://moonriver.api.onfinality.io/public'
        },
        bridge: 'https://pancakeswap.bridge.walletconnect.org/',
        network: 'binance' // TODO: change for moonriver
      }
    }
  }
})