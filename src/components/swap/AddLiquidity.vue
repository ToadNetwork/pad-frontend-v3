<template>
  <v-container
  class="text-center">

    <v-card
    flat
    color="transparent"
    class="pa-0"
    style="display: inline-block; z-index: 2; margin-top: 20px;"
    width="100%"
    max-width="600px">

      <!------------->
      <!-- Token A -->
      <!------------->
      <div
      class="gradient-border"
      style="z-index: -1;">
        <v-card
        style="padding: 0px 10px 10px 10px;"
        color="transparent">
          <div
          :class="getCardStyle()"
          style="border-radius: 15px; z-index: -1">
          </div>

          <v-card-title style="font-size: 1.1em; padding-left: 10px; margin-bottom: 5px;">
            Token A &nbsp;
            <TokenSelector
            v-bind:selectedToken="tokenA"
            v-bind:tokenWhitelist="tokenWhitelist"
            @tokenSelected="(newTokenData) => updateTokenA(newTokenData)"/>
          </v-card-title>

          <v-card-actions>
            <v-text-field
            hide-details
            outlined
            v-model="amountTokenA"
            :label="'Amount of ' + tokenA.symbol +' to add ' + '(max: ' + balanceTokenA + ' ' + tokenA.symbol + ')'"
            @focus="estimationMode = 0">
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
      </div>


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

      <div
      class="gradient-border"
      style="z-index: -1;">
        <v-card
        style="padding: 0px 10px 10px 10px;"
        color="transparent">
          <div
          :class="getCardStyle()"
          style="border-radius: 15px; z-index: -1">
          </div>

          <v-card-title style="font-size: 1.1em; padding-left: 10px; margin-bottom: 5px;">
            Token B &nbsp;
            <TokenSelector
            v-bind:selectedToken="tokenB"
            v-bind:tokenWhitelist="tokenWhitelist"
            @tokenSelected="(newTokenData) => updateTokenB(newTokenData)"/>
          </v-card-title>

          <v-card-actions>
            <v-text-field
            hide-details
            outlined
            v-model="amountTokenB"
            :label="'Amount of ' + tokenB.symbol + ' to add ' + '(max: ' + balanceTokenB + ' ' + tokenB.symbol + ')'"
            @focus="estimationMode = 1">
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
      </div>

      <br>
      
      <v-card
      elevation="0"
      color="transparent">
        <v-row>
          <v-col
          style="margin: 0; padding: 0; margin-top: 5px;"
          cols="6">
            Slippage tolerance
          </v-col>
          <v-col
          style="margin: 0; padding: 0;"
          cols="6">
            <v-text-field
            style="max-width: 70px;"
            solo-inverted
            dense
            v-model="slippageTolerance"
            suffix="%">
            </v-text-field>
          </v-col>
        </v-row>
      </v-card>



      <div style="text-align: center;">
        <div style="display: inline-block; width: 90%;">

          <v-card
          v-if="!pairAlreadyExists"
          style="margin: 0 0 20px 0;"
          class="text-left"
          outlined>
            <v-card-title>This pair does not exist yet.</v-card-title>
            <v-card-text>
              You are the first liquidity provider in the {{ tokenA.symbol }}-{{ tokenB.symbol }} pool.<br><br>
              Because the pool doesn't already exist, you will need to manually enter the amounts of {{ tokenA.symbol }} and {{ tokenB.symbol }} to add to the pool.<br><br>
              Please double-check the ratio of tokens you add, as the ratio between added tokens will determine the price of the tokens in the pool.
            </v-card-text>
          </v-card>

          <!-- Prompting the user to connect wallet if not connected -->
          <div
          v-if="!isConnected || !web3">
            <v-btn
            block
            height="50px"
            color="orange"
            @click="connectWallet()">
              CONNECT WALLET
            </v-btn>
          </div>

          <!-- Disabling the button if user doesn't have enough tokens for this swap -->
          <div
          v-else-if="parseFloat(balanceTokenA) < parseFloat(amountTokenA)">
            <v-btn
            block
            height="50px"
            color="gray"
            disabled>
              Insufficient {{ tokenA.symbol }} balance
            </v-btn>
          </div>
          <div
          v-else-if="parseFloat(balanceTokenB) < parseFloat(amountTokenB)">
            <v-btn
            block
            height="50px"
            color="gray"
            disabled>
              Insufficient {{ tokenB.symbol }} balance
            </v-btn>
          </div>

          <!-- Disabling the button if the swap results are currently being estimated -->
          <div
          v-else-if="isEstimationLoading">
            <v-btn
            block
            height="50px"
            color="gray"
            disabled>
              <v-progress-circular
                indeterminate
                :size="20"
                :width="3"
                color="gray"
              ></v-progress-circular>
              &nbsp;
              Estimating token amounts
            </v-btn>
          </div>

          <div
          v-else-if="!isApprovedTokenA || !isApprovedTokenB">
            <v-btn
            v-if="!isApprovedTokenA"
            block
            color="#afa449"
            @click="approve('tokenA')">
              APPROVE {{ tokenA.symbol }}
            </v-btn>

            <v-btn
            v-if="!isApprovedTokenB"
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

        </div>
      </div>

    </v-card>

  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'

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
        slippageTolerance: <string> '1',
        
        isEstimationLoading: <boolean> false,

        pairsOwnedByUser: <any> [],
        loadingPairsOwnedByUser: <boolean> true,

        inputToken: <any> {},
        outputToken: <any> {},

        tokenA: <any> {},
        tokenB: <any> {},

        amountTokenA: <string> '0',
        amountTokenB: <string> '0',

        amountToWithdraw: <string> '',


        inputTokenAllowance: <string> '0',
        outputTokenAllowance: <string> '0',

        balanceTokenA: <string> '0',
        balanceTokenB: <string> '0',

        allowanceTokenA: <string> '0',
        allowanceTokenB: <string> '0',

        exactToken: '',

        // Checked while updating the token estimation.
        // Set to false if the pair for these two tokens doesn't already exist.
        // If false, a warning will be shown about being the first liquidity provider.
        pairAlreadyExists: <boolean> true,

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
      this.initializeForCurrentChain()
      setInterval(this.updateTokenBalances, 3000)
    },
    computed: {
        ecosystemId: {
          get(): EcosystemId {
            return this.$store.state.ecosystemId
          },
          set(val: EcosystemId) {
            this.$store.commit('setEcosystemId', val)
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
        isApprovedTokenA(): boolean {
          if ((parseFloat(this.amountTokenA) > 0 && parseFloat(this.allowanceTokenA) < parseFloat(this.amountTokenA))) {
            return false
          }
          else {
            return true
          }
        },
        isApprovedTokenB(): boolean {
          if ((parseFloat(this.amountTokenB) > 0 && parseFloat(this.allowanceTokenB) < parseFloat(this.amountTokenB))) {
            return false
          }
          else {
            return true
          }
        },
    },
    watch: {
        tokenA() {
            this.updateTokenBalances()
            this.updateEstimation()
        },
        tokenB() {
            this.updateTokenBalances()
            this.updateEstimation()
        },
        amountTokenA() {
          this.updateEstimation()
        },
        amountTokenB() {
          this.updateEstimation()
        },
        estimationMode() {
          this.updateEstimation()
        },
        userAddress() {
          this.updateTokenBalances()
        },
        chainId() { // Re-initializing after changing chain
          this.initializeForCurrentChain()
        }
    },
    methods: {
      // Called on initialization
      // and when switching to another chain
      initializeForCurrentChain() {
        this.routerContractAddress = routerAddresses[this.chainId]
        this.estimationMode = 0
        this.amountTokenA = ''
        this.amountTokenB = ''
        this.updateTokenWhitelist()
        this.setDefaultRoute()
        setTimeout(this.updateTokenBalances, 200)
      },

        getCardStyle() {
          let ecosystemBackgrounds = {
            56: "bg bg-bsc",
            1284: "bg bg-moonbeam",
            1285: "bg bg-moonriver"
          }

          const backgroundClass = ecosystemBackgrounds[this.chainId]
          
          return backgroundClass
        },

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

        async updateEstimation() {
          this.isEstimationLoading = true

          // Not doing anything if the input amount is zero
          if ((parseFloat(0 + this.amountTokenA) == 0 && this.estimationMode == 0)) {
            // this.amountTokenB = ''
            this.isEstimationLoading = false
            return
          }
          if ((parseFloat(0 + this.amountTokenB) == 0 && this.estimationMode == 1)) {
            // this.amountTokenA = ''
            this.isEstimationLoading = false
            return
          }

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

          // Checking if the pair for these two tokens already exists.
          // If it doesn't, then the amount of other token cannot be auto-estimated,
          // and a warning will be shown about being the first provider in that pool.
          let pairAddress : string = ""
          try {
            pairAddress = await factoryContract.getPair(inputToken, outputToken)
            this.pairAlreadyExists = true
          }
          catch (err) {
            this.pairAlreadyExists = false
            this.isEstimationLoading = false
            return
          }
          if (pairAddress == '0x0000000000000000000000000000000000000000') {
            this.pairAlreadyExists = false
            this.isEstimationLoading = false
            return
          }

          const pairContract = new ethers.Contract(pairAddress, PADSWAP_PAIR_ABI, this.multicall)

          // @ts-ignore-next-line
          const pairData = await this.getPairData(pairAddress)

          const reserves = await pairContract.getReserves()          

          const token0Amount : number = parseFloat(ethers.utils.formatUnits(reserves._reserve0, pairData.token0.decimals))
          const token1Amount : number = parseFloat(ethers.utils.formatUnits(reserves._reserve1, pairData.token1.decimals))

          let estimationTokenA = token0Amount / token1Amount // How much tokenA you will get for one tokenB
          let estimationTokenB = token1Amount / token0Amount // How much tokenB you will get for one tokenA
          
          if (pairData.token0.address.toLowerCase() != inputToken.toLowerCase()) {
            const tmp = estimationTokenB
            estimationTokenB = estimationTokenA
            estimationTokenA = tmp
          }


          if (this.estimationMode == 1) {
            const totalEstimation = estimationTokenA * parseFloat(this.amountTokenB)
            this.amountTokenA = (totalEstimation.toFixed(decimalsIn)).toString()
          }

          else {
            const totalEstimation = estimationTokenB * parseFloat(this.amountTokenA)
            this.amountTokenB = (totalEstimation.toFixed(decimalsOut)).toString()
          }

          this.isEstimationLoading = false
        },



        switchSelectedTokens() {
          var tmp = this.tokenA
          this.tokenA = this.tokenB
          this.tokenB = tmp
        },


        async updateTokenBalances() {
           if (!this.web3){
            this.balanceTokenA = '0'
            this.balanceTokenB = '0'
            return
          }

          // @ts-ignore-next-line
          const pBalanceA = this.getTokenBalance(this.tokenA.address)
          // @ts-ignore-next-line
          const pBalanceB = this.getTokenBalance(this.tokenB.address)
          // @ts-ignore-next-line
          const pAllowanceA = this.getTokenAllowance(this.tokenA.address, this.routerContractAddress)
          // @ts-ignore-next-line
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


        // Approves either tokenA or tokenB
        // Takes 'tokenA' or 'tokenB' as argument
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

          const minimumPercentage = 100 - parseInt(this.slippageTolerance)

            const amountAMin = amountADesired.mul(minimumPercentage).div(100)
            const amountBMin = amountBDesired.mul(minimumPercentage).div(100)

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

            const minimumPercentage = 100 - parseInt(this.slippageTolerance)

            const amountETHMin = amountETHDesired.mul(minimumPercentage).div(100)
            const amountTokenMin = amountTokenDesired.mul(minimumPercentage).div(100)

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

        ...mapGetters(['isConnected']),
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