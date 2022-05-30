<template>
  <v-container>
    <div class="padswap-header-box">
      <slider-tabs class="padswap-ecosystem-tabs" v-model="ecosystemId">
        <v-tab class="d-flex flex-column">
          <v-img height="30" width="30" contain src="../assets/tokens/bsc/PAD.svg" />
          <div>BSC</div>
        </v-tab>
        <v-tab class="d-flex flex-column">
          <v-img height="30" width="30" contain src="../assets/tokens/moonriver/PAD.svg" />
          <div>Moonriver</div>
        </v-tab>
        <v-tab class="d-flex flex-column">
          <v-img height="30" width="30" contain src="../assets/tokens/moonbeam/PAD.svg" />
          <div>Moonbeam</div>
        </v-tab>
      </slider-tabs>
      <v-subheader class="padswap-ecosystem-subheader">Select ecosystem</v-subheader>
    </div>
    <v-sheet class="launchpad-title-bar">
      <img class="background" :src="$padswapTheme.theme.backgroundTextureSrc">
      <div class="launchpad-title">
        <img class="launchpad-image" :src="$padswapTheme.theme.launchpadRocketSrc">
        <h1 style="margin-bottom: 0">LaunchPAD token factory</h1>
        <v-btn medium color="primary" to="/launchpad" style="margin-top: 10px;">
          Back
        </v-btn>
      </div>
      <div class="launchpad-intro">
        <p class="please-read">
          Use the form below to create your own token.
        </p>
        <p>
          After the token is created, you can use the LaunchPAD to <a href="/launch" target="blank" style="color: #00f000">launch your presale</a>.
        </p>
      </div>
    </v-sheet>
    <v-form ref="form">
      <div class="form-container">
        <div class="screen-glass">
        </div>
        <div class="screen">
          <div class="win98-window">
            <div class="win98-title-bar">
              <div class="win98-title-bar-text">Creating your token</div>
              <div class="win98-title-bar-controls">
                <button v-on:click.prevent class="win98-button" aria-label="Minimize"></button>
                <button v-on:click.prevent class="win98-button" aria-label="Maximize"></button>
                <button v-on:click.prevent class="win98-button" aria-label="Close"></button>
              </div>
            </div>
            <div class="win98-window-body">
              <h1 class="win98-header">LaunchPAD Token Master</h1>
              <v-stepper class="win98-fieldset" v-model="formStep">
                <v-stepper-items>

                  <v-stepper-content step="1">
                    <p class="win98-paragraph">This program will guide you through creating your token.</p>
                    <p class="win98-paragraph">To continue, please select the desired ecosystem.</p>
                    <fieldset class="win98-fieldset">
                      <legend>Select chain</legend>
                      <div class="win98-field-row">
                        <input id="radio1" value="0" v-model="ecosystemId" type="radio" name="chain-select">
                        <label for="radio1">Binance Smart Chain</label>
                      </div>
                      <div class="win98-field-row">
                        <input id="radio2" value="1" v-model="ecosystemId" type="radio" name="chain-select">
                        <label for="radio2">Moonriver</label>
                      </div>
                      <div class="win98-field-row">
                        <input id="radio3" value="2" v-model="ecosystemId" type="radio" name="chain-select">
                        <label for="radio3">Moonbeam</label>
                      </div>
                    </fieldset>

                  </v-stepper-content>

                  <v-stepper-content step="2">
                    <p class="win98-paragraph">
                      Please select the type of token you'd like to create.<br>
                      For now, two types of tokens are supported.
                    </p>

                    <fieldset class="win98-fieldset">
                      <legend>Token type</legend>

                      <div class="win98-field-row">
                        <input
                        id="token-type-1"
                        type="radio"
                        name="token-type-select"
                        value="basic"
                        v-model="tokenType"
                        >
                        <label for="token-type-1">Basic token</label>
                      </div>
                      <ul class="win98-list">
                        <li>Standard tokenomics</li>
                        <li>No transaction fee</li>
                        <li>Capped supply</li>
                      </ul>

                      <template v-if="$store.getters.ecosystem.routeName != 'moonriver'">
                      <div class="win98-field-row">
                        <input
                        id="token-type-2"
                        type="radio"
                        name="token-type-select"
                        value="redistribution"
                        v-model="tokenType"
                      >
                        <label for="token-type-2">Reflection token <span style="font-weight: bold">(experimental)</span></label>
                      </div>
                      <ul class="win98-list">
                        <li>Part of every transaction is redistributed to holders</li>
                        <li>The fee can be adjusted before you create the token</li>
                      </ul>
                    </template>

                    </fieldset>
                  </v-stepper-content>

                  <v-stepper-content step="3">
                    <p class="win98-paragraph">Please enter the details of the token you wish to create.</p>

                    <label for="tokenName" class="win98-label">Token name:</label><br>
                    <input id="tokenName" class="win98-input" v-model="tokenName">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <div
                        v-bind="attrs"
                        v-on="on"
                        class="win98-hint-icon"
                        >
                          ?
                        </div>
                      </template>
                      <span>
                      The full name of your token (e.g. Bitcoin, Ethereum, Lily Pad)
                      </span>
                    </v-tooltip>
                    <br><br>

                    <label for="tokenSymbol" class="win98-label">Token symbol:</label>
                    <br>
                    <input id="tokenSymbol" class="win98-input" v-model="tokenSymbol">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <div
                        v-bind="attrs"
                        v-on="on"
                        class="win98-hint-icon"
                        >
                          ?
                        </div>
                      </template>
                      <span>
                      A short identifier for your token, usually consisting of 3 or 4 capital letters (BTC, ETH, etc.)</span>
                    </v-tooltip>
                    <br><br>

                    <label for="tokenSupply" class="win98-label">Total supply:</label><br>
                    <input id="tokenSupply" class="win98-input" v-model="tokenSupply">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <div
                        v-bind="attrs"
                        v-on="on"
                        class="win98-hint-icon"
                        >
                          ?
                        </div>
                      </template>
                      <span>
                      The total supply of your token. After your token is created, it will be impossible to create more tokens than this.
                    </span>
                    </v-tooltip>
                    <br><br>

                    <label for="tokenDecimals" class="win98-label">Decimals:</label><br>
                    <input id="tokenDecimals" class="win98-input" v-model="tokenDecimals">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <div
                        v-bind="attrs"
                        v-on="on"
                        class="win98-hint-icon"
                        >
                          ?
                        </div>
                      </template>
                      <span>
                        Affects how much your token can be divided into smaller parts. 18 decimals is recommended, unless you have a good reason to use another number.
                      </span>
                    </v-tooltip>
                    <br><br>

                    <!-- TODO: two column design -->
                    <template v-if="tokenType == 'redistribution'">
                      <p style="font-weight: bold; color: #860000;">This token type has been added recently. If you encounter any issues with transaction taxes, contact us at <a href="https://t.me/toadnetwork" target="_blank">t.me/toadnetwork</a>.</p>
                      <label for="transactionFee" class="win98-label">Redistribution Fee (%):</label><br>
                      <input id="transactionFee" class="win98-input" v-model="transactionFee">
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <div
                          v-bind="attrs"
                          v-on="on"
                          class="win98-hint-icon"
                          >
                            ?
                          </div>
                        </template>
                        <span>
                        This percentage of every transaction will be distributed to all holders, proportional to the amount of tokens they hold.
                        </span>
                      </v-tooltip>
                      <br><br>

                      <label for="burnFee" class="win98-label">Burn Fee (%):</label><br>
                      <input id="burnFee" class="win98-input" v-model="burnFee">
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <div
                          v-bind="attrs"
                          v-on="on"
                          class="win98-hint-icon"
                          >
                            ?
                          </div>
                        </template>
                        <span>
                        This percentage of every transaction will be burned.
                        </span>
                      </v-tooltip>
                      <br><br>

                      <label for="liquidityFee" class="win98-label">Liquidity Fee (%):</label><br>
                      <input id="liquidityFee" class="win98-input" v-model="liquidityFee">
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <div
                          v-bind="attrs"
                          v-on="on"
                          class="win98-hint-icon"
                          >
                            ?
                          </div>
                        </template>
                        <span>
                        This percentage of every transaction will be added as liquidity.
                        </span>
                      </v-tooltip>
                      <br><br>

                      <label for="devFee" class="win98-label">Development Fee (%):</label><br>
                      <input id="devFee" class="win98-input" v-model="devFee">
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <div
                          v-bind="attrs"
                          v-on="on"
                          class="win98-hint-icon"
                          >
                            ?
                          </div>
                        </template>
                        <span>
                        This percentage of every transaction will be sent to the token creator's wallet to fund marketing and development.
                        </span>
                      </v-tooltip>
                      <br>
                    </template>

                    <br>
                    <span v-if="formErrors" style="color: red; white-space: pre;">{{ formErrors }}</span>
                  </v-stepper-content>

                  <v-stepper-content step="4">
                    <p class="win98-paragraph">Please review the info below.</p>

                    <label for="tokenName" class="win98-label">Token name:</label><br>
                    <input disabled id="tokenName" class="win98-input" :value="tokenName"><br><br>

                    <label for="tokenSymbol" class="win98-label">Token symbol:</label><br>
                    <input disabled id="tokenSymbol" class="win98-input" :value="tokenSymbol"><br><br>

                    <label for="tokenSupply" class="win98-label">Total supply:</label><br>
                    <input disabled id="tokenSupply" class="win98-input" :value="formatNumberWithCommas(tokenSupply) + ' ' + tokenSymbol"><br><br>

                    <label for="tokenDecimals" class="win98-label">Decimals:</label><br>
                    <input disabled id="tokenDecimals" class="win98-input" :value="tokenDecimals"><br><br>

                    <div v-if="tokenType == 'redistribution'">
                      <label for="transactionFee" class="win98-label">Transaction Fee:</label><br>
                      <input disabled id="transactionFee" class="win98-input" :value="transactionFee + '%'"><br><br>

                      <label for="burnFee" class="win98-label">Burn Fee:</label><br>
                      <input disabled id="burnFee" class="win98-input" :value="burnFee + '%'"><br><br>

                      <label for="liquidityFee" class="win98-label">Liquidity Fee:</label><br>
                      <input disabled id="liquidityFee" class="win98-input" :value="liquidityFee + '%'"><br><br>

                      <label for="devFee" class="win98-label">Development Fee:</label><br>
                      <input disabled id="devFee" class="win98-input" :value="devFee + '%'"><br><br>
                    </div>

                    <p class="win98-paragraph">If the info is correct, press "Continue"</p>
                  </v-stepper-content>

                  <v-stepper-content step="5">
                    <div>
                      <p class="win98-paragraph">
                        Pressing the button below will create your token.<br>
                        <span style="color: green">The fee for creating a token is 1 TOAD. </span>
                        <a
                        style="color: blue; font-weight: bold;"
                        target="_blank"
                        :href="getToadLinks[$store.getters.ecosystem.routeName]">Get TOAD
                        </a>
                      </p>
                      <button
                        class="win98-button"
                        v-on:click.prevent
                        @click="isFeeApproved ? submit() : approve()"
                        :disabled="tokenCreated"
                      >
                        <template v-if="isFeeApproved">
                          Create {{ tokenSymbol }} token
                        </template>
                        <template v-else>
                          Approve TOAD
                        </template>
                      </button>
                      <br><br>
                      <p class="win98-paragraph">This usually takes a few minutes.</p>
                      <br><br>
                      <p class="win98-paragraph">After the token is created, your token's contract address will appear here.</p>
                      <input style="width: calc(100% - 50px)" class="win98-input" v-model="tokenContractAddress" readonly>
                      <v-tooltip
                      :open-on-hover="false"
                      right
                      >
                        <template #activator="{ on, attrs }">
                          <v-btn
                          class="win98-button"
                          style="min-width: 10px !important; height: 20px;"
                          @click="on.click"
                          v-on:click="copyText(tokenContractAddress)"
                          icon
                          retain-focus-on-click
                          v-bind="attrs"
                          v-on="on"
                          :disabled="!tokenContractAddress"
                          >
                          <v-icon small color="#585555">mdi-clipboard-multiple</v-icon>
                          </v-btn>
                        </template>
                        <span>Copied!</span>
                      </v-tooltip>

                      <p v-if="tokenCreated" class="win98-paragraph" style="margin-top: 20px;">
                        Success!<br>
                        Your token was created and the {{ tokenSymbol }} tokens have been sent to your wallet.<br>
                        You can now use the LaunchPAD to launch your presale.<br>
                        <a style="color: blue" href="/launch" target="_blank">Launch presale</a>
                      </p>
                    </div>
                  </v-stepper-content>

                </v-stepper-items>
              </v-stepper>
              <div style="display: block; text-align: right; padding: 20px;">
                <button
                v-if="formStep > 1 && !(tokenCreated && formStep == 4)" 
                style="margin-right: 10px;"
                class="win98-button"
                color="primary"
                v-on:click.prevent
                @click="advanceForm(-1)">
                  Back
                </button>
                <button
                v-if="formStep < 5"
                class="win98-button"
                v-on:click.prevent
                @click="advanceForm(1)"
                :disabled="!canContinue"
                >
                  Continue
                </button>
              </div>
              <div class="form-content">
                <div style="text-align: right; margin: 20px;">
                </div>
              </div>
            </div>
            <div class="win98-status-bar">
              <p class="win98-status-bar-field">Network: {{ $store.getters.ecosystem.routeName }}</p>
              <p class="win98-status-bar-field">Token type: {{ tokenType }}</p>
            </div>
          </div>
        </div>
      </div>
    </v-form>
  </v-container>
