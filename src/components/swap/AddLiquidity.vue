<template>
  <v-container
  class="text-center">

    <v-card
    flat
    color="transparent"
    style="display: inline-block; padding: 20px;"
    width="100%"
    max-width="600px">

      <!------------->
      <!-- Token A -->
      <!------------->
      <v-card
      color="#16323eb3">
        <v-card-title>
          Token A &nbsp;
          <TokenSelector
          v-bind:selectedToken="tokenA"
          v-bind:tokenWhitelist="tokenWhitelist"
          @tokenSelected="(newTokenData) => updateTokenA(newTokenData)"/>
        </v-card-title>

        <v-card-actions>
          <v-text-field
          v-model="amountTokenA"
          :label="'Amount of ' + tokenA.symbol +' to add ' + '(max: ' + balanceTokenA + ' ' + tokenA.symbol + ')'"
          @click="selectedField = 'tokenA'">
            <template v-slot:append>
              <v-btn
                @click="setMaxA()"
                x-small
                color="#595E67">
                Max
              </v-btn>
            </template>
          </v-text-field>
        </v-card-actions>
      </v-card>


      <div
      style="margin: 10px; opacity: 0.6;">
        <v-icon
        large
        dark
        >
        mdi-plus
        </v-icon>
      </div>

      <!------------->
      <!-- Token B -->
      <!------------->

      <v-card
      color="#16323eb3">
        <v-card-title>
          Token 2 &nbsp;
          <TokenSelector
          v-bind:selectedToken="tokenB"
          v-bind:tokenWhitelist="tokenWhitelist"
          @tokenSelected="(newTokenData) => updateTokenB(newTokenData)"/>
        </v-card-title>

        <v-card-actions>
          <v-text-field
          v-model="amountTokenB"
          :label="'Amount of ' + tokenB.symbol + ' to add ' + '(max: ' + balanceTokenB + ' ' + tokenB.symbol + ')'"
          @click="selectedField='tokenB'">
            <template v-slot:append>
              <v-btn
                @click="setMaxB()"
                x-small
                color="#595E67">
                Max
              </v-btn>
            </template>
          </v-text-field>
        </v-card-actions>
      </v-card>

      <br>

      <div
      v-if="!tokenAisApproved || !tokenBisApproved">

        <v-btn
        v-if="!tokenAisApproved"
        block
        color="#afa449"
        @click="approve('tokenA')">
          APPROVE {{ tokenA.symbol }}
        </v-btn>

        <v-btn
        v-if="!tokenBisApproved"
        block
        color="#afa449"
        @click="approve('tokenB')">
          APPROVE {{ tokenB.symbol }}
        </v-btn>

      </div>
      <div
      v-else>
        <v-btn
        block
        color="green"
        @click="addLiquidity()">
          Add {{ tokenA.symbol }}-{{ tokenB.symbol }} liquidity
        </v-btn>
      </div>

    </v-card>

  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'

import { ethers } from 'ethers'
import { IEcosystem, EcosystemId, ECOSYSTEMS, ChainId } from '@/ecosystem'

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

import { tokenInfo } from '@/mixins/tokenInfo.ts'
import TokenSelector from '@/components/swap/TokenSelector.vue'

const routerAddresses = {
  56: '0x76437234D29f84D9A12820A137c6c6A719138C24', // BSC
  1284: '0x40F1fEF0Fe68Fd10ff904070ee00a7769EE7fe34', // Moonbeam
  1285: '0x790d4b443edB9ce9A8d1aEC585edd89E51132D2c' // Moonriver
}

