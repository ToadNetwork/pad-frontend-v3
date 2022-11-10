<template>
  <v-container
  class="text-center">

    <!-------------------------------->
    <!-- Ecosystem selection slider -->
    <!-------------------------------->
    <div class="padswap-header-box">
      <slider-tabs
        class="padswap-ecosystem-tabs"
        v-model="ecosystemId"
      >
        <v-tab class="d-flex flex-column">
          <v-img
            height="30"
            width="30"
            contain
            src="../assets/tokens/bsc/PAD.svg"
          />
          <div>BSC</div>
        </v-tab>
        <v-tab class="d-flex flex-column">
          <v-img
            height="30"
            width="30"
            contain
            src="../assets/tokens/moonriver/PAD.svg"
          />
          <div>Moonriver</div>
        </v-tab>
        <v-tab class="d-flex flex-column">
          <v-img
            height="30"
            width="30"
            contain
            src="../assets/tokens/moonbeam/PAD.svg"
          />
          <div>Moonbeam</div>
        </v-tab>
      </slider-tabs>
      <v-subheader class="padswap-ecosystem-subheader">Select ecosystem</v-subheader>
    </div>


    <!----------------------------------->
    <!-- Liquidity pairs owned by user -->
    <!----------------------------------->
    <v-card>

      <v-card-title>
        Your liquidity
      </v-card-title>

      <v-card
      v-for="pairData in pairsOwnedByUser"
      >
        <v-card-title>
          {{ pairData.token0.symbol }} - {{ pairData.token1.symbol }}
        </v-card-title>
      </v-card>
    </v-card>

  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'

import { ethers } from 'ethers'
import { IEcosystem, EcosystemId, ECOSYSTEMS, ChainId } from '@/ecosystem'
import SliderTabs from '@/components/SliderTabs.vue'

import {
    ERC20_ABI,
    PADSWAP_PAIR_ABI,
    SWAP_ROUTER_ABI,
    SWAP_FACTORY_ABI,
    APPROVE_AMOUNT
} from '@/constants'

import {
    WHITELIST,
    DEFAULT_SWAP_ROUTES
} from '@/config/swap_token_whitelist'

import TokenSelector from '@/components/swap/TokenSelector.vue'

const routerAddresses = {
  56: '0x76437234D29f84D9A12820A137c6c6A719138C24', // BSC
  1284: '0x40F1fEF0Fe68Fd10ff904070ee00a7769EE7fe34', // Moonbeam
  1285: '0x790d4b443edB9ce9A8d1aEC585edd89E51132D2c' // Moonriver
}

