import Vue from 'vue'
import Vuex from 'vuex'
import { ethers } from 'ethers'
import { providers } from '@0xsequence/multicall'

import web3Modal from '@/wallet'
import { IEcosystem, EcosystemId, ChainId, ECOSYSTEMS } from '@/ecosystem'

Vue.use(Vuex)

type SafeSendTransactionArgs = {
  tx: ethers.PopulatedTransaction,
  targetChainId: ChainId
}

export default new Vuex.Store({
  state: {
    web3: <ethers.Signer | null> null,
    address: null,
    chainId: <number | null> null,
    lastChainTransactionBlock: {
      [56]: <number | null> null,
      [1284]: <number | null> null,
      [1285]: <number | null> null,
    },
    padPrice: null,
    ecosystemId: EcosystemId.Moonbeam
  },
  mutations: {
    setWeb3Connection(state, { web3, address, chainId }) {
      state.web3 = web3
      state.address = address
      state.chainId = chainId
    },
    setPadPrice(state, padPrice) {
      state.padPrice = padPrice
    },
    setEcosystemId(state, ecosystemId: EcosystemId) {
      state.ecosystemId = ecosystemId
    }
  },
  getters: {
    isConnected(state): boolean {
      return state.address != null
    },
    ecosystem(state): IEcosystem {
      return ECOSYSTEMS[state.ecosystemId]
    },
    multicall(state, getters): ethers.providers.Provider {
      return new providers.MulticallProvider(getters.ecosystem.dataseed, {
        batchSize: 300,
        timeWindow: 0,
        contract: getters.ecosystem.multicallAddress
      })
    }
  },
  actions: {
    async requestConnect({ commit }) {
      const provider = await web3Modal.connect()
      const ethersProvider = new ethers.providers.Web3Provider(provider, 'any')
      const web3 = ethersProvider.getSigner()
      if (!provider.selectedAddress) {
        // required for trust wallet
        provider.selectedAddress = await web3.getAddress()
      }
      commit('setWeb3Connection', {
        web3, 
        address: provider.selectedAddress,
        chainId: parseInt(provider.chainId)
      })

      // the outer frame and the iframe use different keys for storing cached
      // provider. We need to keep them in sync as well as signal the iframe when
      // to initiate connect, which we do for now by reloading
      const cachedProvider = localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')
      if (cachedProvider) {
        const cachedProviderValue = JSON.parse(cachedProvider).toString() // strip quotes
        localStorage.setItem('connectorId', cachedProviderValue)

        // TODO: connect iframe without reload
        // TODO: move iframe updating logic to Swap.vue
        const iframe = document.getElementById('swap-iframe') as HTMLIFrameElement | null
        if (iframe && iframe.contentDocument) {
          iframe.contentDocument.location.reload()
        }
      }
    
      provider.on('accountsChanged', (accounts: string[]) => {
        const web3Args: any = {
          web3,
          address: provider.selectedAddress,
          chainId: parseInt(provider.chainId)
        }
        if (!provider.selectedAddress) {
          web3Args.web3 = null
          web3Args.address = null,
          web3Args.chainId = null
        }

        commit('setWeb3Connection', web3Args)
      })

      provider.on('chainChanged', (chainId: number) => {
        commit('setWeb3Connection', {
          web3,
          address: provider.selectedAddress,
          chainId
        })
      })
    },
    async requestNetworkChange({ state, getters }, chainId) {
      if (!getters.isConnected) {
        return
      }
      const rpcSigner = state.web3! as ethers.providers.JsonRpcSigner
      const chainIdHex = '0x' + chainId.toString(16)
      try {
        await rpcSigner.provider.send('wallet_switchEthereumChain', [{ chainId: chainIdHex}])
      } catch (e: any) {
        if (e.code == 4902) {
          // TODO: wallet_addEthereumChain
          return
        }

        throw e
      }
    },
    async safeSendTransaction({ dispatch, state, getters }, { tx, targetChainId }: SafeSendTransactionArgs) {
      if (!getters.isConnected) {
        await dispatch('requestConnect')
        return null
      }

      if (state.chainId != targetChainId) {
        await dispatch('requestNetworkChange', targetChainId)
        return
      }

      const web3 = state.web3!
      const txResponse = await web3.sendTransaction(tx)
      const txReceipt = await txResponse.wait()

      state.lastChainTransactionBlock[targetChainId] = txReceipt.blockNumber
    }
  }
})