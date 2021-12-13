import Vue from 'vue'
import Vuex from 'vuex'
import { ethers } from 'ethers'

import web3Modal from '@/wallet'

Vue.use(Vuex)

type ChainId = 56 | 1285

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
      [1285]: <number | null> null
    },
    padPrice: null
  },
  mutations: {
    setWeb3Connection(state, { web3, address, chainId }) {
      state.web3 = web3
      state.address = address
      state.chainId = chainId
    },
    setPadPrice(state, padPrice) {
      state.padPrice = padPrice
    }
  },
  getters: {
    isConnected(state): boolean {
      return state.address != null
    }
  },
  actions: {
    async requestConnect({ commit }) {
      const provider = await web3Modal.connect()
      const ethersProvider = new ethers.providers.Web3Provider(provider)
      const web3 = ethersProvider.getSigner()
      commit('setWeb3Connection', {
        web3, 
        address: provider.selectedAddress,
        chainId: parseInt(provider.chainId)
      })
    
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