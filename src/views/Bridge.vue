<template>
<div>
  <v-snackbar
    v-model="snackbar"
    top
    right
  >
    {{ errorMsg }}
    <template v-slot:action="{ attrs }">
      <v-btn
        color="pink"
        text
        v-bind="attrs"
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <v-container style="max-width: 600px">
    <v-dialog
      v-model="showOperationDialog"
      :persistent="operationInProgress"
      width="500">
      <template v-slot:activator="{}">
        <v-card elevation="2" class="bridge-panel">
          <v-card-text class="px-5">
            <v-form>
              <v-dialog
                v-model="showNetworkDialog"
                width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-sheet class="d-flex justify-center px-3">
                    <v-hover
                      v-slot="{ hover }">
                      <v-card
                        v-on="on"
                        v-bind="attrs"
                        @click="networkSlot = 'sourceNetwork'"
                        tabindex=""
                        :class="{ 'on-hover': hover }"
                        class="px-7 pt-5 justify-center flex-grow-1 network-card"
                        style="border:none !important">
                        <v-sheet
                          class="d-flex justify-center"
                          style="background-color: rgba(0, 0, 0, 0);">
                          <img class="network-icon" :src="sourceNetwork.iconSrc" />
                        </v-sheet>
                        <v-card-subtitle class="d-flex justify-center pb-0">
                          From
                        </v-card-subtitle>
                        <v-card-title class="d-flex justify-center pt-1">
                          <div class="network-name">{{ sourceNetwork.title }}</div>
                        </v-card-title>
                      </v-card>
                    </v-hover>
                    <v-sheet class="d-flex align-center justify-center mx-3 network-arrow">
                      <v-icon>mdi-arrow-right</v-icon>
                    </v-sheet>
                    <v-hover
                      v-slot="{ hover }">
                      <v-card
                        v-on="on"
                        v-bind="attrs"
                        @click="networkSlot = 'destNetwork'"
                        tabindex=""
                        :class="{ 'on-hover': hover }"
                        class="px-7 pt-5 justify-center flex-grow-1 network-card"
                        style="border:none !important">
                        <v-sheet
                          class="d-flex justify-center"
                          style="background-color: rgba(0, 0, 0, 0);">
                          <img class="network-icon" :src="destNetwork.iconSrc" />
                        </v-sheet>
                        <v-card-subtitle class="d-flex justify-center pb-0">
                          To
                        </v-card-subtitle>
                        <v-card-title class="d-flex justify-center pt-1 network-name">
                          <div class="network-name">{{ destNetwork.title }}</div>
                        </v-card-title>
                      </v-card>
                    </v-hover>
                  </v-sheet>
                </template>

                <v-card class="mt-0">
                  <v-card-title>
                    Select Network
                  </v-card-title>
                  <v-card-text>
                  <v-list>
                    <v-list-item-group>
                      <v-list-item
                        v-for="(network, i) in bridgeNetworks"
                        :key="i"
                        @click="selectBridgeNetwork(network)">
                        <v-list-item-icon>
                          <img class="coin-icon" :src="network.iconSrc" />
                        </v-list-item-icon>
                        <v-list-item-content>
                          {{ network.title }}
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                  </v-card-text>
                </v-card>
              </v-dialog>
              <v-sheet class="py-4 px-3 mt-3">
                <v-row>
                  <v-col cols="12" sm="3">
                    <v-select
                      :items="currentChainTokens"
                      v-model="selectedToken"
                      append-icon=""
                      messages="Select token"
                      filled
                      outlined>
                      <template v-slot:item="{ item }">
                        <div class="d-flex align-center">
                          <v-img
                            class="coin-icon"
                            :src="item.iconSrc"
                            contain
                          />
                          {{ item.symbol }}
                        </div>
                      </template>
                      <template v-slot:selection="{ item }">
                        <div class="d-flex align-center">
                          <v-img
                            class="coin-icon"
                            :src="item.iconSrc"
                            contain
                          />
                          {{ item.symbol }}
                        </div>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" sm="9">
                    <v-text-field
                      v-model="bridgeAmount"
                      filled
                      outlined
                      clearable
                      :messages="balanceMessage"
                      placeholder="0.0"
                      type="number"
                      min="0.0">
                      <template v-slot:prepend-inner>
                        <v-btn
                          v-show="tokenBalance !== null"
                          x-small
                          @click="setMaxTokens">
                          Max
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-n3">
                  <v-col cols="12">
                    <v-btn
                      v-if="!web3"
                      @click="$store.dispatch('requestConnect')"
                      x-large
                      :ripple="true"
                      color="primary"
                      width="100%"
                      class="my-3">
                      Connect Wallet
                    </v-btn>
                    <v-btn
                      v-else-if="needsApproval"
                      @click="approve"
                      x-large
                      :ripple="true"
                      color="primary"
                      width="100%"
                      class="my-3">
                      Approve {{ currentSymbol }}
                    </v-btn>
                    <v-btn
                      v-else
                      @click="startBridgeOperation"
                      :disabled="bridgeAmount <= 0 || validationStatus !== null"
                      x-large
                      :ripple="true"
                      color="primary"
                      width="100%"
                      class="my-3">
                      Bridge {{ currentSymbol }}
                    </v-btn>
                    <v-alert
                      :value="validationStatus !== null"
                      dense
                      text
                      type="error"
                      style="text-align: center">
                      {{ validationStatus }}
                    </v-alert>
                  </v-col>
                </v-row>
              </v-sheet>
              <v-card class="mt-0">
                <v-card-text>
                  Minimum Bridge Amount: {{ displayedAnyswapLimits.MinimumSwap | formatNumber }} {{ currentSymbol }}<br />
                  Maximum Bridge Amount: {{ displayedAnyswapLimits.MaximumSwap | formatNumber }} {{ currentSymbol }}<br />
                  Fee: {{ displayedAnyswapLimits.SwapFeeRate | formatPercent }}<br />
                  Minimum Fee: {{ displayedAnyswapLimits.MinimumSwapFee | formatNumber }} {{ currentSymbol }}<br />
                  Amounts greater than {{ displayedAnyswapLimits.BigValueThreshold | formatNumber }} {{ currentSymbol }} could take up to 12 hours
                </v-card-text>
              </v-card>
            </v-form>
          </v-card-text>
          <v-card-subtitle class="d-flex justify-center">
            Powered by Anyswap Network
          </v-card-subtitle>
          <v-overlay
            :absolute="true"
            :value="isLoading">
            <v-progress-circular
              indeterminate
              size="64" />
          </v-overlay>
        </v-card>
      </template>
      <v-card class="mt-0">
        <v-app-bar flat extension-height="68">
          <template v-slot:extension>
            <v-card-subtitle class="pl-7 pt-0">
              Transactions may take 8-20 minutes depending on network conditions
            </v-card-subtitle>
          </template>
          <v-toolbar-title>
            <v-icon>mdi-circle-small</v-icon>
            Swap {{ sourceNetwork.title }} <v-icon>mdi-arrow-right</v-icon> {{ destNetwork.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="operationInProgress"
            @click="showOperationDialog = false"
            icon>
            <v-icon>mdi-close-box</v-icon>
          </v-btn>
        </v-app-bar>
        <v-timeline dense>
          <v-timeline-item
            v-for="(step, i) in operationSteps"
            :key="i"
            color="none"
            small>
            <template v-slot:icon>
              <v-icon
                v-if="step.isComplete"
                color="primary">
                mdi-checkbox-marked-circle
              </v-icon>
              <v-progress-circular
                v-else
                indeterminate />
            </template>
            {{ step.description }}
            <v-subheader
              v-if="step.href"
              class="px-2 my-1"
              style="height: auto;">
              <a :href="step.href" target="_blank">View on explorer</a>
            </v-subheader>
          </v-timeline-item>
        </v-timeline>
      </v-card>
    </v-dialog>
  </v-container>
</div>
</template>
<script lang="ts">
import Vue from 'vue'
import { ethers } from 'ethers'

import { AnyswapV5ERC20ABI, AnyswapV4RouterABI } from '@/anyswap_config.json'
import { ERC20_ABI, FARM_REQUIRED_ALLOWANCE, APPROVE_AMOUNT } from '@/constants'
import { EcosystemId, ECOSYSTEMS, ChainId } from '@/ecosystem'

type BridgeToken = {
  symbol: string,
  isEther: boolean,
  src: {
    address: string | null,
    chainId: ChainId
  },
  dst: {
    address: string,
    chainId: ChainId
  },
  anyswapId: string,
  anyswapVersion: 'v2' | 'v3'
  iconSrc: string
}

type Network = {
  title: string,
  chainId: ChainId,
  iconSrc: string,
  explorer: string,
  dataseed: ethers.providers.Provider
}

type SwapType = 'DEPOSIT' | 'WITHDRAW'

type OperationStep = {
  isComplete: boolean,
  description: string,
  href?: string
}

const bridgeTokens: BridgeToken[] = [{
// moonriver
  symbol: 'TOAD',
  isEther: false,
  src: {
    address: '0x463e737d8f740395abf44f7aac2d9531d8d539e9',
    chainId: 56
  },
  dst: {
    address: '0x165DBb08de0476271714952C3C1F068693bd60D7',
    chainId: 1285
  },
  anyswapId: 'toadv5',
  anyswapVersion: 'v2',
  iconSrc: require('@/assets/tokens/bsc/TOAD.svg')
},
{
  symbol: 'BUSD',
  isEther: false,
  src: {
    address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    chainId: 56
  },
  dst: {
    address: '0x5d9ab5522c64e1f6ef5e3627eccc093f56167818',
    chainId: 1285
  },
  anyswapId: 'busdv5',
  anyswapVersion: 'v2',
  iconSrc: require('@/assets/tokens/bsc/BUSD.svg')
},
{
  symbol: 'BNB',
  isEther: true,
  src: {
    address: null,
    chainId: 56
  },
  dst: {
    address: '0x2bf9b864cdc97b08b6d79ad4663e71b8ab65c45c',
    chainId: 1285
  },
  anyswapId: 'bnbv5',
  anyswapVersion: 'v2',
  iconSrc: require('@/assets/tokens/bsc/BNB.svg')
},
// moonbeam
{
  symbol: 'TOAD',
  isEther: false,
  src: {
    address: '0x463e737d8f740395abf44f7aac2d9531d8d539e9',
    chainId: 56
  },
  dst: {
    address: '0xF480f38C366dAaC4305dC484b2Ad7a496FF00CeA',
    chainId: 1284
  },
  anyswapId: '',
  anyswapVersion: 'v3',
  iconSrc: require('@/assets/tokens/bsc/TOAD.svg')
},
{
  symbol: 'BUSD',
  isEther: false,
  src: {
    address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    chainId: 56
  },
  dst: {
    address: '0xa649325aa7c5093d12d6f98eb4378deae68ce23f',
    chainId: 1284
  },
  anyswapId: 'busdv5',
  anyswapVersion: 'v2',
  iconSrc: require('@/assets/tokens/bsc/BUSD.svg')
},
{
  symbol: 'BNB',
  isEther: true,
  src: {
    address: null,
    chainId: 56
  },
  dst: {
    address: '0xc9baa8cfdde8e328787e29b4b078abf2dadc2055',
    chainId: 1284
  },
  anyswapId: 'bnbv5',
  anyswapVersion: 'v2',
  iconSrc: require('@/assets/tokens/bsc/BNB.svg')
},]

const bscEcosystem = ECOSYSTEMS[EcosystemId.BSC]
const moonriverEcosystem = ECOSYSTEMS[EcosystemId.Moonriver]
const moonbeamEcosystem = ECOSYSTEMS[EcosystemId.Moonbeam]

const bridgeNetworks: Network[] = [{
  title: 'BSC',
  chainId: bscEcosystem.chainId,
  iconSrc: require('@/assets/tokens/bsc/BNB.svg'),
  explorer: 'https://bscscan.com',
  dataseed: bscEcosystem.dataseed
},
{
  title: 'Moonriver',
  chainId: moonriverEcosystem.chainId,
  iconSrc: require('@/assets/tokens/moonriver/MOVR.png'),
  explorer: 'https://moonriver.moonscan.io',
  dataseed: moonriverEcosystem.dataseed
},
{
  title: 'Moonbeam',
  chainId: moonbeamEcosystem.chainId,
  iconSrc: require('@/assets/tokens/moonbeam/GLMR.png'),
  explorer: 'https://blockscout.moonbeam.network',
  dataseed: moonbeamEcosystem.dataseed
}]

async function delay(ms: number) {
  await new Promise(res => setTimeout(res, ms))
}

function toWei(number: string | number | null, decimals: number) {
  if (!number) {
    return ethers.BigNumber.from(0)
  }
  return ethers.utils.parseUnits(number.toString(), decimals)
}

function toEther(number: ethers.BigNumber, decimals: number) {
  return ethers.utils.formatUnits(number, decimals)
}

export default Vue.extend({
  data () {
    return {
      bridgeTokens: bridgeTokens,
      bridgeNetworks: bridgeNetworks,
      anyswapV2Config: <any> null,
      anyswapV3Config: <any> null,
      selectedToken: <BridgeToken | null> null,
      sourceNetwork: bridgeNetworks[0],
      destNetwork: bridgeNetworks[1],
      networkSlot: <'sourceNetwork' | 'destNetwork'> 'sourceNetwork',
      showNetworkDialog: false,
      showOperationDialog: false,
      operationInProgress: false,
      tokenDecimals: <number | null> null,
      tokenBalanceWei: <ethers.BigNumber | null> null,
      tokenAllowance: <ethers.BigNumber | null> null,
      bridgeAmount: <string | null> null,
      operationSteps: <OperationStep[]> [],
      snackbar: false,
      errorMsg: '',
      active: false,
      isLoading: true
    }
  },
  computed: {
    web3(): ethers.Signer | null {
      return this.$store.state.web3
    },
    myAddress(): string | null {
      return this.$store.state.address
    },
    chainId(): ChainId | null {
      return this.$store.state.chainId
    },
    tokenContractSrc(): ethers.Contract | null {
      if (!this.selectedToken || !this.selectedToken.src.address) {
        return null
      }
      const network = this.bridgeNetworks.find(n => this.selectedToken!.src.chainId == n.chainId)!
      return new ethers.Contract(this.selectedToken.src.address, ERC20_ABI, network.dataseed)
    },
    tokenContractDst(): ethers.Contract | null {
      if (!this.selectedToken) {
        return null
      }
      const network = this.bridgeNetworks.find(n => this.selectedToken!.dst.chainId == n.chainId)!
      return new ethers.Contract(this.selectedToken.dst.address, ERC20_ABI, network.dataseed)
    },
    tokenContractSigner(): ethers.Contract | null {
      if (!this.tokenContractSrc || !this.web3) {
        return null
      }
      return new ethers.Contract(this.tokenContractSrc.address, ERC20_ABI, this.web3)
    },
    tokenBalance(): string | null {
      if (!this.tokenBalanceWei || !this.tokenDecimals) {
        return null
      }
      return toEther(this.tokenBalanceWei, this.tokenDecimals)
    },
    balanceMessage(): string | null {
      if (this.tokenBalance === null) {
        return null
      }
      return `Balance: ${this.tokenBalance} ${this.selectedToken!.symbol}`
    },
    validationStatus(): string | null {
      if (this.chainId != this.sourceNetwork.chainId) {
        return `Wallet not connected to ${this.sourceNetwork.title} network`
      }

      if (this.bridgeAmount &&
          this.tokenBalanceWei &&
          this.tokenDecimals) {
        const bridgeAmountWei = toWei(this.bridgeAmount, this.tokenDecimals)
        const tokenBalanceWeiBn = ethers.BigNumber.from(this.tokenBalanceWei.toString())
        if (bridgeAmountWei.gt(tokenBalanceWeiBn)) {
          return 'Insufficient balance'
        }

        const minimumWei = toWei(this.anyswapLimits.MinimumSwap, this.tokenDecimals)
        if (bridgeAmountWei.lt(minimumWei)) {
          return `Minimum amount is ${this.anyswapLimits.MinimumSwap} ${this.currentSymbol}`
        }
      }

      return null
    },
    needsApproval(): boolean {
      if (!this.anyswapTokenConfig || !this.anyswapTokenConfig.router) {
        return false
      }
      const tokenAllowance = parseInt((this.tokenAllowance ?? ethers.BigNumber.from(0)).toString())
      return tokenAllowance < FARM_REQUIRED_ALLOWANCE
    },
    currentChainTokens(): BridgeToken[] {
      return bridgeTokens.filter(t =>
        (t.src.chainId == this.sourceNetwork.chainId && t.dst.chainId == this.destNetwork.chainId) ||
        (t.dst.chainId == this.sourceNetwork.chainId && t.src.chainId == this.destNetwork.chainId))
    },
    // TODO: types
    anyswapTokenConfig(): any {
      if (this.selectedToken == null || this.anyswapV2Config == null || this.anyswapV3Config == null) {
        return null
      }

      if (this.selectedToken.anyswapVersion == 'v2') {
        return this.anyswapV2Config[this.selectedToken.dst.chainId][this.selectedToken.anyswapId]
      } else {
        // TODO: v3 ether tokens
        const configEntry = this.anyswapV3Config.UNDERLYINGV2[this.selectedToken.src.chainId][this.selectedToken.src.address!.toLowerCase()]
        const destConfig = configEntry.destChains[this.selectedToken.dst.chainId]
        const anyswapConfig = {
          MinimumSwap: destConfig.MinimumSwap,
          MaximumSwap: destConfig.MaximumSwap,
          SwapFeeRate: destConfig.SwapFeeRatePerMillion * 1e-2,
          MinimumSwapFee: destConfig.MinimumSwapFee,
          BigValueThreshold: destConfig.BigValueThreshold
        }
        return {
          SrcToken: {
            ...anyswapConfig,
            anyToken: configEntry.anyToken
          },
          DestToken: {
            ...anyswapConfig,
            anyToken: destConfig.anyToken
          },
          router: configEntry.router,
          srcChainID: this.selectedToken.src.chainId
        }
      }
    },
    swapType(): SwapType | null {
      if (this.anyswapTokenConfig == null) {
        return null
      }

      return this.sourceNetwork.chainId == parseInt(this.anyswapTokenConfig.srcChainID) ? 'DEPOSIT' : 'WITHDRAW'
    },
    anyswapLimits(): any {
      if (this.anyswapTokenConfig == null) {
        return {
          MinimumSwap: null,
          MaximumSwap: null,
          SwapFeeRate: null,
          MinimumSwapFee: null,
          BigValueThreshold: null
        }
      } else if (this.swapType == 'DEPOSIT') {
        return {
          ...this.anyswapTokenConfig.SrcToken
        }
      } else {
        return {
          ...this.anyswapTokenConfig.DestToken
        }
      }
    },
    displayedAnyswapLimits(): any {
      if (this.selectedToken && this.selectedToken.symbol == 'TOAD') {
        return {
          ...this.anyswapLimits,
          MaximumSwap: Math.min(this.anyswapLimits.MaximumSwap, 195000)
        }
      }
      return this.anyswapLimits
    },
    currentSymbol(): string | null {
      if (this.selectedToken == null) {
        return null
      }

      return this.selectedToken.symbol
    }
  },
  watch: {
    currentChainTokens(val: BridgeToken[]) {
      if (val == null || val.length == 0) {
        this.selectedToken = null
      } else if (this.selectedToken == null) {
        this.selectedToken = val[0]
      } else {
        this.selectedToken = val.find(t => t.symbol == this.selectedToken!.symbol) ?? null
      }

      this.tokenDecimals = null
      this.tokenBalanceWei = null
      this.tokenAllowance = null
      setTimeout(() => this.refreshData())
    },
    selectedToken(val) {
      this.tokenDecimals = null
      this.tokenBalanceWei = null
      this.tokenAllowance = null
      setTimeout(() => this.refreshData())
    }
  },
  async created() {
    const [response1, response2] = await Promise.all([
      fetch('https://bridgeapi.anyswap.exchange/v2/serverInfo/chainid'),
      fetch('https://bridgeapi.anyswap.exchange/v3/serverinfoV3?chainId=all')
    ])
    this.anyswapV2Config = await response1.json()
    this.anyswapV3Config = await response2.json()
    this.isLoading = false
  },
  async mounted() {
    this.active = true
    // wait for wallet connection
    await delay(100) // TODO: use events

    let sourceNetwork = this.bridgeNetworks.find(n => n.chainId == this.chainId)
    if (!sourceNetwork) {
      sourceNetwork = this.bridgeNetworks.find(n => n.chainId == this.$store.getters.ecosystem.chainId)
    }
    if (!sourceNetwork) {
      sourceNetwork = this.bridgeNetworks[0]
    }

    const otherNetwork = this.bridgeNetworks.find(n => n != sourceNetwork)
    this.sourceNetwork = sourceNetwork
    this.destNetwork = otherNetwork!
    this.selectedToken = this.currentChainTokens.find(() => true) ?? null

    while (this.active) {
      try {
        await this.refreshData()
      } catch (e) {
        console.error(e)
      }

      await delay(5000)
    }
  },
  beforeRouteLeave (to, from, next) {
    this.active = false
    next()
  },
  beforeDestroy() {
    this.active = false
  },
  methods: {
    selectBridgeNetwork(network: Network) {
      try {
        const previousNetwork = this[this.networkSlot]
        this[this.networkSlot] = network
        const otherSlot = this.networkSlot == 'sourceNetwork' ? 'destNetwork' : 'sourceNetwork'
        if (this[otherSlot] === network) {
          this[otherSlot] = previousNetwork
        }

        if (this.chainId !== null &&
            network.chainId !== this.chainId &&
            this.networkSlot == 'sourceNetwork') {
          // TODO: add ethereum network to metamask if missing
          this.$store.dispatch('requestNetworkChange', network.chainId)
        }
      } finally {
        this.showNetworkDialog = false
      }
    },
    setMaxTokens() {
      this.bridgeAmount = this.tokenBalance?.toString() ?? null
    },
    async approve() {
      const sourceNetwork = this.sourceNetwork
      const tokenContract = sourceNetwork.chainId == this.selectedToken!.src.chainId
        ? this.tokenContractSrc!
        : this.tokenContractDst!
      const tx = await tokenContract.populateTransaction.approve(this.anyswapTokenConfig.router, APPROVE_AMOUNT)
      await this.$store.dispatch('safeSendTransaction', { tx, targetChainId: sourceNetwork.chainId })
      setTimeout(() => this.refreshData())
    },
    async startBridgeOperation() {
      const tokenConfig = this.anyswapTokenConfig
      const swapType = this.swapType
      const sourceNetwork = this.sourceNetwork
      const destNetwork = this.destNetwork
      const selectedToken = this.selectedToken!
      const symbol = this.currentSymbol
      const tokenDecimals = tokenConfig.SrcToken.Decimals
      const bridgeAmount = this.bridgeAmount
      const bridgeAmountWei = toWei(bridgeAmount, tokenDecimals)
      this.showOperationDialog = true
      this.operationInProgress = true
      this.bridgeAmount = null
      this.operationSteps = [{
        isComplete: false,
        description: `Deposit ${symbol} on ${sourceNetwork.title}`
      }]

      try {
        let tx: ethers.providers.TransactionResponse
        if (swapType == 'DEPOSIT' && selectedToken.anyswapVersion == 'v2') {
          if (selectedToken.isEther && sourceNetwork.chainId == selectedToken.src.chainId) {
            tx = await this.web3!.sendTransaction({
              value: bridgeAmountWei,
              to: tokenConfig.SrcToken.DepositAddress
            })
          } else {
            tx = await this.tokenContractSigner!.transfer(tokenConfig.SrcToken.DepositAddress, bridgeAmountWei)
          }
        } else if (swapType == 'WITHDRAW' && selectedToken.anyswapVersion == 'v2') {
          const anyswapERC20Contract = new ethers.Contract(tokenConfig.DestToken.ContractAddress, AnyswapV5ERC20ABI, this.web3!)
          tx = await anyswapERC20Contract.Swapout(bridgeAmountWei, this.myAddress)
        } else if (swapType == 'DEPOSIT' && selectedToken.anyswapVersion == 'v3') {
          const anyswapRouterContract = new ethers.Contract(tokenConfig.router, AnyswapV4RouterABI, this.web3!)
          const destChainId = ethers.BigNumber.from(destNetwork.chainId)
          tx = await anyswapRouterContract.anySwapOutUnderlying(
            tokenConfig.SrcToken.anyToken.address,
            this.myAddress,
            bridgeAmountWei,
            destChainId
          )
        } else if (swapType == 'WITHDRAW' && selectedToken.anyswapVersion == 'v3') {
          const anyswapRouterContract = new ethers.Contract(tokenConfig.router, AnyswapV4RouterABI, this.web3!)
          const destChainId = ethers.BigNumber.from(destNetwork.chainId)
          tx = await anyswapRouterContract['anySwapOut(address,address,uint256,uint256)'](
            tokenConfig.DestToken.anyToken.address,
            this.myAddress,
            bridgeAmountWei,
            destChainId
          )
        } else {
          throw new Error()
        }

        const depositHref = `${sourceNetwork.explorer}/tx/${tx.hash}`
        this.operationSteps[this.operationSteps.length - 1].href = depositHref
        await tx.wait()
        this.markLastOperationStepCompleted()

        this.operationSteps.push({
          isComplete: false,
          description: `Submit transaction to bridge network`
        })

        let addedAnyswapOperation = false
        while (true) {
          const response = await fetch(`https://bridgeapi.anyswap.exchange/v2/history/details?params=${tx.hash}`)
          const operationStatus = await response.json()
          if (operationStatus.info &&
              operationStatus.info.txid &&
              !addedAnyswapOperation) {
            const anyswapHref = `https://anyswap.net/explorer/tx?params=${tx.hash}`
            this.markLastOperationStepCompleted(anyswapHref)
            this.operationSteps.push({
              isComplete: false,
              description: `Withdraw ${symbol} on ${destNetwork.title}`
            })
            addedAnyswapOperation = true
          }

          if (operationStatus.info &&
              operationStatus.info.swaptx &&
              await destNetwork.dataseed.getTransaction(operationStatus.info.swaptx)) {
            const withdrawHref = `${destNetwork.explorer}/tx/${operationStatus.info.swaptx}`
            this.markLastOperationStepCompleted(withdrawHref)
            break
          }

          await delay(3000)
        }
      } catch (e: any) {
        this.showOperationDialog = false
        if (e.code == 4001) {
          this.errorMsg = 'User rejected transaction'
          this.snackbar = true
        } else {
          throw(e)
        }
      } finally {
        this.operationInProgress = false
      }
    },
    markLastOperationStepCompleted(href?: string) {
      const lastOperationStep = this.operationSteps[this.operationSteps.length - 1]
      lastOperationStep.isComplete = true
      if (href) {
        lastOperationStep.href = href
      }
    },
    async refreshData() {
      if (!this.web3 || !this.myAddress) {
        return
      }

      if (this.selectedToken && this.anyswapTokenConfig) {
        const selectedToken = this.selectedToken
        const tokenConfig = this.anyswapTokenConfig
        const sourceNetwork = this.sourceNetwork
        const tokenContract = sourceNetwork.chainId == selectedToken.src.chainId
          ? this.tokenContractSrc!
          : this.tokenContractDst!
        const myAddress = this.myAddress

        let tokenDecimals
        let tokenBalanceWei
        let tokenAllowance = null
        if (selectedToken.isEther && sourceNetwork.chainId == selectedToken.src.chainId) {
          tokenDecimals = 18
          tokenBalanceWei = await sourceNetwork.dataseed.getBalance(myAddress)
        } else {
          tokenDecimals = await tokenContract.decimals()
          tokenBalanceWei = await tokenContract.balanceOf(myAddress)
          if (tokenConfig.router) {
            tokenAllowance = await tokenContract.allowance(myAddress, tokenConfig.router)
          }
        }

        if (selectedToken === this.selectedToken &&
            sourceNetwork == this.sourceNetwork &&
            myAddress === this.myAddress) {
          this.tokenDecimals = tokenDecimals
          this.tokenBalanceWei = tokenBalanceWei
          this.tokenAllowance = tokenAllowance
        }
      }
    }
  },
  filters: {
    formatNumber(n: number | null) {
      if (n == null) return ''
      return n.toLocaleString(undefined, { maximumFractionDigits: 8 })
    },
    formatPercent(n: number | null) {
      if (n == null) return '%'
      return n.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 4 })
    }
  }
})
</script>

