<template>
  <v-container
  class="text-center">

    <div
    :style="getBackgroundStyle()">
    </div>


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



    <v-card
    class="ma-0 pa-0"
    style="display: inline-block; overflow: hidden; z-index: 1"
    color="transparent"
    width="100%"
    max-width="600px">


      <!----------------->
      <!-- Input token -->
      <!----------------->

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
            Spend &nbsp;
            <TokenSelector
            v-bind:selectedToken="inputToken"
            v-bind:tokenWhitelist="tokenWhitelist"
            @tokenSelected="(newTokenData) => updateInputToken(newTokenData)"/>
          </v-card-title>

          <v-card-actions>
            <v-text-field
            hide-details
            v-model="inputAmount"
            outlined
            :label="'Amount of ' + inputToken.symbol +' to spend ' + '(max: ' + inputTokenBalance + ' ' + inputToken.symbol + ')'"
            @focus="selectedField = 'input'">
              <template v-slot:append>
                <v-btn
                  @click="setMax"
                  x-small
                  color="#595E67">
                  Max
                </v-btn>
              </template>
            </v-text-field>
          </v-card-actions>
        </v-card>
      </div>

      


      <!------------------------------------>
      <!-- "Change swap direction" button -->
      <!------------------------------------>
      <v-btn
      color="white"
      plain
      fab
      large
      @click="switchSelectedTokens()">
        <v-icon
        large
        dark
        >
        mdi-swap-vertical
        </v-icon>
      </v-btn>


      <!------------------>
      <!-- Output token -->
      <!------------------>
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
            Receive &nbsp;
            <TokenSelector
            v-bind:selectedToken="outputToken"
            v-bind:tokenWhitelist="tokenWhitelist"
            @tokenSelected="(newTokenData) => updateOutputToken(newTokenData)"/>
          </v-card-title>

          <v-card-actions>
            <v-text-field
            hide-details
            outlined
            v-model="outputAmount"
            :label="'Amount of ' + outputToken.symbol + ' to receive'"
            @focus="selectedField='output'">
            </v-text-field>
          </v-card-actions>
        </v-card>
      </div>

      <br/>

      <br/>


      <!------------------------------------->
      <!-- Connect / approve / swap button -->
      <!------------------------------------->

      <div style="text-align: center;">
        <div style="display: inline-block; width: 90%;">

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

          <!-- Disabling the swap button if user doesn't have enough tokens for this swap -->
          <div
          v-else-if="parseFloat(inputTokenBalance) < parseFloat(inputAmount)">
            <v-btn
            block
            height="50px"
            color="gray"
            disabled>
              Insufficient {{ inputToken.symbol }} balance
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
              Finding best swap route
            </v-btn>
          </div>

          <!-- "Approve" button if the input token is not approved -->
          <div
          v-else-if="!tokensApproved">
            <v-btn
            block
            height="50px"
            color="#afa449"
            @click="approve()">
              APPROVE
            </v-btn>
          </div>

          <!-- "Swap" button if everything is OK and we're ready to swap -->
          <div
          v-else>
            <v-btn
            block
            height="50px"
            x-large
            color="green"
            @click="swap()">
              SWAP
            </v-btn>
          </div>

        </div>
      </div>





      <!----------------------------------------->
      <!-- Transaction info panel,             -->
      <!-- shown only if input amount is not 0 -->
      <!----------------------------------------->

      <br/>
      <br/>

      <v-simple-table
      dense
      plain
      style="background-color: transparent;"
      v-if="parseFloat(0 + inputAmount) > 0">
        <tbody>
          <tr :style="getPriceImpactStyle()">
            <td>Price impact:</td><td>{{ priceImpactPercent }}%</td>
          </tr>
          <tr>
            <td>Amount spent:</td>
            <td>
              <template v-if="swapMode == 0">
                <span style="color: rgb(159 255 232);">Exactly</span> {{ toNumber(inputAmount) }} {{ inputToken.symbol }}
              </template>
              <template v-if="swapMode == 1">
                <span style="color: rgb(255 219 140);">At most</span> {{ toNumber(maximumSold) }} {{ inputToken.symbol }}
              </template>
            </td>
          </tr>
          <tr>
            <td>Amount received:</td>
            <td>
              <template v-if="swapMode == 0">
                <span style="color: rgb(255 219 140);">At least</span> {{ toNumber(minimumReceived) }} {{ outputToken.symbol }}
              </template>
              <template v-if="swapMode == 1">
                <span style="color: rgb(159 255 232);">Exactly</span> {{ toNumber(outputAmount) }} {{ outputToken.symbol }}
              </template>
            </td>
          </tr>
        </tbody>
      </v-simple-table>

      <br/>
      <br/>

      <!--------------------------------------->
      <!-- Customizable transaction settings -->
      <!--------------------------------------->

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

        <v-row>
          <v-col
          style="margin: 0; padding: 0; margin-top: 5px;"
          cols="6">
            Transaction deadline
          </v-col>
          <v-col
          style="margin: 0; padding: 0;"
          cols="6">
            <v-text-field
            style="max-width: 120px;"
            solo-inverted
            dense
            v-model="transactionDeadlineMinutes"
            suffix="minutes">
            </v-text-field>
          </v-col>
        </v-row>
      </v-card>

    </v-card>

    <br>

    <v-btn
    plain
    href="/liquidity">
      Add/remove liquidity
    </v-btn>

  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'

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


