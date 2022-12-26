import Vue from 'vue'

import { EcosystemId, IEcosystem } from '@/ecosystem'

  import { mapActions } from 'vuex'
  import AwaitLock from 'await-lock'
  import { ethers } from 'ethers'

  import {
    ERC20_ABI,
    PADSWAP_PAIR_ABI
  } from '@/constants'

  import { ChainId } from '@/ecosystem'

export const tokenInfo = Vue.extend({
    computed: {
      ecosystemId: {
        get(): EcosystemId {
          return this.$store.state.ecosystemId
        },
        set(val: EcosystemId) {
          this.$store.commit('setEcosystemId', val)
        }
      },
      ecosystem(): IEcosystem {
        return this.$store.getters.ecosystem
      },
      address(): string {
        return this.$store.state.address
      },
      web3(): ethers.Signer | null {
        return this.$store.state.web3
      },
      chainId(): ChainId {
        return this.$store.getters.ecosystem.chainId
      },
      multicall(): ethers.providers.Provider {
        return this.$store.getters.multicall
      },
      ecosystemName() : string {
        if (this.$store.getters.ecosystem.chainId == 56) {
          return 'bsc'
        }
        if (this.$store.getters.ecosystem.chainId == 1285) {
          return 'moonriver'
        }
        if (this.$store.getters.ecosystem.chainId == 1284) {
          return 'moonbeam'
        }
        return 'undefined'
      }
    },
    methods: {
      // Finds the token type by trying multiple ABIs
      // and calling the methods that only specific contracts have
      async getTokenType(contractAddress : string) {
        const tokenContract = new ethers.Contract(contractAddress, PADSWAP_PAIR_ABI, this.multicall)
        try {
          const test = await tokenContract.token0()
        }
        catch {
          try {
            const validTokenTest = await tokenContract.symbol()
          }
          catch {
            return 'unknown'
          }
          return 'normalToken'
        }
        return 'liquidityPair'
      },

      getEcosystemName(chainIdNumber : number) {
        const chainNames : any = {
          56: 'bsc',
          1284: 'moonbeam',
          1285: 'moonriver'
        }
        return chainNames[chainIdNumber]
      },

      getTokenImage(ecosystemName : string, contractAddress : string) {
        try {
          const image = require('@/assets/token-icons/' + ecosystemName + '/' + contractAddress + '.png')
          return image
        } catch {
          return require('@/assets/token-icons/no-icon.png')
        }
      },


      // Retrieves the user balance for this token
      async getTokenBalance(contractAddress : string) {
        if (contractAddress == 'eth') {
          const ethBalanceBn = await this.multicall.getBalance(this.address)
          const ethBalance = ethers.utils.formatEther(ethBalanceBn)
          return ethBalance
        }
        else {
          const tokenContract = new ethers.Contract(contractAddress, ERC20_ABI, this.multicall)
          const tokenBalanceBn = await tokenContract.balanceOf(this.address)
          const decimals = await tokenContract.decimals()
          const tokenBalance = ethers.utils.formatUnits(tokenBalanceBn, decimals)
          return tokenBalance
        }
      },

      async getTokenAllowance(tokenContractAddress : string, spenderContractAddress : string) {
        if (tokenContractAddress == 'eth') {
          return 99999999999999999999999999999999999999999999999999999999999.0.toString()
        }
        else {
          const tokenContract = new ethers.Contract(tokenContractAddress, ERC20_ABI, this.multicall)
          const tokenAllowanceBn = await tokenContract.allowance(this.address, spenderContractAddress)
          const decimals = await tokenContract.decimals()
          const tokenAllowance = ethers.utils.formatUnits(tokenAllowanceBn, decimals)
          return tokenAllowance
        }
      },


      // Retrieves the basic token info
      async getTokenData(contractAddress : string) {
        let tokenData : any = {
          address: '',
          name: '',
          symbol: '',
          decimals: '',
        }
        const tokenContract = new ethers.Contract(contractAddress, ERC20_ABI, this.multicall)

        tokenData.address = contractAddress

        const p1 = tokenContract.name().then((result : any) => tokenData.name = result)
        const p2 = tokenContract.symbol().then((result : any) => tokenData.symbol = result)
        const p3 = tokenContract.decimals().then((result : any) => tokenData.decimals = result)

        const promises = [p1, p2, p3]
        await Promise.all(promises)

        return tokenData
      },

      // Retrieves the basic LP token info,
      // including the token info for both tokens in the pair
      async getPairData(contractAddress : string) {
        let pairData : any = {
          address: '',
          name: '',
          symbol: '',
          decimals: '',
          token0: {},
          token1: {}
        }
        const pairContract = new ethers.Contract(contractAddress, PADSWAP_PAIR_ABI, this.multicall)

        pairData.address = contractAddress

        let token0Address : string = ''
        let token1Address : string = ''

        const p1 = pairContract.name().then((result : any) => pairData.name = result)
        const p2 = pairContract.symbol().then((result : any) => pairData.symbol = result)
        const p3 = pairContract.decimals().then((result : any) => pairData.decimals = result)
        const p4 = pairContract.token0().then((result : any) => token0Address = result)
        const p5 = pairContract.token1().then((result : any) => token1Address = result)

        const promises = [p1, p2, p3, p4, p5]
        await Promise.all(promises)

        const pToken0 = this.getTokenData(token0Address).then((result : any) => pairData.token0 = result)
        const pToken1 = this.getTokenData(token1Address).then((result : any) => pairData.token1 = result)
        const tokenDataPromises = [pToken0, pToken1]
        await Promise.all(tokenDataPromises)

        return pairData
      },

      // Identifies the contract type,
      // then retrieves the relevant data for that type of contract
      async getContractData(contractAddress : string) {
        let contractData : any = {
          type : 'unknown',
          data : {}
        }

        const contractType = await this.getTokenType(contractAddress)
        contractData.type = contractType
        if (contractType == 'normalToken') {
          contractData.data = await this.getTokenData(contractAddress)
        }
        else if (contractType == 'liquidityPair') {
          contractData.data = await this.getPairData(contractAddress)
        }
        return contractData
      },
    },
  })