export default Vue.extend({
    components: { 
        TokenSelector,
        SliderTabs
    },
    data() {
        return {
            pairsOwnedByUser: <any> [],

            inputToken: <any> {},
            outputToken: <any> {},

            inputTokenAllowance: <string> '0',
            outputTokenAllowance: <string> '0',

            inputTokenBalance: <string> '0',

            inputAmount: <string> '',
            outputAmount: <string> '',

            exactToken: '',

            tokenWhitelist: <any> [],

            tokenSelectionDialog: <boolean> false,
            selectedTokenAddress: <string> '',

            routerContractAddress: <string> '0x40F1fEF0Fe68Fd10ff904070ee00a7769EE7fe34',

            inputTokenAddress: <string> '0x59193512877E2EC3bB27C178A8888Cfac62FB32D',
            outputTokenAddress: <string> '0xF480f38C366dAaC4305dC484b2Ad7a496FF00CeA'
        }
    },
    created() {
      this.updatePairsOwnedByUser()
    },
    computed: {
        ecosystemId: {
          get(): EcosystemId {
            return this.$store.state.ecosystemId
          },
          set(val: EcosystemId) {
            this.$store.commit('setEcosystemId', val)
            if (val == 0) {
              this.setSwapEcosystem("BSC")
            }
            else if (val == 1) {
              this.setSwapEcosystem("MOVR")
            }
            else if (val == 2) {
              this.setSwapEcosystem("GLMR")
            }
          }
        },
        userAddress(): string {
          return this.$store.state.address
        },
        multicall(): ethers.providers.Provider {
          return this.$store.getters.multicall
        },
        ecosystem(): IEcosystem {
          return this.$store.getters.ecosystem
        },
        web3(): ethers.Signer | null {
          return this.$store.state.web3
        },
        chainId(): ChainId {
          return this.$store.getters.ecosystem.chainId
        },
        tokensApproved(): boolean {
          if ((parseFloat(this.inputAmount) > 0 && parseFloat(this.inputTokenAllowance) < parseFloat(this.inputAmount))) {
            return false
          }
          else {
            return true
          }
        }
    },
    watch: {
        inputToken() {
            this.updateTokenBalances()
            this.updateOutputEstimation()
        },
        outputToken() {
            this.updateTokenBalances()
            this.updateOutputEstimation()
        },
        inputAmount() {
            this.updateOutputEstimation()
        }
    },
    methods: {
        setSwapEcosystem(chain_id : string) {
          this.routerContractAddress = routerAddresses[this.chainId]
          this.setDefaultRoute()

          const urlParams = new URLSearchParams(window.location.search)
          const [action, token1, token2] = [urlParams.get('action'), urlParams.get('token1'), urlParams.get('token2')]
          let appendParameters = ''
          if(action) {
            appendParameters = `#/${action}/${token1}/${token2}`
          } else {
            const inputCurrency = urlParams.get('inputCurrency')
            const outputCurrency = urlParams.get('outputCurrency')
            if (inputCurrency || outputCurrency) {
              appendParameters = `#/?inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}`
            }
          }


          this.updatePairsOwnedByUser()
        },

        setDefaultRoute() {
            var currentChainDefaults = DEFAULT_SWAP_ROUTES[this.chainId]
            this.inputToken = currentChainDefaults.inputToken
            this.outputToken = currentChainDefaults.outputToken
        },

        updateTokenWhitelist() {
            var currentChainWhitelist = WHITELIST[this.chainId]
            this.tokenWhitelist = currentChainWhitelist
        },

        async updateInputToken(newInputToken : any) {
          if (newInputToken.address == this.outputToken.address) {
            this.outputToken = this.inputToken
          }
          this.inputToken = newInputToken
        },

        async updateOutputToken(newOutputToken : any) {
          if (newOutputToken.address == this.inputToken.address) {
            this.inputToken = this.outputToken
          }
          this.outputToken = newOutputToken
        },

        switchSelectedTokens() {
          var tmp = this.inputToken
          this.inputToken = this.outputToken
          this.outputToken = tmp
        },

        async updateTokenBalances() {
          if (this.inputToken.address == 'eth') {
            const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)

            const ethBalanceBn = await this.multicall.getBalance(this.userAddress)
            const ethBalance = ethers.utils.formatEther(ethBalanceBn)
            this.inputTokenBalance = ethBalance

            this.inputTokenAllowance = 99999999999999999999999999999999999999999999999999999999999.0.toString()
          }
          else {
            const tokenContract = new ethers.Contract(this.inputToken.address, ERC20_ABI, this.multicall)

            const tokenBalanceBn = await tokenContract.balanceOf(this.userAddress)
            const decimals = await tokenContract.decimals()
            const tokenBalance = ethers.utils.formatUnits(tokenBalanceBn, decimals)
            this.inputTokenBalance = tokenBalance

            const tokenAllowanceBn = await tokenContract.allowance(this.userAddress, this.routerContractAddress)
            this.inputTokenAllowance = ethers.utils.formatUnits(tokenAllowanceBn, decimals)
          }
        },

        async updateOutputEstimation() {
          const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)

          const weth = await routerContract.WETH()

          const amountInBn = ethers.utils.parseEther((0 + this.inputAmount).toString())

          let inputToken = this.inputToken.address
          if (inputToken == 'eth') {
            inputToken = weth
          }

          let outputToken = this.outputToken.address
          if (outputToken == 'eth') {
            outputToken = weth
          }

          try {
            const amountsOut = await routerContract.getAmountsOut(amountInBn, [inputToken, outputToken])

            const amountOut0Bn = amountsOut[0] 
            const amountOut1Bn = amountsOut[1]

            const amountOut0 = ethers.utils.formatEther(amountOut0Bn)
            const amountOut1 = ethers.utils.formatEther(amountOut1Bn)

            this.outputAmount = amountOut1.toString()
          }
          catch {
            this.outputAmount = ''
          }
        },

        async swap() {
          if (this.inputToken.address == 'eth') {
            this.swapEthForTokens()
          }
          else if (this.outputToken.address == 'eth') {
            this.swapTokensForEth()
          }
          else {
            this.swapTokensForTokens()
          }
        },

        async approve() {
          const inputTokenContract = new ethers.Contract(this.inputToken.address, ERC20_ABI, this.multicall)

          const tx = await inputTokenContract.populateTransaction.approve(this.routerContractAddress, APPROVE_AMOUNT)
          await this.safeSendTransaction({ tx, targetChainId: this.ecosystem.chainId})
        },

        async swapTokensForTokens() {
            const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)

            const amountInBn = ethers.utils.parseEther(this.inputAmount)
            const minimumAmountOutBn = ethers.utils.parseEther('0')

            const tx = await routerContract.populateTransaction.swapExactTokensForTokens(amountInBn, minimumAmountOutBn, [this.inputToken.address, this.outputToken.address], this.userAddress, Date.now() + 1000 * 60 * 10)

            const txReceipt: ethers.providers.TransactionReceipt | false = await this.safeSendTransaction({ tx, targetChainId: this.chainId })
        },


        async updatePairsOwnedByUser() {
          const pairs = await this.getBasicInfoAboutPairsOwnedByUser()
          await this.fillPairsWithInfo(pairs)
          this.pairsOwnedByUser = pairs
        },


        // Returns an array of addresses of all PadSwap liquidity pairs
        // that exist on the currently selected chain
        async getAllPairAddresses() {
            const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)
            const factoryAddress = await routerContract.factory()

            const factoryContract = new ethers.Contract(factoryAddress, SWAP_FACTORY_ABI, this.multicall)

            const allPairsLength = await factoryContract.allPairsLength()

            let promises = []
            let pairContractAddresses : Array<string> = []
            for (let i = 0; i < allPairsLength; i++) {
              const p = factoryContract.allPairs(i).then((res : any) => pairContractAddresses.push(res))
              promises.push(p)
            }
            await Promise.all(promises)

            return pairContractAddresses
        },


        // Iterates through all liquidity pairs that exist on current chain
        // and returns an array of objects for pairs owned by the user.
        //
        // Objects in this array will only have the pair address and user balance,
        // the rest of the info is filled by fillPairs()
        async getBasicInfoAboutPairsOwnedByUser() {
          const allPairs = await this.getAllPairAddresses()

          let promises = []
          let pairs = []

          for (let i = 0; i < allPairs.length; i++) {
            const pairContract = new ethers.Contract(allPairs[i], PADSWAP_PAIR_ABI, this.multicall)

            const pUserBalance = pairContract.balanceOf(this.userAddress).then((res : ethers.BigNumber) => {
              const balance = ethers.utils.formatEther(res)
              if (balance > 0.0) {
                let pairData = {
                  address: allPairs[i],
                  userBalance: balance
                }
                pairs.push(pairData)
              }
            })
            promises.push(pUserBalance)
          }
          await Promise.all(promises)
          return pairs
        },


        // Takes an array of pairData objects with pair addresses,
        // and fills these objects with all relevant info about these pairs
        async fillPairsWithInfo(pairs : Array<any>) {
          let promises : Array<any> = []

          for (let i = 0; i < pairs.length; i++) {
            const pairData = pairs[i]
            const p = this.fillPairData(pairData)
            promises.push(p)
          }
          await Promise.all(promises)
        },


        // Retrieves the basic token info given a contract address.
        // Returns a dictionary-like object with token data.
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


        // Takes the pairData object that has an 'address' parameter,
        // fills it with all relevant data about the pair and the tokens in it
        // including the token info for both tokens in the pair
        //
        // Doesn't return anything, as it operates on existing pairData objects
        async fillPairData(pairData : any) {
          const pairContract = new ethers.Contract(pairData.address, PADSWAP_PAIR_ABI, this.multicall)

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
        },


        async swapTokensForEth() {
            const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)

            const weth = await routerContract.WETH()

            const amountInBn = ethers.utils.parseEther(this.inputAmount)
            const minimumAmountOutBn = ethers.utils.parseEther('0')

            const tx = await routerContract.populateTransaction.swapExactTokensForETH(amountInBn, minimumAmountOutBn, [this.inputToken.address, weth], this.userAddress, Date.now() + 1000 * 60 * 10)

            const txReceipt: ethers.providers.TransactionReceipt | false = await this.safeSendTransaction({ tx, targetChainId: this.chainId })
        },


        async swapEthForTokens() {
            const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)

            const weth = await routerContract.WETH()

            const amountInBn = ethers.utils.parseEther(this.inputAmount)
            const minimumAmountOutBn = ethers.utils.parseEther('0')

            const tx = await routerContract.populateTransaction.swapExactETHForTokens(minimumAmountOutBn, [weth, this.outputToken.address], this.userAddress, Date.now() + 1000 * 60 * 10)

            tx.value = amountInBn

            const txReceipt: ethers.providers.TransactionReceipt | false = await this.safeSendTransaction({ tx, targetChainId: this.chainId })
        },

        ...mapActions(['requestConnect', 'safeSendTransaction'])
    }
})