import { tokenInfo } from '@/mixins/tokenInfo.ts'
import TokenSelector from '@/components/swap/TokenSelector.vue'

const routerAddresses = {
  56: '0x76437234D29f84D9A12820A137c6c6A719138C24', // BNB
  1284: '0x40F1fEF0Fe68Fd10ff904070ee00a7769EE7fe34', // Moonbeam
  1285: '0x790d4b443edB9ce9A8d1aEC585edd89E51132D2c' // Moonriver
}

const padAddresses = {
  56: '0xC0888d80EE0AbF84563168b3182650c0AdDEb6d5',
  1284: '0x59193512877E2EC3bB27C178A8888Cfac62FB32D',
  1285: '0x45488C50184Ce2092756ba7CdF85731fD17e6f3d'
}

const toadAddresses = {
  56: '0x463E737D8F740395ABf44f7aac2D9531D8D539E9',
  1284: '0xF480f38C366dAaC4305dC484b2Ad7a496FF00CeA',
  1285: '0x165DBb08de0476271714952C3C1F068693bd60D7'
}

export default Vue.extend({
    components: { 
        TokenSelector,
        SliderTabs
    },
    mixins: [tokenInfo],
    data() {
        return {

          isEstimationLoading: <boolean> false,

          selectedField: 'input',

          slippageTolerance: <string> '1',
          transactionDeadlineMinutes: <string> '15',
          priceImpactPercent: <string> '',


          inputToken: <any> {},
          outputToken: <any> {},

          inputTokenAllowance: <string> '0',
          outputTokenAllowance: <string> '0',

          inputTokenBalance: <string> '0',

          inputAmount: <string> '',
          outputAmount: <string> '',

          swapMode: 0,

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
        tokensApproved(): boolean {
          if ((parseFloat(this.inputAmount) > 0 && parseFloat(this.inputTokenAllowance) < parseFloat(this.inputAmount))) {
            return false
          }
          else {
            return true
          }
        },
        minimumReceived(): number {
          const minimumPercentage = 1.0 - (parseFloat(this.slippageTolerance) / 100.0)
          const minimumAmount = parseFloat(this.outputAmount) * minimumPercentage
          return minimumAmount
        },
        maximumSold(): number {
          const maximumExtraPercentage = (parseFloat(this.slippageTolerance) / 100.0)
          const maximumAmount = parseFloat(this.inputAmount) + parseFloat(this.inputAmount) * maximumExtraPercentage
          return maximumAmount
        },

        // TODO: handle tokens with different decimals
        inputAmountBn() : ethers.BigNumber {
          return ethers.utils.parseEther(this.inputAmount.toString())
        },
        outputAmountBn() : ethers.BigNumber {
          return ethers.utils.parseEther(this.outputAmount.toString())
        },
        maximumInBn() : ethers.BigNumber {
          return ethers.utils.parseEther(this.maximumSold.toString())
        },
        minimumOutBn() : ethers.BigNumber {
          return ethers.utils.parseEther(this.minimumReceived.toString())
        },
        txDeadline() : number {
          return Date.now() + 1000 * 60 * parseFloat(this.transactionDeadlineMinutes)
        }
    },
    watch: {
        inputToken() {
          this.updateTokenBalances()
          this.updateOutputEstimation()
        },
        outputToken() {
          this.updateTokenBalances()
          this.updateInputEstimation()
        },
        inputAmount() {
          if (this.selectedField == 'input') {
            this.swapMode = 0
            this.updateOutputEstimation()
          }
        },
        outputAmount() {
          if (this.selectedField == 'output') {
            this.swapMode = 1
            this.updateInputEstimation()
          }
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
        this.swapMode = 0
        this.inputAmount = ''
        this.outputAmount = ''
        this.updateTokenWhitelist()
        this.setDefaultRoute()
        setTimeout(this.updateTokenBalances, 200)

        if (this.chainId == 56) {
          this.setSwapEcosystem("BSC")
        }
        else if (this.chainId == 1285) {
          this.setSwapEcosystem("MOVR")
        }
        else if (this.chainId == 1284) {
          this.setSwapEcosystem("GLMR")
        }
      },

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
          this.updateTokenWhitelist()
          this.updateTokenBalances()
          this.updateOutputEstimation()
        },


        toNumber(num : any) {
          if (isNaN(parseFloat(num))) {
            return 0
          }
          return parseFloat(num)
        },


        round(num : any, dec : any) {
          num = Number(num).toFixed(20)
          if(!Number.isFinite(Number(num))) num = '0.0'
          num = Number(num).toFixed(20)
          const regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${dec}})?`)
          let [int, decimals] = num.toString().replace(',', '.').split('.')
          if(dec == 0) return int
          const rounded = num.toString().match(regex)[0]
          return rounded
        },


        biOrMiOrK(num : number) : string {
          if(num>=1e9) return this.round(num/1e9, 2) + 'BI'
          else if(num>=1e6) return this.round(num/1e6, 2) + 'M'
          else if (num>=1e3) return this.round(num/1e3, 2) + 'K'
          else if (num>= 1e2) return this.round(num, 2)
          else if (num >= 1) return this.round(num, 4)
          else return this.round(num, 6)
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


        setMax() {
          this.inputAmount = this.inputTokenBalance
        },


        switchSelectedTokens() {
          var tmp = this.inputToken
          this.inputToken = this.outputToken
          this.outputToken = tmp
        },


        async updateTokenBalances() {
          if (!this.web3){
            this.inputTokenBalance = '0'
            return
          }
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


        async updateInputEstimation() {
          this.isEstimationLoading = true

          // Not doing anything if the input amount is zero
          if (parseFloat(0 + this.outputAmount) == 0) {
            this.inputAmount = ''
            this.isEstimationLoading = false
            return
          }

          const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)

          const weth = await routerContract.WETH()

          let inputToken = this.inputToken.address
          if (inputToken == 'eth') {
            inputToken = weth
          }

          let outputToken = this.outputToken.address
          if (outputToken == 'eth') {
            outputToken = weth
          }

          const decimalsIn = await this.getDecimals(inputToken)
          const decimalsOut = await this.getDecimals(outputToken)

          // Retrieving the actual input amounts from output amount provided by user
          const amountOutBn = ethers.utils.parseUnits(this.outputAmount.toString(), decimalsOut)
          const bestResult = await this.findBestRoute(amountOutBn, inputToken, outputToken, false)


          // Parsing the resulting input token amount with user-specified output amount
          const amountInBn = bestResult["price"]
          const inputAmount = ethers.utils.formatUnits(amountInBn, decimalsIn)

          // Retrieving input amounts with a much smaller output amount,
          // to compare the resulting amounts and calculate the price impact
          const smallOutputAmount : number = parseFloat( ( parseFloat(0.0 + this.outputAmount) / 100000.0).toFixed(decimalsOut) )
          const smallOutputAmountBn: ethers.BigNumber = amountOutBn.div(100000)
          const smallAmountsIn = await routerContract.getAmountsIn(smallOutputAmountBn, bestResult["route"])

          // Parsing the resulting input amount with a smaller output amount
          const smallAmountInBn = smallAmountsIn[0]
          const smallInputAmount = ethers.utils.formatUnits(smallAmountInBn, decimalsIn)

          // Calculating the price impact
          const smallInputValue = smallOutputAmount / parseFloat(smallInputAmount)
          const realInputValue = parseFloat(this.outputAmount) / parseFloat(inputAmount)
          const receivedValuePercent = (realInputValue / smallInputValue) * 100.0
          const impactPercent = 100.0 - receivedValuePercent

          // Recording the results
          this.priceImpactPercent = impactPercent.toFixed(2)
          this.inputAmount = inputAmount.toString()

          this.isEstimationLoading = false
        },


        async updateOutputEstimation() {
          this.isEstimationLoading = true

          // Not doing anything if the input amount is zero
          if (parseFloat(0 + this.inputAmount) == 0) {
            this.outputAmount = ''
            this.isEstimationLoading = false
            return
          }

          const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)
          const weth = await routerContract.WETH()

          let inputToken = this.inputToken.address
          if (inputToken == 'eth') {
            inputToken = weth
          }

          let outputToken = this.outputToken.address
          if (outputToken == 'eth') {
            outputToken = weth
          }

          const decimalsIn = await this.getDecimals(inputToken)
          const decimalsOut = await this.getDecimals(outputToken)

          // Retrieving the actual output amounts from input amount provided by user
          const amountInBn : ethers.BigNumber = ethers.utils.parseUnits(this.inputAmount.toString(), decimalsIn)
          const bestResult = await this.findBestRoute(amountInBn, inputToken, outputToken)

          // Parsing the normal output token amount
          const amountOutBn = bestResult["price"]
          const outputAmount = ethers.utils.formatUnits(amountOutBn, decimalsOut)

          // Retrieving output amounts with a much smaller input amount,
          // to compare the resulting amounts and calculate the price impact
          const smallInputAmount : number = parseFloat( (parseFloat(0.0 + this.inputAmount) / 100000.0).toFixed(decimalsIn) )
          const smallInputAmountBn : ethers.BigNumber = amountInBn.div(100000)
          const smallAmountsOut = await routerContract.getAmountsOut(smallInputAmountBn, bestResult["route"])

          console.log("small amounts retrieved")

          // Parsing the output amount with a smaller input amount
          const smallAmountOutBn = smallAmountsOut[smallAmountsOut.length - 1]
          const smallOutputAmount = ethers.utils.formatUnits(smallAmountOutBn, decimalsOut)

          // Calculating the price impact
          const smallOutputValue = parseFloat(smallOutputAmount) / smallInputAmount
          const realOutputValue = parseFloat(outputAmount) / parseFloat(this.inputAmount)
          const receivedValuePercent = (realOutputValue / smallOutputValue) * 100.0
          const impactPercent = 100.0 - receivedValuePercent

          // Recording the results
          this.priceImpactPercent = impactPercent.toFixed(2)
          this.outputAmount = outputAmount.toString()

          this.isEstimationLoading = false
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


        // Prompts the user to connect the wallet
        async connectWallet() {
          this.$store.dispatch('requestConnect')
        },


        // Calls the appropriate function depending on swap type
        // (tokens for tokens, eth for tokens, etc.)
        async swap() {
          // Swapping the chain's native token for an ERC-20 token
          if (this.inputToken.address == 'eth') {
            if (this.swapMode == 0) {
              this.swapExactETHForTokens()
            }
            else{
              this.swapETHForExactTokens()
            }
          }
          // Swapping an ERC-20 token for the chain's native token
          else if (this.outputToken.address == 'eth') {
            if (this.swapMode == 0) {
              this.swapExactTokensForETH()
            }
            else{
              this.swapTokensForExactETH()
            }
          }
          // Swapping an ERC-20 token for another ERC-20 token
          else {
            if (this.swapMode == 0) {
              this.swapExactTokensForTokens()
            }
            else{
              this.swapTokensForExactTokens()
            }
          }
        },


        async approve() {
          const inputTokenContract = new ethers.Contract(this.inputToken.address, ERC20_ABI, this.multicall)

          const tx = await inputTokenContract.populateTransaction.approve(this.routerContractAddress, APPROVE_AMOUNT)
          await this.safeSendTransaction({ tx, targetChainId: this.ecosystem.chainId})
        },


        //
        // Attempts to find a good swap route
        // by simply comparing a direct tokenA-tokenB swap  
        // to routing the transaction through PAD, TOAD, or the chain's native token 
        //

        async findBestRoute(amountBn : ethers.BigNumber, inputTokenAddress : string, outputTokenAddress : string, exactIn : boolean = true) {

          const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)
          const weth = await routerContract.WETH()
          const pad = padAddresses[this.chainId]
          const toad = toadAddresses[this.chainId]
          const routingAddresses = [weth, pad, toad]

          // Factory contract, inferred from the router contract
          const factoryAddress = await routerContract.factory()
          const factoryContract = new ethers.Contract(factoryAddress, SWAP_FACTORY_ABI, this.multicall)

          //
          // Retrieves the addresses of all existing liquidity pairs
          const pairAddresses : Array<string> = []
          const pRetrievePairAddresses : Array<Promise<any>> = []
          const allPairsLength = await factoryContract.allPairsLength()
          let i : number = 0
          while ( i < allPairsLength ) {
            const promise = factoryContract.allPairs(i).then((pairAddress : string) => {pairAddresses.push(pairAddress)})
            pRetrievePairAddresses.push(promise)
            i += 1
          }
          await Promise.all(pRetrievePairAddresses)

          //
          // Iterates through all pairs, retrieving the two tokens of each pair
          const pairs : any = {}
          const pRetrievePairs : Array<Promise<any>> = []
          for (const pairAddress of pairAddresses) {
            const pairContract = new ethers.Contract(pairAddress, PADSWAP_PAIR_ABI, this.multicall)
            pairs[pairAddress] = {}
            const pToken0 = pairContract.token0().then((tokenAddress : string) => pairs[pairAddress]["token0"] = tokenAddress)
            const pToken1 = pairContract.token1().then((tokenAddress : string) => pairs[pairAddress]["token1"] = tokenAddress)
            pRetrievePairs.push(pToken0, pToken1)
          }
          await Promise.all(pRetrievePairs)
          
          // Identifies the tokens that are paired with the input token
          // or the output token
          const allTokens : Array<string> = []
          const tokensPairedWithInputToken : Array<string> = []
          const tokensPairedWithOutputToken : Array<string> = []
          for (const pairAddress of pairAddresses) {
            const pair = pairs[pairAddress]

            for (const token of [pair.token0, pair.token1]) {
              if (!allTokens.includes(token)) {
                allTokens.push(token)
              }
            }

            if (pair.token0 == inputTokenAddress) {
              tokensPairedWithInputToken.push(pair.token1)
            }
            if (pair.token1 == inputTokenAddress) {
              tokensPairedWithInputToken.push(pair.token0)
            }
            if (pair.token0 == outputTokenAddress) {
              tokensPairedWithOutputToken.push(pair.token1)
            }
            if (pair.token1 == outputTokenAddress) {
              tokensPairedWithOutputToken.push(pair.token0)
            }
          }

          // Identifies tokens that are paired with both the input and the output token
          // to use them for routing the transaction
          const tokensPairedWithBothTokens = []
          for (const tokenAddress of allTokens) {
            if (tokensPairedWithInputToken.includes(tokenAddress) && tokensPairedWithOutputToken.includes(tokenAddress)) {
              tokensPairedWithBothTokens.push(tokenAddress)
            }
          }

          // List of possible routes to compare against each other
          const possibleRoutes = [[inputTokenAddress, outputTokenAddress]]
          for (const routingAddress of tokensPairedWithBothTokens) {
            if (inputTokenAddress != routingAddress && outputTokenAddress != routingAddress) {
              possibleRoutes.push([inputTokenAddress, routingAddress, outputTokenAddress])
            }
          }

          // Calculating resulting prices for all routes
          const promises : any = [routerContract.WETH()]
          const results : any = []
          for (const route of possibleRoutes) {
            if (exactIn == true) { // "Exact input" mode
              const p = routerContract.getAmountsOut(amountBn, route).then((res : any) => {
                var amountOut = res[res.length - 1]
                results.push({
                  "route": route,
                  "price": amountOut
                })
              })
              promises.push(p)
            }
            else { // "Exact output" mode
              const p = routerContract.getAmountsIn(amountBn, route).then((res : any) => {
                var amountIn = res[0]
                results.push({
                  "route": route,
                  "price": amountIn
                })
              })
              promises.push(p)
            } 
          }

          // This construction is needed to ensure that the code keeps running
          // even if the contract shits itself during one of the estimations
          try {
            await Promise.all(promises)
          } catch (err) {}

          // Indentifying the best swap route
          let bestResult = results[0]
          for (const result of results) {
            const priceCurrent = ethers.utils.formatEther(bestResult["price"])
            const priceNew = ethers.utils.formatEther(result["price"])

            if (exactIn == true) { // Looking for highest output if in "exact input" mode
              if (parseFloat(priceNew) > parseFloat(priceCurrent)) {
                bestResult = result
              }
            }
            else { // Looking for lowest input if in "exact output" mode
              if (parseFloat(priceNew) < parseFloat(priceCurrent)) {
                bestResult = result
              }
            }
          }

          return bestResult
        },


        /////////////////////////////////
        // Swapping tokens for tokens  //
        /////////////////////////////////

        async swapExactTokensForTokens() {
            const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)

            const tx = await routerContract.populateTransaction.swapExactTokensForTokens(
              this.inputAmountBn,
              this.minimumOutBn,
              [this.inputToken.address, this.outputToken.address],
              this.userAddress,
              this.txDeadline)

            const txReceipt: ethers.providers.TransactionReceipt | false = await this.safeSendTransaction({ tx, targetChainId: this.chainId })
        },


        async swapTokensForExactTokens() {
            const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)

            const tx = await routerContract.populateTransaction.swapTokensForExactTokens(
              this.outputAmountBn,
              this.maximumInBn,
              [this.inputToken.address, this.outputToken.address],
              this.userAddress,
              this.txDeadline)

            const txReceipt: ethers.providers.TransactionReceipt | false = await this.safeSendTransaction({ tx, targetChainId: this.chainId })
        },



        //////////////////////////////
        // Swapping tokens for ETH  //
        //////////////////////////////

        async swapExactTokensForETH() {
            const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)
            const weth = await routerContract.WETH()

            const tx = await routerContract.populateTransaction.swapExactTokensForETH(
              this.inputAmountBn,
              this.minimumOutBn,
              [this.inputToken.address, weth],
              this.userAddress,
              this.txDeadline)

            const txReceipt: ethers.providers.TransactionReceipt | false = await this.safeSendTransaction({ tx, targetChainId: this.chainId })
        },


        async swapTokensForExactETH() {
            const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)
            const weth = await routerContract.WETH()

            const tx = await routerContract.populateTransaction.swapExactTokensForETH(
              this.outputAmountBn,
              this.maximumInBn,
              [this.inputToken.address, weth],
              this.userAddress,
              this.txDeadline)

            const txReceipt: ethers.providers.TransactionReceipt | false = await this.safeSendTransaction({ tx, targetChainId: this.chainId })
        },



        //////////////////////////////
        // Swapping ETH for tokens  //
        //////////////////////////////

        async swapExactETHForTokens() {
            const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)
            const weth = await routerContract.WETH()

            const tx = await routerContract.populateTransaction.swapExactETHForTokens(
              this.minimumOutBn,
              [weth, this.outputToken.address],
              this.userAddress,
              this.txDeadline)

            tx.value = this.inputAmountBn

            const txReceipt: ethers.providers.TransactionReceipt | false = await this.safeSendTransaction({ tx, targetChainId: this.chainId })
        },


        async swapETHForExactTokens() {
          const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)
          const weth = await routerContract.WETH()

          const tx = await routerContract.populateTransaction.swapETHForExactTokens(
            this.outputAmountBn,
            [weth, this.outputToken.address],
            this.userAddress,
            this.txDeadline)

          tx.value = this.maximumInBn

          const txReceipt: ethers.providers.TransactionReceipt | false = await this.safeSendTransaction({ tx, targetChainId: this.chainId })
        },



        //////////////
        // Styling  //
        ///////////////

        // Returns the appropriate page background color depending on the ecosystem
        getBackgroundStyle() {
          let ecosystemBackgrounds = {
            56: "background: radial-gradient(circle, #6a6a6a45 0%, rgba(253, 187, 45, 0) 100%);",
            1284: "background: radial-gradient(circle, #6e00ff40 0%, rgba(253, 187, 45, 0) 100%);",
            1285: "background: radial-gradient(circle, #007eff40 0%, rgba(253, 187, 45, 0) 100%);"
          }

          let backgroundStyle = "opacity: 80%; width: 100%; height: 100%; position: fixed; left: 0; top: 0;" + ecosystemBackgrounds[this.chainId]
          
          return backgroundStyle
        },

        // Returns the appropriate background class for the token selection cards
        getCardStyle() {
          let ecosystemBackgrounds = {
            56: "bg bg-bsc",
            1284: "bg bg-moonbeam",
            1285: "bg bg-moonriver"
          }

          const backgroundClass = ecosystemBackgrounds[this.chainId]
          
          return backgroundClass
        },

        // Returns the price impact color based on its severity
        getPriceImpactStyle() {
          let impactStyles : any = {
            1.0: "color: rgb(49, 208, 170);",
            3.0: "color: white;",
            5.0: "color: rgb(240, 185, 11);"
          }

          // Returning one of the "safe" colors if the price impact is below one of the thresholds
          for (const [key, value] of Object.entries(impactStyles)) {
            if (parseFloat(this.priceImpactPercent) < parseFloat(key)) {
              return value
            }
          }

          // Otherwise the slippage is too high and the color will be red
          return "color: rgb(237, 75, 158);"
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