<style scoped>

/* Overrides the default v-card style */
.theme--dark.v-sheet, .theme--dark.v-card {
  background-color: none;
  background: none;
}

.bridge-panel {
  background: rgba(24, 29, 38, 0.7) !important;
  border-radius: 20px;
}



.stats-caption {
  color: rgb(155 107 254);
  font-weight: 400;
  font-size: 14px;
}
.stats-value {
  margin-top: 0px;
  font-weight: 500;
  font-size: 19px;
}
.coin-icon {
  border-radius: 30px;
  background: transparent;
  border: none;
  height: 27px;
  width: 27px;
  margin-right: 10px;
}
.network-icon {
  height: 100px;
}
.v-card__title, .v-card__subtitle {
  word-break: normal;
}
.network-card {
  width: 35%;
}
@media all and (max-width: 700px) {
  .network-icon {
    height: 50px;
  }
  .network-arrow {
    margin-left: 0px !important;
    margin-right: 0px !important;
  }
  .network-arrow i {
    display: none;
  }
  .network-name {
    width: 100%;
    word-break: normal;
    overflow-wrap: normal;
    text-align: center;
  }
}
.v-card.on-hover.theme--dark {
  background-color: rgb(79 99 102 / 23%);
  cursor: pointer;
}
.v-input /deep/ input[type="number"]::-webkit-outer-spin-button,
/deep/ input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
}
.v-input /deep/ input[type="number"] {
    -moz-appearance: textfield;
}
.farm-title {
  line-height: 50px;
  margin-left: 25px;
  font-size: 20px;
  font-weight: 500;
}
.farm-name {
  margin-left: 45px;
  color: #e2e2e2;
}
.basic-info-card {
  height:70px;
  line-height:70px;
}
.info-description {
    font-size: 12px;
    line-height:30px;
    color: rgb(155 107 254);
    text-align: left;
}
.info-data {
    font-weight: 500;
    font-size:16px;
    line-height:2px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}