</script>

<style scoped>


.v-card {
  background: #181D26;
  border-radius: 15px !important;
  width: 100%;
  color: #B3B8C1 !important;
  padding: 5px 30px;
  font-family: Roboto;
}
.v-select {
  border-radius: 8px;
}
.v-text-field {
  border-radius: 8px;
}
.v-select-list.v-sheet {
  background: #000000;
  font-family: Roboto;
  border-radius: 8px;
}

.padswap-content-sheet {
  width: 100%;
  background: transparent;
}
.padswap-ecosystem-subheader {
  font-size: 14px;
  color: #B3B8C1;
  margin-top: 4px;
  margin-bottom: 50px;
  height: auto;
}
.padswap-ecosystem-tabs /deep/ .v-tabs-bar {
  background: rgba(24, 29, 38, 0.7);
}
.padswap-ecosystem-tabs /deep/ .v-tabs-slider-wrapper {
  background: linear-gradient(180deg, #F99DF3 0%, #FA77F1 100%);
}
.padswap-ecosystem-tabs .v-tab {
  padding: 10px 0px;
  font-weight: bold;
  color: #FFFFFF;
  min-width: 110px;
}
.padswap-ecosystem-tabs .v-tab--active {
  color: #66015e !important;
}

.padswap-farm-type-tabs {
  width: 270px;
  max-width: 270px;
}
.padswap-farm-type-tabs /deep/ .v-tabs-bar {
  background: #292D38;
}
.padswap-farm-type-tabs .v-tab {
  color: #879CA5 !important;
  max-width: 90px;
}
.padswap-farm-type-tabs .v-tab--active {
  color: #181D26 !important;
}

.padswap-header-box {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.padswap-farm-title {
  font-family: Roboto Mono;
  color: #FB53EF;
  font-size: 16px;
}
.padswap-farm-title-shadow {
  text-shadow: 0px 0px 4px rgba(250, 64, 237, 0.5);
}
.v-card.padswap-farms {
  background: rgba(255, 255, 255, 0.05);
}

.padswap-data-title {
  font-size: 12px;
  color: #71767F;
}
.padswap-data-item {
  font-size: 24px;
  color: #FFFFFF;
}

.v-text-field /deep/ .v-icon {
  opacity: 0.5;
}

.padswap-farm-to-import /deep/ .v-btn--absolute {
  display: none;
}

/* TODO: share with Farm */
.padswap-farm-btn {
  border-radius: 100px;
  background: linear-gradient(180deg, #00FC4c 0%, #00D741 100%);
  color: #00310F;
  width: 120px;
  text-transform: none;
  font-size: 16px;
  font-weight: bold;
  font-family: Roboto Mono;
}
@media all and (max-width: 970px) {
  .padswap-farm-btn.padswap-dw-btn {
    width: 100px;
    font-size: 15px;
  }
}

</style>