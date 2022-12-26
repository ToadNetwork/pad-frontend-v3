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
    style="display: inline-block; padding: 20px; overflow: hidden;"
    color="transparent"
    width="100%"
    max-width="600px">


      <!----------------->
      <!-- Input token -->
      <!----------------->
      <v-card
      color="#618b4233">
        <v-card-title>
          Spend &nbsp;
          <TokenSelector
          v-bind:selectedToken="inputToken"
          v-bind:tokenWhitelist="tokenWhitelist"
          @tokenSelected="(newTokenData) => updateInputToken(newTokenData)"/>
        </v-card-title>

        <v-card-subtitle>
        </v-card-subtitle>

        <v-card-text>
        </v-card-text>

        <v-card-actions>
          <v-text-field
          v-model="inputAmount"
          :label="'Amount of ' + inputToken.symbol +' to spend ' + '(max: ' + inputTokenBalance + ' ' + inputToken.symbol + ')'"
          @click="selectedField = 'input'">
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
      <v-card
      color="#618b4233">
        <v-card-title>
          Receive &nbsp;
          <TokenSelector
          v-bind:selectedToken="outputToken"
          v-bind:tokenWhitelist="tokenWhitelist"
          @tokenSelected="(newTokenData) => updateOutputToken(newTokenData)"/>
        </v-card-title>

        <v-card-subtitle>
        </v-card-subtitle>

        <v-card-text>
        </v-card-text>

        <v-card-actions>
          <v-text-field
          v-model="outputAmount"
          :label="'Amount of ' + outputToken.symbol + ' to receive'"
          @click="selectedField='output'">
          </v-text-field>
        </v-card-actions>
      </v-card>

      <br/>

      <br/>


      <!------------------------------------->
      <!-- Connect / approve / swap button -->
      <!------------------------------------->
      <div
      v-if="!isConnected || !web3">
        <v-btn
        block
        color="orange"
        @click="connectWallet()">
          CONNECT WALLET
        </v-btn>
      </div>
      <div
      v-else-if="!tokensApproved">
        <v-btn
        block
        color="#afa449"
        @click="approve()">
          APPROVE
        </v-btn>
      </div>
      <div
      v-else>
        <v-btn
        block
        x-large
        color="green"
        @click="swap()">
          SWAP
        </v-btn>
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
    SWAP_ROUTER_ABI,
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
        this.setDefaultRoute()
        this.updateTokenWhitelist()
        setTimeout(this.updateTokenBalances, 200)
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
          // Not doing anything if the input amount is zero
          if (0 + this.outputAmount == 0) {
            this.inputAmount = ''
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
          const smallOutputAmount = parseFloat(0.0 + this.outputAmount) / 100000.0
          const smallOutputAmountBn = ethers.utils.parseUnits(smallOutputAmount.toString(), decimalsOut)
          const smallAmountsIn = await routerContract.getAmountsIn(smallOutputAmountBn, bestResult["route"])

          // Parsing the resulting input amount with a smaller output amount
          const smallAmountInBn = smallAmountsIn[0]
          const smallInputAmount = ethers.utils.formatUnits(smallAmountInBn, decimalsIn)

          // Calculating the price impact
          const smallInputValue = parseFloat(smallOutputAmount) / parseFloat(smallInputAmount)
          const realInputValue = parseFloat(this.outputAmount) / parseFloat(inputAmount)
          const receivedValuePercent = (realInputValue / smallInputValue) * 100.0
          const impactPercent = 100.0 - receivedValuePercent

          // Recording the results
          this.priceImpactPercent = impactPercent.toFixed(2)
          this.inputAmount = inputAmount.toString()

        },


        async updateOutputEstimation() {
          // Not doing anything if the input amount is zero
          if (0 + this.inputAmount == 0) {
            this.outputAmount = ''
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
          const amountInBn = ethers.utils.parseUnits(this.inputAmount.toString(), decimalsIn)
          const bestResult = await this.findBestRoute(amountInBn, inputToken, outputToken)

          // Parsing the normal output token amount
          const amountOutBn = bestResult["price"]
          const outputAmount = ethers.utils.formatUnits(amountOutBn, decimalsOut)

          // Retrieving output amounts with a much smaller input amount,
          // to compare the resulting amounts and calculate the price impact
          const smallInputAmount = parseFloat(0.0 + this.inputAmount) / 100000.0
          const smallInputAmountBn = ethers.utils.parseUnits(smallInputAmount.toString(), decimalsIn)
          const smallAmountsOut = await routerContract.getAmountsOut(smallInputAmountBn, bestResult["route"])

          // Parsing the output amount with a smaller input amount
          const smallAmountOutBn = smallAmountsOut[smallAmountsOut.length - 1]
          const smallOutputAmount = ethers.utils.formatUnits(smallAmountOutBn, decimalsOut)

          // Calculating the price impact
          const smallOutputValue = parseFloat(smallOutputAmount) / parseFloat(smallInputAmount)
          const realOutputValue = parseFloat(outputAmount) / parseFloat(this.inputAmount)
          const receivedValuePercent = (realOutputValue / smallOutputValue) * 100.0
          const impactPercent = 100.0 - receivedValuePercent

          // Recording the results
          this.priceImpactPercent = impactPercent.toFixed(2)
          this.outputAmount = outputAmount.toString()
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

          // List of possible routes to compare against each other
          const possibleRoutes = [[inputTokenAddress, outputTokenAddress]]
          for (const routingAddress of routingAddresses) {
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

        // Returns the appropriate background color depending on the ecosystem
        getBackgroundStyle() {
          let ecosystemBackgrounds = {
            56: "background: radial-gradient(circle, #6a6a6a45 0%, rgba(253, 187, 45, 0) 100%);",
            1284: "background: radial-gradient(circle, #6e00ff40 0%, rgba(253, 187, 45, 0) 100%);",
            1285: "background: radial-gradient(circle, #007eff40 0%, rgba(253, 187, 45, 0) 100%);"
          }

          let backgroundStyle = "opacity: 80%; width: 100%; height: 100%; position: fixed; left: 0; top: 0;" + ecosystemBackgrounds[this.chainId]
          
          return backgroundStyle
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