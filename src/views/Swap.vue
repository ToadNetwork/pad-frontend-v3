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

    <v-card
    color="#00913340"
    style="display: inline-block; padding: 20px;"
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
          :label="'Amount to spend ' + '(max: ' + inputTokenBalance + ' ' + inputToken.symbol + ')'">

          </v-text-field>
        </v-card-actions>

      </v-card>

      <br>

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
          disabled
          readonly
          label="Amount to receive">

          </v-text-field>
        </v-card-actions>
      </v-card>

      <br>

      <v-btn
      block
      color="green"
      @click="swap()">
        SWAP
      </v-btn>
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
    SWAP_ROUTER_ABI
} from '@/constants'

import {
    WHITELIST,
    DEFAULT_SWAP_ROUTES
} from '@/config/swap_token_whitelist'

import { ChainId } from '@/ecosystem'

import TokenSelector from '@/components/swap/TokenSelector.vue'

const routerAddresses = {
  56: '0x76437234D29f84D9A12820A137c6c6A719138C24', // BNB
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
            inputToken: <object> {},
            outputToken: <object> {},

            inputTokenBalance: <number> 0,

            inputAmount: <string> '',
            outputAmount: <string> '',

            exactToken: '',

            tokenWhitelist: <array> [],

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
    },
    watch: {
        inputToken() {
            this.updateTokenBalances()
        },
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

        async updateInputToken(newInputToken) {
          if (newInputToken.address == this.outputToken.address) {
            this.outputToken = this.inputToken
          }
          this.inputToken = newInputToken
        },

        async updateOutputToken(newOutputToken) {
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
            const ethBalanceBn = await this.multicall.getBalance(this.userAddress)
            const ethBalance = ethers.utils.formatEther(ethBalanceBn)
            this.inputTokenBalance = ethBalance
          }
          else {
            var tokenContract = new ethers.Contract(this.inputToken.address, ERC20_ABI, this.multicall)

            var tokenBalanceBn = await tokenContract.balanceOf(this.userAddress)
            var decimals = await tokenContract.decimals()
            var tokenBalance = ethers.utils.formatUnits(tokenBalanceBn, decimals)
            this.inputTokenBalance = tokenBalance
          }
        },


        async updateOutputEstimation() {

        },

        swap() {
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

        async swapTokensForTokens() {
            const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)

            console.log(routerContract)

            const amountInBn = ethers.utils.parseEther(this.inputAmount)
            const minimumAmountOutBn = ethers.utils.parseEther('0')

            const tx = await routerContract.populateTransaction.swapExactTokensForTokens(amountInBn, minimumAmountOutBn, [this.inputToken.address, this.outputToken.address], this.userAddress, Date.now() + 1000 * 60 * 10)

            const txReceipt: ethers.providers.TransactionReceipt | false = await this.safeSendTransaction({ tx, targetChainId: this.chainId })
        },

        async swapTokensForEth() {
            const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)

            console.log(routerContract)

            const weth = await routerContract.WETH()
            console.log(weth)

            const amountInBn = ethers.utils.parseEther(this.inputAmount)
            const minimumAmountOutBn = ethers.utils.parseEther('0')

            const tx = await routerContract.populateTransaction.swapExactTokensForETH(amountInBn, minimumAmountOutBn, [this.inputToken.address, weth], this.userAddress, Date.now() + 1000 * 60 * 10)

            const txReceipt: ethers.providers.TransactionReceipt | false = await this.safeSendTransaction({ tx, targetChainId: this.chainId })
        },

        async swapEthForTokens() {
            const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)

            console.log(routerContract)

            const weth = await routerContract.WETH()
            console.log(weth)

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