</template>
<script lang="ts">
import SliderTabs from '@/components/SliderTabs.vue'
import { EcosystemId } from '@/ecosystem'

import Vue from 'vue'
import { mapActions } from 'vuex'
import AwaitLock from 'await-lock'
import { ethers } from 'ethers'

import {
  LAUNCHPAD_TOKEN_FACTORY_ABI,
  LAUNCHPAD_TOKEN_DEPLOYER_ABI,
  ERC20_ABI,
  APPROVE_AMOUNT,
} from '@/constants'
import { ChainId, TokenModel, IEcosystem } from '@/ecosystem'
import { delay } from '@/utils'

// These token symbols will not be allowed
const symbolBlacklist = ['TOAD', 'PAD', 'USDC', 'USDT', 'DAI', 'BNB', 'BUSD', 'ETH', 'BTC', 'GLMR', 'MOVR', 'XRP', 'XMR', 'DOT', 'ADA', 'SOLAR']

function countDecimals(n: number) {
  const nString = n.toString()
  if (!nString.includes('.')) {
    return 0
  } else {
    return nString.split('.')[1].length
  }
}

export default Vue.extend({
  components: { SliderTabs },
  data: () => ({
    active: true,

    getToadLinks: {
    "bsc": "/bsc/swap?outputCurrency=0x463e737d8f740395abf44f7aac2d9531d8d539e9",
    "moonriver": "/moonriver/swap?outputCurrency=0x165DBb08de0476271714952C3C1F068693bd60D7",
    "moonbeam": "/moonbeam/swap?outputCurrency=0xF480f38C366dAaC4305dC484b2Ad7a496FF00CeA"
    },

    // These are used to make the form work, not used anywhere else
    formStep: 1,
    maxFormStep: 5,

    // Filled in the form
    tokenName: '',
    tokenSymbol: '',
    tokenSupply: '',
    tokenDecimals: '18',
    tokenType: <"basic" | "reflection" | ''> '',

    // Only relevant if tokenType is "reflection"
    transactionFee: '2',
    burnFee: '0',
    liquidityFee: '0',
    devFee: '0',

    // Created token address
    tokenContractAddress: '',

    tokenCreated: false, // Set to true when the token has been created

    syncLock: new AwaitLock(),
    feeTokenAllowance: <ethers.BigNumber | null> null
  }),
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
    canContinue(): boolean {
      if (this.formStep == 2) {
        return this.tokenType != ''
      } else if (this.formStep == 3) {
        return this.formErrors === false
      }
      return true
    },
    formErrors(): string | false {
      var errors = ''

      if (!this.tokenName) { errors += 'Token name is required\n' }
      else if (this.tokenName.length > 20) { errors += 'Token name cannot be longer than 20 characters\n' }

      if (!this.tokenSymbol) { errors += 'Token symbol is required\n' }
      else if (this.tokenSymbol.length > 8) { errors += 'Token symbol cannot be longer than 8 characters\n' }
      else if (this.tokenSymbol != this.tokenSymbol.toUpperCase()) { errors += 'Token symbol must consist of uppercase characters\n' }
      else if (symbolBlacklist.includes(this.tokenSymbol) ) { errors += 'Please don\'t create tokens that falsely represent other projects\n' }

      if (!this.tokenSupply) { errors += 'Choose the max supply of your token\n' }
      else if (parseFloat(this.tokenSupply) > 1000000000000) { errors += 'Token supply too high\n' }
      else if (parseFloat(this.tokenSupply) < 10) { errors += 'Token supply too low\n' }
      else if (parseFloat(this.tokenSupply) % 1 != 0 || !(/^\d+$/.test(this.tokenSupply)) ) { errors += 'Token supply must be a whole number\n' }

      if (!this.tokenDecimals) { errors += 'Choose the number of decimals of your token\n' }
      else if (parseFloat(this.tokenDecimals) < 0 || parseFloat(this.tokenDecimals) > 255 ) { errors += 'Choose a number between 0 and 255\n' }
      else if (parseFloat(this.tokenDecimals) % 1 != 0 || !(/^\d+$/.test(this.tokenDecimals)) ) { errors += 'Token decimals must be a whole number\n' }

      if (this.tokenType == "reflection") {
        const transactionFeeStatus = this.getFeeValidationStatus(this.transactionFee, 'transaction')
        if (transactionFeeStatus) {
          errors += transactionFeeStatus
        }

        const burnFeeStatus = this.getFeeValidationStatus(this.burnFee, 'burn')
        if (burnFeeStatus) {
          errors += burnFeeStatus
        }

        const liquidityFeeStatus = this.getFeeValidationStatus(this.liquidityFee, 'liquidity')
        if (liquidityFeeStatus) {
          errors += liquidityFeeStatus
        }

        const developmentFeeStatus = this.getFeeValidationStatus(this.devFee, 'development')
        if (developmentFeeStatus) {
          errors += developmentFeeStatus
        }

        if (this.totalReflectionFees > 30) {
          errors += 'Total fees cannot be greater than 30%\n'
        }

        if (this.totalReflectionFees == 0) {
          errors += 'Total fees must be greater than 0.'
        }
      }

      if (errors.length == 0) {
        return false
      }
      return errors
    },
    tokenModel(): TokenModel {
      if (this.tokenType == "reflection") {
        return TokenModel.Reflections
      } else {
        return TokenModel.Standard
      }
    },
    tokenModelContractAddress(): string | undefined {
      return this.ecosystem.launchPadTokenFactoryModels[this.tokenModel]
    },
    tokenFactoryContract(): ethers.Contract | null {
      if (!this.ecosystem.launchPadTokenFactoryAddress) {
        return null
      }

      return new ethers.Contract(
        this.ecosystem.launchPadTokenFactoryAddress,
        LAUNCHPAD_TOKEN_FACTORY_ABI,
        this.ecosystem.dataseed
      )
    },
    // approval state for TOAD creation fee
    isFeeApproved(): boolean {
      // TODO: read creationFee from contract
      return this.feeTokenAllowance !== null && this.feeTokenAllowance.gt(1e18.toString())
    },
    totalReflectionFees(): number {
      return (parseFloat(this.transactionFee) || 0) +
        (parseFloat(this.burnFee) || 0) +
        (parseFloat(this.liquidityFee) || 0) +
        (parseFloat(this.devFee) || 0)
    }
  },
  async mounted() {
    while (true) {
      try {
        this.sync()
      } catch (e) {
        console.error(e)
      }

      await delay(5000)
    }
  },
  beforeRouteLeave(to, from, next) {
    this.active = false
    next()
  },
  beforeDestroy() {
    this.active = false
  },
  methods: {
    copyText (text : string) {
      let textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.top = "0"
      textArea.style.left = "0"
      textArea.style.position = "fixed"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      let successful = document.execCommand('copy')

      document.body.removeChild(textArea)
    },
    formatNumberWithCommas(nbr : any) {
      if (!nbr) {
        return '0.0'
      }
      return nbr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    advanceForm(delta : number) {
      this.formStep += delta
      if (this.formStep < 1) 
        this.formStep = 1
      if (this.formStep > this.maxFormStep)
        this.formStep = this.maxFormStep
    },
    async approve() {
      if (!this.web3) {
        await this.requestConnect()
        return
      }

      const feeTokenContract = await this.getFeeTokenContract()
      const tx = await feeTokenContract.populateTransaction.approve(this.ecosystem.launchPadTokenFactoryAddress, APPROVE_AMOUNT)
      await this.safeSendTransaction({ tx, targetChainId: this.chainId })
      await this.sync()
    },
    getTokenModelArguments(tokenModel: TokenModel) {
      if (tokenModel == TokenModel.Standard) {
        return ethers.utils.defaultAbiCoder.encode(
          ['string', 'string', 'uint8', 'uint256'],
          [
            this.tokenName,
            this.tokenSymbol,
            parseInt(this.tokenDecimals),
            ethers.BigNumber.from(this.tokenSupply)
          ]
        )
      } else if (tokenModel == TokenModel.Reflections) {
        return ethers.utils.defaultAbiCoder.encode(
          ['string', 'string', 'uint8', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256'],
          [
            this.tokenName,
            this.tokenSymbol,
            parseInt(this.tokenDecimals),
            ethers.BigNumber.from(this.tokenSupply),
            Number(this.transactionFee) * 10,
            Number(this.liquidityFee) * 10,
            Number(this.burnFee) * 10,
            Number(this.devFee) * 10
          ]
        )
      }

      throw new Error()
    },
    async submit() {
      if (!this.web3) {
        await this.requestConnect()
        return
      }

      const tokenFactoryContract = this.tokenFactoryContract!.connect(this.web3)
      const tokenDeployerContract = new ethers.Contract(this.tokenModelContractAddress!, LAUNCHPAD_TOKEN_DEPLOYER_ABI)

      const args = this.getTokenModelArguments(this.tokenModel)
      const tx = await tokenFactoryContract.populateTransaction.createToken(this.tokenModelContractAddress, args)
      const txReceipt: ethers.providers.TransactionReceipt | false = await this.safeSendTransaction({ tx, targetChainId: this.chainId })
      if (txReceipt) {
        for (const log of txReceipt.logs) {
          try {
            const logDesc = tokenDeployerContract.interface.parseLog(log)
            if (logDesc.name == 'CreateToken') {
              this.tokenContractAddress = logDesc.args.tokenAddress
              this.tokenCreated = true
            }
          } catch {
          }
        }
      }
    },
    async getFeeTokenContract() {
      const feeToken = await this.tokenFactoryContract!.feeToken()
      return new ethers.Contract(feeToken, ERC20_ABI, this.ecosystem.dataseed)
    },
    async sync() {
      if (!this.tokenFactoryContract || !this.address) {
        return
      }

      await this.syncLock.acquireAsync()
      try {
        const tokenFactoryContract = this.tokenFactoryContract
        const address = this.address
        const feeTokenContract = await this.getFeeTokenContract()
        const allowance = await feeTokenContract.allowance(address, tokenFactoryContract.address)
        if (tokenFactoryContract === this.tokenFactoryContract && address === this.address) {
          this.feeTokenAllowance = allowance
        }
      } finally {
        this.syncLock.release()
      }
    },
    getFeeValidationStatus(fee: string, feeName: string): false | string {
      if (fee === '') {
        return `Specify a ${feeName} fee\n`
      }

      const feeNumber = Number(fee)
      if (isNaN(feeNumber)) {
        return `The ${feeName} fee is not a valid number\n`
      }
      if (feeNumber < 0) {
        return `The ${feeName} fee cannot be negative\n`
      }
      if (countDecimals(feeNumber) > 1) {
        return `The ${feeName} fee cannot have more than 1 decimal places\n`
      }

      return false
    },
    ...mapActions(['requestConnect', 'safeSendTransaction'])
  },
  watch: {
    tokenFactoryContract() {
      this.feeTokenAllowance = null
      setTimeout(() => this.sync())
    },
    address() {
      this.feeTokenAllowance = null
      setTimeout(() => this.sync())
    }
  }
})
</script>
<style src="../styles/win98.css" />
<style scoped>
.background {
  pointer-events: none;
  position: absolute;
  min-width: 100%;
  min-height: 100%;
  left: 0;
  top: 0;
  z-index: -1;
  opacity: 0.06;
}

/********************/
/* Ecosystem slider */
/********************/

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
  min-width: 120px;
}
.padswap-ecosystem-tabs .v-tab--active {
  color: #66015e !important;
}