export default Vue.extend({
    name: 'AddLiquidity',
    components: { 
        TokenSelector,
    },
    mixins: [tokenInfo],
    data() {
        return {
          selectedField: <string> 'tokenA',

            pairsOwnedByUser: <any> [],
            loadingPairsOwnedByUser: <boolean> true,

            inputToken: <any> {},
            outputToken: <any> {},

            tokenA: <any> {},
            tokenB: <any> {},

            amountTokenA: <string> '',
            amountTokenB: <string> '',

            amountToWithdraw: <string> '',


            inputTokenAllowance: <string> '0',
            outputTokenAllowance: <string> '0',

            balanceTokenA: <string> '0',
            balanceTokenB: <string> '0',

            allowanceTokenA: <string> '0',
            allowanceTokenB: <string> '0',

            exactToken: '',

            estimationMode: 0,

            tokenWhitelist: <any> [],

            tokenSelectionDialog: <boolean> false,
            selectedTokenAddress: <string> '',

            routerContractAddress: <string> '0x40F1fEF0Fe68Fd10ff904070ee00a7769EE7fe34',

            inputTokenAddress: <string> '0x59193512877E2EC3bB27C178A8888Cfac62FB32D',
            outputTokenAddress: <string> '0xF480f38C366dAaC4305dC484b2Ad7a496FF00CeA'
        }
    },
    created() {
      this.updateTokenWhitelist()
      this.setDefaultRoute()
    },
    computed: {
        ecosystemId: {
          get(): EcosystemId {
            return this.$store.state.ecosystemId
          },
          set(val: EcosystemId) {
            this.$store.commit('setEcosystemId', val)
            this.updateTokenWhitelist(),

            this.estimationMode = 0
            this.amountTokenA = ''
            this.amountTokenB = ''
            this.updateTokenBalances()

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
        },
        tokenAisApproved(): boolean {
          return true
        },
        tokenBisApproved(): boolean{
          return true
        }
    },
    watch: {
        tokenA() {
            this.updateTokenBalances()
            this.updateEstimation('tokenB')
        },
        tokenB() {
            this.updateTokenBalances()
            this.updateEstimation('tokenA')
        },
        amountTokenA() {
          if (this.selectedField == 'tokenA') {
            this.estimationMode = 0
            this.updateEstimation('tokenB')
          }
        },
        amountTokenB() {
          if (this.selectedField == 'tokenB') {
            this.estimationMode = 1
            this.updateEstimation('tokenA')
          }
        },
        userAddress() {
          this.updateTokenBalances()
        }
    },
    methods: {
        setDefaultRoute() {
            var currentChainDefaults = DEFAULT_SWAP_ROUTES[this.chainId]
            this.tokenA = currentChainDefaults.inputToken
            this.tokenB = currentChainDefaults.outputToken
        },

        setMaxA() {
          this.amountTokenA = this.balanceTokenA
        },

        setMaxB() {
          this.amountTokenB = this.balanceTokenB
        },


        updateTokenWhitelist() {
            var currentChainWhitelist = WHITELIST[this.chainId]
            this.tokenWhitelist = currentChainWhitelist
        },


        async updateTokenA(newToken : any) {
          if (newToken.address == this.tokenB.address) {
            this.tokenB = this.tokenA
          }
          this.tokenA = newToken
        },


        async updateTokenB(newToken : any) {
          if (newToken.address == this.tokenA.address) {
            this.tokenA = this.tokenB
          }
          this.tokenB = newToken
        },


        async getDecimals(tokenContractAddress : string) {
          if (tokenContractAddress == 'eth') {
            return 18
          }
          else {
            let tokenContract = new ethers.Contract(tokenContractAddress, ERC20_ABI, this.multicall)
            const decimals = await tokenContract.decimals()
            return decimals
          }
        },

        async updateEstimation(tokenToEstimate = 'tokenA') {
          const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)

          const factoryContractAddress = await routerContract.factory()
          const factoryContract = new ethers.Contract(factoryContractAddress, SWAP_FACTORY_ABI, this.multicall)

          const weth = await routerContract.WETH()

          let inputToken = this.tokenA.address
          if (inputToken == 'eth') {
            inputToken = weth
          }
   
          let outputToken = this.tokenB.address
          if (outputToken == 'eth') {
            outputToken = weth
          }

          const decimalsIn = await this.getDecimals(inputToken)
          const decimalsOut = await this.getDecimals(outputToken)


          const pairAddress = await factoryContract.getPair(inputToken, outputToken)
          const pairContract = new ethers.Contract(pairAddress, PADSWAP_PAIR_ABI, this.multicall)

          const pairData = await this.getPairData(pairAddress)

          const reserves = await pairContract.getReserves()          


          const token0Amount : number = parseFloat(ethers.utils.formatUnits(reserves._reserve0, pairData.token0.decimals))
          const token1Amount : number = parseFloat(ethers.utils.formatUnits(reserves._reserve1, pairData.token1.decimals))

          let estimationTokenA = token0Amount / token1Amount // How much tokenA you will get for one tokenB
          let estimationTokenB = token1Amount / token0Amount // How much tokenB you will get for one tokenA
          
          if (pairData.token0.address != inputToken) {
            const tmp = estimationTokenB
            estimationTokenB = estimationTokenA
            estimationTokenA = tmp
          }

          if (tokenToEstimate == 'tokenA') {
            const totalEstimation = estimationTokenA * parseFloat(this.amountTokenB)
            this.amountTokenA = (totalEstimation.toFixed(decimalsIn)).toString()
          }

          else {
            const totalEstimation = estimationTokenB * parseFloat(this.amountTokenA)
            this.amountTokenB = (totalEstimation.toFixed(decimalsOut)).toString()
          }
        },



        switchSelectedTokens() {
          var tmp = this.tokenA
          this.tokenA = this.tokenB
          this.tokenB = tmp
        },


        async updateTokenBalances() {
          const pBalanceA = this.getTokenBalance(this.tokenA.address)
          const pBalanceB = this.getTokenBalance(this.tokenB.address)
          const pAllowanceA = this.getTokenAllowance(this.tokenA.address, this.routerContractAddress)
          const pAllowanceB = this.getTokenAllowance(this.tokenB.address, this.routerContractAddress)

          this.balanceTokenA = await pBalanceA
          this.balanceTokenB = await pBalanceB
          this.allowanceTokenA = await pAllowanceA
          this.allowanceTokenB = await pAllowanceB
        },


        async addLiquidity() {
          if (this.tokenA.address == 'eth' || this.tokenB.address == 'eth') {
            this.addLiquidityETH()
          }
          else {
            this.addLiquidityTokens()
          }
        },

        async removeLiquidity() {

        },


        // Approves either tokenA or tokenB, depending on whether the argument received
        // is 'tokenA' or something else
        async approve(tokenID : string) {
          let tokenAddress : string
          if (tokenID == 'tokenA') {
            tokenAddress = this.tokenA.address
          }
          else {
            tokenAddress = this.tokenB.address
          }

          const inputTokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.multicall)

          const tx = await inputTokenContract.populateTransaction.approve(this.routerContractAddress, APPROVE_AMOUNT)
          await this.safeSendTransaction({ tx, targetChainId: this.ecosystem.chainId})
        },


        // Adds TokenA-TokenB liquidity
        async addLiquidityTokens() {
            const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)

            const amountADesired = ethers.utils.parseEther(this.amountTokenA)
            const amountBDesired = ethers.utils.parseEther(this.amountTokenB)

            const amountAMin = ethers.utils.parseEther('0')
            const amountBMin = ethers.utils.parseEther('0')

            const tx = await routerContract.populateTransaction.addLiquidity(
              this.tokenA.address,
              this.tokenB.address,
              amountADesired,
              amountBDesired,
              amountAMin,
              amountBMin,
              this.userAddress,
              Date.now() + 1000 * 60 * 10)

            const txReceipt: ethers.providers.TransactionReceipt | false = await this.safeSendTransaction({ tx, targetChainId: this.chainId })
        },


        // Adds TokenA-ETH liquidity
        async addLiquidityETH() {
            if (this.tokenA.address != 'eth' && this.tokenB.address == 'eth') {
              this.switchSelectedTokens() // Making sure that tokenA is the eth token
            }

            const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)

            const amountETHDesired = ethers.utils.parseEther(this.amountTokenA)
            const amountTokenDesired = ethers.utils.parseEther(this.amountTokenB)

            const amountETHMin = ethers.utils.parseEther('0')
            const amountTokenMin = ethers.utils.parseEther('0')

            const tx = await routerContract.populateTransaction.addLiquidityETH(
              this.tokenB.address,
              amountTokenDesired,
              amountTokenMin,
              amountETHMin,
              this.userAddress,
              Date.now() + 1000 * 60 * 10)

            tx.value = amountETHDesired

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