.help-link {
    text-decoration: none;
    font-size:16px;
    color: #6dc098 !important;
    margin-top: 10px;
}
.help-link-icon {
    color: #6dc098 !important;
    vertical-align: text-bottom !important;
    font-size: 14px !important;
    margin-left: 6px;
    border: 2px solid;
    border-radius: 4px;
}
.container-box {
    height: 100%;
    border: solid 2px #524b6e99;
    border-radius: 9px;
    padding: 10px;
}
.descriptions {
    font-size:13px;
    font-weight: 600;
    margin-bottom: 10px
}
.highlight {
    color: rgb(154, 106, 255)
}
.earnings {
    font-size: 19px;
    font-weight: 600;
    line-height: 35px;
}
.active-btns {
    margin-right: 10px;
    margin-left: 10px;
    border-radius: 12px;
    background: linear-gradient(159deg, rgb(110 255 185) -14.78%, rgb(120 63 236) 110.05%) 0% 0% repeat scroll rgba(0, 0, 0, 0);
}
.v-card {
  margin-top:25px
}
.searchCaption {
    font-size: 13px;
    font-weight: 500;
    margin-left: 10px;
}
.v-btn-toggle {
    border-radius: 16px;
}
.v-btn-toggle > .v-btn.v-btn {
  border: none
}
.theme--dark.v-btn.v-btn--has-bg {
    background-color: #212429;
}
.v-btn-toggle > a > span {
    font-size: 10px
}
.v-btn-toggle:not(.v-btn-toggle--dense) .v-btn.v-btn.v-size--default {
    height: 35px;
    min-height: 0;
    max-width: 32vw;
}
.theme--dark.v-btn--active:hover::before, .theme--dark.v-btn--active::before {
    opacity: 0.18;
    border-radius: 12px;
    padding: 9px;
    margin: 3px;
}
.theme--dark.v-btn:hover::before {
    opacity: 0;
}
.v-select.v-input--dense .v-select__selection--comma {
    font-size: 12px;
    font-weight: 500;
}
.v-dialog.v-dialog--active {
    box-shadow:none !important;
}
.v-sheet.theme--dark.v-toolbar.primary {
    font-weight: 600;
    font-size: 18px;
    border-bottom: 2px solid;
    background-color: #1e1e1e !important;
}
.input-wrapper {
    background: #2f2e2e;
    margin-top: 20px;
    width: 100%;
    box-shadow: rgb(118 69 217) 0px 0px 0px 1px, rgb(118 69 217 / 60%) 0px 0px 0px 3px;
    border-radius: 20px;
}
.modal-input > .v-input__control > .v-input__slot > fieldset {
    border: none;
}
.modal-input {
  margin-bottom: -25px !important;
  margin-top: -10px !important;
}
.input-wrapper > .row {
    margin: 0;
}
.max-btn {
    height: 33px !important;
    margin: 0px !important;
    margin-top: -7px !important;
    background: #9b74ee !important;
    border-radius: 15px;
}
.cancel-btn {
    background: #4a4a4a7a !important;
    height: 45px !important;
    margin: 0px !important;
    margin-top: -7px !important;
    border: #9b74ee 3px solid;
    border-radius: 15px;
    width: 100%;
}
.confirm-btn {
    background: rgb(155 116 238) !important;
    height: 45px !important;
    margin: 0px !important;
    margin-top: -7px !important;
    border: #1e1e1e 1px solid;
    border-radius: 15px;
    width: 100%;
}
.inactive-btn {
    margin-right: 10px;
    border-radius: 12px;
    border: #9b74ee 3px solid;
    width: 100%;
}
.modal-input > div > div > div > .v-label {margin-left:-18px}
.modal-input > div > div > div > input {margin-left:-18px}
.add-btn{
    background: transparent !important;
    height: 42px !important;
    width: 45px !important;
    margin: 0px !important;
    margin-top: -6px !important;
    border: #9b74ee 2px solid;
    border-radius: 15px;
    font-size: 30px !important;
    font-weight: 400;
    box-shadow: rgb(118 69 217) 0px 0px 0px 1px, rgb(118 69 217 / 60%) 0px 0px 0px 2px;
}
  @media all and (max-width: 959px) {
    .active-btns {
        width: 100%;
        margin-right: 0px;
        margin-left: 0px;
        border-radius: 12px;
        background: linear-gradient(159deg, rgb(110 255 185) -14.78%, rgb(120 63 236) 110.05%) 0% 0% repeat scroll rgba(0, 0, 0, 0);
    }
    .switchFarms > a{
      font-size:12px !important;
      padding: 16px !important;
      max-width: none !important
    }
    .switchFarms {
      width:auto;
      margin-left: 10px
    }
    .farm-title {
      line-height: 50px;
      margin-left: 22px;
      font-size: 13px;
      font-weight: 500;
    }
    .info-description {
        font-size: 11px;
        line-height:30px;
        color: rgb(155 107 254);
        text-align: left;
    }
    .info-data {
      font-weight: 500;
      font-size:14px;
      line-height:2px;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
    }
    .v-dialog {
      margin:10px;
    }
  }
    @media all and (max-width: 350px) {
    .coin-1 {
      border-radius: 30px;
      background: white;
      z-index: 1;
      position: absolute;
      margin-right: 5px;
      height: 20px;
      top: 30px;
      left: 15px;
      border: solid #00000061 1px;
    }
    .coin-2{
      border: solid #606060 1px;
      top: 21px;
      position: absolute;
      margin-right: 0px;
      height: 15px;
      background: white;
      border-radius: 20px;
    }
    .switchFarms > a{
      font-size:12px !important;
      padding: 8px !important;
      max-width: none !important
    }
    .switchFarms {
      width:auto;
      margin-left: 0px
    }
    .farm-title {
      line-height: 50px;
      margin-left: 8px;
      font-size: 12px;
      font-weight: 500;
    }
    .farm-name {
      margin-left:32px;
    }
    .info-description {
        font-size: 9px;
        line-height:30px;
        color: rgb(155 107 254);
        text-align: left;
    }
    .info-data {
      font-weight: 500;
      font-size:13px;
      line-height:2px;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
    }
    .v-dialog {
      margin:10px;
    }
    .earned {
      max-width: 20%;
    }
  }
  @media all and (max-width: 314px) {
    .coin-1 {
      border-radius: 30px;
      background: white;
      z-index: 1;
      position: absolute;
      margin-right: 2px;
      height: 17px;
      top: 30px;
      left: 12px;
      border: solid #00000061 1px;
    }
    .coin-2{
      border: solid #606060 1px;
      top: 24px;
      position: absolute;
      margin-right: 0px;
      height: 12px;
      background: white;
      border-radius: 20px;
    }
    .farm-name {
      margin-left:25px;
      font-size: 11px
    }
  }
</style>