.padswap-header-box {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Title bar */
.launchpad-title-bar {
  z-index: 1;
  position: relative;
  overflow: hidden;
  text-align: center;
  padding: 50px;
  background: rgba(24, 29, 38, 0.7) !important;
  border-radius: 20px;
  margin-bottom: 30px;
}
.launchpad-title-bar h1 {
  margin-bottom: 25px;
}

.launchpad-title-bar-section {
  text-align: center;
  font-size: 0.7rem;
}

.launchpad-title-bar-section {
  text-align: center;
  padding: 20px;
}

.launch-token-btn {
  margin-top: 20px;
}

/* Title */
.launchpad-title {
  width: 100%;
}
.launchpad-title img {
  max-width: 100px;
}
.launchpad-title h1 {
  color: white;
  text-shadow: #000 2px 2px 2px;
  -webkit-font-smoothing: antialiased;
}

/********/
/* FAQ */
/********/

.launchpad-intro {
  margin-top: 25px;
}

.v-expansion-panels {
  background: none !important;
  border: none !important;
}

.v-expansion-panel {
  background-color: #00000085 !important;
}

.v-expansion-panel-header:hover {
  background-color: #d2f3f21a !important;
}

.launchpad-faq {
  border-radius: 20px;
  overflow: hidden;
  text-align: left;
}

.launchpad-faq h1 {
  background-color: #80808012;
  padding: 10px;
  border-radius: 10px;
  margin-top: 15px;
  font-size: 1rem;
}

.launchpad-faq h1, .launchpad-faq p {
  margin-left: 20px;
  margin-right: 20px;
}

.perks-list li {
  margin-top: 10px;
}


/********/
/* Form */
/********/

.form-container {
  position: relative;
  background: linear-gradient(40deg, #5a5a5a 0%, #8e8e8e 100%);
  padding: 20px;
  border-radius: 20px;
  border-top: 5px solid #6e6e6e;
  border-bottom: 5px solid #232323;
  border-left: 5px solid #3c3a3a;
  border-right: 5px solid #3b3a3a;
  min-height: 40vw;
}

.screen {
  border-radius: 5px;
  border-top: 5px solid #232323;
  border-bottom: 5px solid #6e6e6e;
  border-left: 5px solid #3b3a3a;
  border-right: 5px solid #3c3a3a;
  padding: 10px;
  background-color: #00807F;
  min-height: 40vw;
}

.screen-glass {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  border-radius: 5px;
  border-top: 5px solid #232323;
  border-bottom: 5px solid #6e6e6e;
  border-left: 5px solid #3b3a3a;
  border-right: 5px solid #3c3a3a;
  padding: 10px;
  background-image: radial-gradient(circle farthest-side at 50% -5%,rgb(200 200 200 / 54%),#00000045 78%);
}

.token-settings {
  padding-right: 10px;
}

.presale-settings {
  padding-left: 10px;
}

.form-line {
  display: block !important;
  margin-top: 10px;
  margin-bottom: 10px;
}

.presale-contract-address {
  margin-bottom: 15px;
}

.address-box {
  display: inline-block;
  border: 1px solid green;
  padding-left: 10px;
  border-radius: 10px;
}

/* Referrals checkbox */

.checkbox-container {
  display: inline-block;
}

.referrals-hint {
  display: inline-block;
  border: 1px solid gray;
  border-radius: 50%;
  padding: 1px;
  width: 25px;
  text-align: center;
}

/*****************/
/* Launch button */
/*****************/

.launch-button-container {
  display: block;
  width: 100vw;
  text-align: center;
}

.launch-button-box {
  display: inline-block;
  background: radial-gradient(ellipse at center,  #333333 0%,#333333 88%,#000000 100%);  
  padding: 50px;
  border-radius: 10px;
  border-top: 5px solid #6e6e6e;
  border-bottom: 5px solid #232323;
  border-left: 5px solid #3c3a3a;
  border-right: 5px solid #3b3a3a;

}

.launch-button {
  position: relative;
  background: #00ec07;
  background: -webkit-radial-gradient( hsl(122deg 100% 44%), hsl(122deg 100% 20%) );
  background: -o-radial-gradient( hsl(122deg 100% 44%), hsl(122deg 100% 20%) );
  background: -moz-radial-gradient( hsl(122deg 100% 44%), hsl(122deg 100% 20%) );
  background: radial-gradient( hsl(122deg 100% 44%), hsl(122deg 100% 20%) );
  font-size: 2rem;
  text-shadow: 0 -1px 0 #000000;
  color: #3b5441;
  border: solid 1px #096706;
  border-radius: 100%;
  height: 160px;
  width: 160px;
  z-index: 4;
  outline: none;
  box-shadow: inset 0 1px 0 hsl(120deg 100% 50%), 0 2px 0 hsl(121deg 100% 20%), 0 3px 0 hsl(127deg 100% 18%), 0 4px 0 hsl(132deg 100% 16%), 0 5px 0 hsl(125deg 100% 14%), 0 6px 0 hsl(132deg 100% 12%), 0 7px 0 hsl(109deg 100% 10%), 0 8px 0 hsl(118deg 100% 8%), 0 9px 0 hsl(122deg 100% 6%);
}
.launch-button:hover {
  background: -webkit-radial-gradient( hsl(128deg 100% 45%), #b38c00 );
  background: -o-radial-gradient( hsl(128deg 100% 45%), #b38c00 );
  background: -moz-radial-gradient( hsl(128deg 100% 45%), #b38c00 );
  background: radial-gradient( hsl(128deg 100% 45%), #b38c00 );
}
.launch-button:active {
  background: webkit-radial-gradient( hsl(54, 100%, 43%), hsl(54, 100%, 33%) );
  background: -o-radial-gradient( hsl(54, 100%, 43%), hsl(54, 100%, 33%) );
  background: -moz-radial-gradient( hsl(54, 100%, 43%), hsl(54, 100%, 33%) );
  background: radial-gradient( hsl(54, 100%, 43%), hsl(54, 100%, 33%) );
  top: 2px;
  box-shadow: inset 0 1px 0 hsl(0deg 100% 50%), 0 2px 0 hsl(0deg 100% 20%), 0 3px 0 hsl(0deg 100% 18%), 0 4px 0 hsl(0deg 100% 16%), 0 5px 0 hsl(0deg 100% 14%), 0 6px 0 hsl(0deg 100% 12%), 0 7px 0 hsl(0deg 100% 10%), 0 8px 0 hsl(0deg 100% 8%), 0 9px 0 hsl(0deg 100% 6%)
}

.launch-button:disabled {
  background: #818181;
  background: -webkit-radial-gradient( hsl(0deg 0% 49%), hsl(0deg 0% 29%) );
  background: -o-radial-gradient( hsl(0deg 0% 49%), hsl(0deg 0% 29%) );
  background: -moz-radial-gradient( hsl(0deg 0% 49%), hsl(0deg 0% 29%) );
  background: radial-gradient( hsl(0deg 0% 49%), hsl(0deg 0% 29%) );
  font-size: 2rem;
  text-shadow: 0 -1px 0 #000000;
  color: #575757;
  border: solid 1px #4e4e4e;
  border-radius: 100%;
  height: 160px;
  width: 160px;
  z-index: 4;
  outline: none;
  box-shadow: inset 0 1px 0 hsl(0deg 0% 29%), 0 2px 0 hsl(0deg 0% 31%), 0 3px 0 hsl(0deg 0% 34%), 0 4px 0 hsl(0deg 0% 27%), 0 5px 0 hsl(0deg 0% 36%), 0 6px 0 hsl(0deg 0% 29%), 0 7px 0 hsl(0deg 0% 19%), 0 8px 0 hsl(0deg 0% 32%), 0 9px 0 hsl(0deg 0% 23%);
}

</style>