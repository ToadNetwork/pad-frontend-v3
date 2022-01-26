<template>
  <div style="margin-bottom: 5px">
    <v-card
      @click="expand = !expand"
      class="padswap-farm"
      :class="isDetailsVisible ? 'padswap-farm-expanded' : ''"
    >
      <v-dialog
        v-if="isImported"
        v-model="showRemoveImportDialog"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            absolute
            top
            right
            fab
            x-small
            v-on="on"
            v-bind="attrs"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>

        <v-card class="pa-1" style="font-family: Roboto" rounded>
          <v-app-bar>Remove imported farm?</v-app-bar>
          <v-card-actions>
            <v-btn text @click="removeImport">Confirm</v-btn>
            <v-btn text @click="showRemoveImportDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-row justify-md="space-between" class="flex-md-nowrap">
        <v-col
          class="d-flex align-center px-3 justify-md-start justify-center pt-sm-0 pb-sm-0 pt-4 pb-8"
          md="auto"
          sm="4"
          cols="12"
        >
          <div
            class="d-flex justify-md-start justify-center"
            style="min-width: 170px"
          >
            <div
              class="d-flex flex-shrink-1 flex-grow-0"
              style="width: 55px"
            >
              <div class="d-flex">
                <v-img
                  :src="tokenImages[0]"
                  height="30"
                  width="30"
                  style="border-radius: 30px"
                  contain
                />
                <v-img
                  :src="tokenImages[1]"
                  height="30"
                  width="30"
                  contain
                  style="margin-left: -5px; border-radius: 30px"
                />
              </div>
            </div>
            <div
              class="d-flex align-center pl-4"
            >
              <div class="padswap-farm-title">{{ name }}</div>
            </div>
          </div>
        </v-col>

        <v-col
          class="px-3"
          :style="{ 'min-width': farmDataMinWidths[0] }"
          md="auto"
          sm="4"
          cols="6"
        >
          <div
            class="d-flex flex-column"
            :style="{ 'padding-left': $vuetify.breakpoint.smAndDown ? '4vw' : 'initial' }"
          >
            <div class="padswap-farm-data-title">YEARLY APY</div>
            <div class="padswap-farm-data-item">{{ apy | formatPercent }}</div>
          </div>
        </v-col>

        <v-col
          class="px-3"
          :style="{ 'min-width': farmDataMinWidths[1] }"
          md="auto"
          sm="4"
          cols="6"
        >
          <div
            class="d-flex flex-column"
            :style="{ 'padding-left': $vuetify.breakpoint.smAndDown ? '4vw' : 'initial' }"
          >
            <div class="padswap-farm-data-title">DAILY ROI</div>
            <div class="padswap-farm-data-item">{{ roi | formatPercent }}</div>
          </div>
        </v-col>

        <v-col
          class="px-3"
          :style="{ 'min-width': farmDataMinWidths[2] }"
          md="auto"
          sm="4"
          cols="6"
        >
          <div
            class="d-flex flex-column"
            :style="{ 'padding-left': $vuetify.breakpoint.xs ? '4vw' : 'initial' }"
          >
            <div class="padswap-farm-data-title">{{ displayedRewardToken }} EARNED</div>
            <div class="padswap-farm-data-item">
              <template v-if="userRewardsBalance">
                {{ userRewardsBalance | formatNumber(4) }}
                <div class="padswap-farm-note">
                  Earned value:
                  <span class="padswap-farm-note-value">
                    ${{ earnedValue | formatNumber(4) }}
                  </span>
                </div>
              </template>
              <template v-else>
                ~
              </template>
            </div>
          </div>
        </v-col>

        <v-col
          class="d-flex align-center justify-start-md justify-center"
          md="auto"
          sm="4"
          cols="6"
        >
          <v-btn
            @click.stop="isEnabled ? harvest() : enable()"
            class="padswap-farm-btn"
            :class="{ 'padswap-shake': currentAnimations['enableButton'] }"
          >
            <template v-if="isEnabled">
              Harvest
            </template>
            <template v-else>
              Enable
            </template>
          </v-btn>
          <v-icon
            class="pl-lg-5 pl-1 d-md-flex d-none"
            color="#00FC4C"
          >
            {{ expand ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
          </v-icon>
        </v-col>

        <v-col cols="4" class="d-md-none d-sm-flex d-none" />
      </v-row>

      <v-overlay
        absolute
        v-model="isLoading"
      >
        <v-progress-circular
          indeterminate
          style="opacity: 0.6"
        />
      </v-overlay>
    </v-card>
    <v-expand-transition
      @enter="isDetailsVisible = true"
      @afterLeave="isDetailsVisible = false">
      <div v-show="expand">
        <v-card
          class="padswap-farm-details"
        >
          <v-row justify="space-between">
            <v-col
              class="padswap-farm-data"
              sm="3"
              cols="12"
            >
              <v-row>
                <v-col cols="6" class="padswap-pink">
                  <a v-if="this.token1Address == this.token2Address && this.token1Address != TOAD && this.token1Address != WGLMR"
                    :href="padswapBuyTokenUrl"
                    target="_blank"
                    style="color: unset; text-decoration: unset;"
                  >
                    GET {{ name }}
                    <v-icon dense>mdi-arrow-top-right</v-icon>
                  </a>
                  <a v-else
                    :href="padswapLiquidityUrl"
                    target="_blank"
                    style="color: unset; text-decoration: unset;"
                  >
                    GET {{ name }}
                    <v-icon dense>mdi-arrow-top-right</v-icon>
                  </a>
                </v-col>
                <v-col cols="6"></v-col>
              </v-row>
              <v-row>
                <v-col cols="6">TVL:</v-col>
                <v-col cols="6">${{ tvl | formatNumberKM }}</v-col>
              </v-row>
              <v-row>
                <v-col cols="6">POOL&nbsp;SIZE:</v-col>
                <v-col cols="6">{{ poolSize | formatNumberKM }}&nbsp;{{ this.displayedRewardToken }}</v-col>
              </v-row>
              <v-row>
                <v-col cols="6">POOL&nbsp;VALUE:</v-col>
                <v-col cols="6">${{ poolValue | formatNumberKM }}</v-col>
              </v-row>
              <v-row>
                <v-col cols="6">LP/TOKEN&nbsp;PRICE:</v-col>
                <v-col cols="6">${{ lpPrice | formatNumberKM }}</v-col>
              </v-row>
            </v-col>
            <v-col
              class="padswap-farm-data"
              sm="3"
              cols="12"
            >
              <v-row>
                <v-col>{{ name }}&nbsp;BALANCE:</v-col>
                <v-col>{{ userLpBalanceNum | formatNumber(4) }}</v-col>
              </v-row>
              <v-row>
                <v-col>{{ name }}&nbsp;STAKED:</v-col>
                <v-col>{{ userStakedBalanceNum | formatNumber(4) }}</v-col>
              </v-row>
              <v-row>
                <v-col>STAKED&nbsp;VALUE</v-col>
                <v-col class="padswap-pink">${{ stakedLpValue | formatNumber(2) }}</v-col>
              </v-row>
              <v-row>
                <v-col>EARNED&nbsp;VALUE:</v-col>
                <v-col class="padswap-pink">${{ earnedValue | formatNumber(4) }}</v-col>
              </v-row>
            </v-col>
            <v-col
              sm="6"
              cols="12"
              class="px-0 pt-sm-0 pt-4"
              style="max-width: 600px"
            >
              <div class="d-flex flex-column">
                <v-card
                  class="d-flex flex-column padswap-deposit-withdraw-box"
                  :class="{ 'padswap-deposit-withdraw-box-disabled': !isEnabled}"
                >
                  <div class="d-flex mb-2">
                    <div
                      @click="dwAction = 'deposit'"
                      :class="{ 'padswap-selected-action': dwAction == 'deposit' }"
                      class="padswap-action"
                    >
                      Deposit
                    </div>
                    <div
                      @click="dwAction = 'withdraw'"
                      :class="{ 'padswap-selected-action': dwAction == 'withdraw' }"
                      class="padswap-action ml-7"
                    >
                      Withdraw
                    </div>
                    <div
                      v-if="farmContract.functions.reinvest != null"
                      @click="dwAction = 'reinvest'"
                      :class="{ 'padswap-selected-action': dwAction == 'reinvest' }"
                      class="padswap-action ml-7"
                    >
                      Reinvest
                    </div>
                  </div>
                  <div class="d-flex mb-1">
                    <v-text-field
                      v-model="dwActionAmount"
                      :disabled="dwAction == 'reinvest'"
                      type="number"
                      min="0.0"
                      solo
                      outlined
                      rounded
                      dense
                      color="#00FC4c"
                      background-color="#71767F"
                      hide-spin-buttons
                      :hide-details="validationStatus.message == null"
                      :error-messages="validationStatus.message"
                      append-icon
                      class="mr-3"
                      :class="{ 'padswap-disabled-control': dwAction == 'reinvest' }"
                      height="40px"
                    >
                      <template v-slot:append>
                        <v-btn
                          @click="setMax"
                          x-small
                          color="#595E67"
                          class="padswap-max-btn mr-n3">
                          Max
                        </v-btn>
                      </template>
                    </v-text-field>
                    <v-btn
                      @click="dwAction == 'deposit' ? deposit() : dwAction == 'withdraw' ? withdraw() : reinvest()"
                      class="padswap-farm-btn padswap-dw-btn pa-5"
                      :class="{ 'padswap-shake': currentAnimations['dwButton'] }"
                      :ripple="validationStatus.status"
                      style="text-transform: capitalize"
                    >
                      {{ dwAction }}
                    </v-btn>
                  </div>
                  <div
                    class="padswap-dw-balance"
                    :class="{ 'padswap-disabled-control': dwAction == 'reinvest' }"
                  >
                    <template v-if="dwAction == 'withdraw'">
                      {{ name }} STAKED:
                    </template>
                    <template v-else>
                      {{ name }} BALANCE:
                    </template>
                    <span class="padswap-dw-balance-amount">
                      <template v-if="dwAction == 'withdraw'">
                        {{ userStakedBalanceNum | formatNumber(4) }}
                      </template>
                      <template v-else>
                        {{ userLpBalanceNum | formatNumber(4) }}
                      </template>
                    </span>
                  </div>

                  <v-overlay
                    v-if="!isEnabled"
                    color="transparent"
                    absolute
                    @click="shakeButton('enableButton')"
                  >
                  </v-overlay>
                </v-card>
                <v-subheader class="d-flex align-baseline px-0 mt-3">
                  <v-icon small class="mr-2">mdi-information-outline</v-icon>
                  <div>
                    <template v-if="type == 1">
                      DPLP Farms: 10% fee when staking and unstaking (7.5% back to the pool and 2.5% to the PadSwap vault). No fee to harvest rewards.
                    </template>
                    <template v-else-if="name == 'PAD'">
                      V2 Farms: 1% fee is permanently burned when staking and unstaking.
                    </template>
                    <template v-else>
                      V2 Farms: 1% fee when staking and unstaking. This fee goes to the PadSwap vault.
                    </template>
                  </div>
                </v-subheader>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapState } from 'vuex'
import { ethers } from 'ethers'

import {
  ERC20_ABI,
  FARM_REQUIRED_ALLOWANCE,
  PADSWAP_FARM_ABI,
  PADSWAP_SINGLE_STAKE_FARM_ABI,
  PADSWAP_LP_FARM_ABI,
  APPROVE_AMOUNT } from '@/constants'
import { IEcosystem, EcosystemId, ECOSYSTEMS } from '@/ecosystem'
import { formatMixin } from '@/format'
import { FarmData } from '@/types'
import { delay, equalsInsensitive } from '@/utils'

type ValidationStatus = {
  status: boolean,
  message?: string
}

const IMAGE_OVERRIDES = {
  CZATS: require('@/assets/tokens/bsc/CZATS.png'),
  DAI: require('@/assets/tokens/moonriver/DAI.png'),
  DOT: require('@/assets/tokens/bsc/DOT.png'),
  FUK: require('@/assets/tokens/bsc/FUK.png'),
  KISH: require('@/assets/tokens/bsc/KISH.png'),
  MOVR: require('@/assets/tokens/moonriver/MOVR.png'),
  MRBTC: require('@/assets/tokens/bsc/MRBTC.png'),
  RDOGE: require('@/assets/tokens/moonriver/RDOGE.png'),
  GLMR: require('@/assets/tokens/moonbeam/GLMR.png'),
  WGLMR: require('@/assets/tokens/moonbeam/WGLMR.png')
}

const TOAD = '0x463e737d8f740395abf44f7aac2d9531d8d539e9'
const WGLMR = '0xe3DB50049C74De2F7d7269823af3178Cf22fd5E3'
const WBNB = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
// TODO: use 0x98878b06940ae243284ca214f92bb71a2b032b8a?
const WMOVR = '0x663a07a2648296f1A3C02EE86A126fE1407888E5'

export default Vue.extend({
  name: 'Farm',
  mixins: [formatMixin],
  props: {
    name: String,
    contract: String,
    acceptedToken: String,
    token1Address: String,
    token2Address: String,
    rewardToken: String,
    type: Number,
    isImported: Boolean,
    tokenLogoUrls: Object,
    ecosystemId: Number,
    roi: Number,
    apy: Number,
    poolSize: Number,
    poolValue: Number,
    tvl: Number,
    lpPrice: Number,
    rewardTokenPrice: Number,
    userLpBalance: ethers.BigNumber,
    userStakedBalance: ethers.BigNumber,
    userRewardsBalance: Number,
    userAllowance: Number
  },
  data() {
    const [token0, token1] = this.name.split('-')
    return {
      expand: false,
      isDetailsVisible: false,
      currentAnimations: {
        'dwButton': false,
        'enableButton': false
      },
      dwAction: <'deposit' | 'withdraw' | 'reinvest'> 'deposit',
      dwActionAmount: <string | null> null,
      token0,
      token1,
      showRemoveImportDialog: false
    }
  },
  computed: {
    ecosystem(): IEcosystem {
      return ECOSYSTEMS[this.ecosystemId as EcosystemId]
    },
    userLpBalanceNum(): number {
      return parseFloat(ethers.utils.formatEther(this.userLpBalance ?? 0))
    },
    userStakedBalanceNum(): number {
      return parseFloat(ethers.utils.formatEther(this.userStakedBalance ?? 0))
    },
    isLoading(): boolean {
      return this.roi === undefined
    },
    isEnabled(): boolean {
      return this.userAllowance !== undefined && this.userAllowance >= FARM_REQUIRED_ALLOWANCE
    },
    stakedLpValue(): number {
      if (!this.userStakedBalanceNum) {
        return 0
      }

      return this.userStakedBalanceNum * (this.lpPrice as number)
    },
    displayedRewardToken(): string {
      if (this.rewardToken) {
        return this.rewardToken
      } else if (this.type == 1) { // LP farm
        return this.name
      } else {
        return 'PAD'
      }
    },
    tokenImages(): string[] {
      const token0 = this.token0 as keyof typeof IMAGE_OVERRIDES
      const token1 = (this.token1 ?? this.token0) as keyof typeof IMAGE_OVERRIDES
      if (this.isImported) {
        const tokenLogoUrls = this.tokenLogoUrls ?? {}
        return [
          tokenLogoUrls[this.token1Address] ?? IMAGE_OVERRIDES[token0] ?? this.requireOrDefault(`@/assets/tokens/${this.ecosystem.tokenIconsFolder}/${token0}.svg`),
          tokenLogoUrls[this.token2Address] ?? IMAGE_OVERRIDES[token1] ?? this.requireOrDefault(`@/assets/tokens/${this.ecosystem.tokenIconsFolder}/${token1}.svg`)
        ]
      }
      return [
        IMAGE_OVERRIDES[token0] ?? require(`@/assets/tokens/${this.ecosystem.tokenIconsFolder}/${token0}.svg`),
        IMAGE_OVERRIDES[token1] ?? require(`@/assets/tokens/${this.ecosystem.tokenIconsFolder}/${token1}.svg`)
      ]
    },
    padswapLiquidityUrl(): string {
      const token1Address = equalsInsensitive(this.token1Address, this.ecosystem.wethAddress) ? this.ecosystem.ethName : this.token1Address
      const token2Address = equalsInsensitive(this.token2Address, this.ecosystem.wethAddress) ? this.ecosystem.ethName : this.token2Address
      return `/${this.ecosystem.routeName}/swap?action=add&token1=${token1Address}&token2=${token2Address}`
    },
    padswapBuyTokenUrl(): string {
      return `/${this.ecosystem.routeName}/swap?inputCurrency=GLMR&outputCurrency=${this.token1Address}`
    },
    earnedValue(): number {
      if (!this.userRewardsBalance) {
        return 0
      }

      return (this.userRewardsBalance as number) * (this.rewardTokenPrice as number)
    },
    dwActionAmountBn: {
      // TODO: token-specific decimals if ever needed
      get(): ethers.BigNumber {
        return ethers.utils.parseEther(this.dwActionAmount || '0')
      },
      set(val: ethers.BigNumber) {
        this.dwActionAmount = ethers.utils.formatEther(val)
      }
    },
    validationStatus(): ValidationStatus {
      if (this.dwActionAmount == null || this.dwActionAmountBn.lte(0)) {
        return { status: false }
      }

      if (this.dwAction == 'deposit' && this.dwActionAmountBn.gt(this.userLpBalance)) {
        return { status: false, message: 'Insufficient balance'}
      }

      if (this.dwAction == 'withdraw' && this.dwActionAmountBn.gt(this.userStakedBalance)) {
        return { status: false, message: 'Insufficient balance'}
      }

      return { status: true }
    },
    farmDataMinWidths(): string[] {
      if (this.$vuetify.breakpoint.xl) {
        return ['200px', '200px', '200px']
      } else if (this.$vuetify.breakpoint.lg) {
        return ['130px', '130px', '200px']
      } else if (this.$vuetify.breakpoint.md) {
        return ['100px', '100px', '200px']
      } else {
        return ['initial', 'initial', 'initial']
      }
    },
    farmContract(): ethers.Contract {
      if (this.type == 1) {
        return new ethers.Contract(this.contract, PADSWAP_LP_FARM_ABI, this.web3)
      } else if (this.token1Address == this.token2Address && this.token1Address != TOAD && this.token1Address != WGLMR) {
        return new ethers.Contract(this.contract, PADSWAP_SINGLE_STAKE_FARM_ABI, this.web3)
      } else {
        return new ethers.Contract(this.contract, PADSWAP_FARM_ABI, this.web3)
      }
    },
    tokenContract(): ethers.Contract {
      return new ethers.Contract(this.acceptedToken, ERC20_ABI, this.web3)
    },
    ...mapState(['web3'])
  },
  methods: {
    setMax() {
      if (this.dwAction == 'deposit') {
        this.dwActionAmountBn = this.userLpBalance
      } else {
        this.dwActionAmountBn = this.userStakedBalance
      }
    },
    async enable() {
      const tx = await this.tokenContract.populateTransaction.approve(this.farmContract.address, APPROVE_AMOUNT)
      await this.safeSendTransaction({ tx, targetChainId: this.ecosystem.chainId})
    },
    async harvest() {
      let tx
      if (this.type == 1) {
        tx = await this.farmContract.populateTransaction.withdraw()
      } else {
        tx = await this.farmContract.populateTransaction.harvest()
      }

      await this.safeSendTransaction({ tx, targetChainId: this.ecosystem.chainId})
    },
    async deposit() {
      if (!this.validationStatus.status) {
        this.shakeButton('dwButton')
        return
      }

      const tx = await this.farmContract.populateTransaction.deposit(this.dwActionAmountBn)
      await this.safeSendTransaction({ tx, targetChainId: this.ecosystem.chainId })
    },
    async withdraw() {
      if (!this.validationStatus.status) {
        this.shakeButton('dwButton')
        return
      }

      const tx = await this.farmContract.populateTransaction.remove(this.dwActionAmountBn)
      await this.safeSendTransaction({ tx, targetChainId: this.ecosystem.chainId })
    },
    async reinvest() {
      const tx = await this.farmContract.populateTransaction.reinvest()
      await this.safeSendTransaction({ tx, targetChainId: this.ecosystem.chainId })
    },
    async shakeButton(name: 'dwButton' | 'enableButton') {
      if (this.currentAnimations[name]) {
        return
      }
      this.currentAnimations[name] = true
      await delay(290)
      this.currentAnimations[name] = false
    },
    removeImport() {
      this.$store.state.userProfile.importedFarms[this.ecosystemId] =
        this.$store.state.userProfile.importedFarms[this.ecosystemId].filter((f: FarmData) => !equalsInsensitive(f.contract, this.contract))
      this.showRemoveImportDialog = false
    },
    requireOrDefault(path: string): string {
      try {
        return require(path)
      } catch (e) {
        console.warn(e)
        const defaultTokenName = this.ecosystem.ethName
        // TODO: use an unknown token icon
        if (defaultTokenName in IMAGE_OVERRIDES) {
          return IMAGE_OVERRIDES[defaultTokenName as keyof typeof IMAGE_OVERRIDES]
        }
        return require(`@/assets/tokens/${this.ecosystem.tokenIconsFolder}/${defaultTokenName}.svg`)
      }
    },
    ...mapActions(['safeSendTransaction'])
  }
})
</script>

<style scoped>
.padswap-farm {
  background: #181D26 !important;
  border-radius: 15px !important;
  width: 100%;
  color: #B3B8C1 !important;
  padding: 39px 40px !important;
  font-family: Roboto;
}
@media all and (max-width: 700px) {
  .padswap-farm {
    padding: 39px 20px !important;
  }
}
.padswap-farm-expanded {
  border-top-left-radius: 15px !important;
  border-top-right-radius: 15px !important;
  border-bottom-left-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
}
.padswap-farm-details {
  background: #292D38 !important;
  border-top-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
  border-bottom-left-radius: 15px !important;
  border-bottom-right-radius: 15px !important;
  width: 100%;
  padding: 45px;
  font-size: 14px;
  font-family: Roboto;
}
.padswap-farm-data .col:first-child {
  color: #979CA5;
}
.padswap-farm-data .col:last-child {
  color: #FFFFFF;
}
.padswap-farm-data .col.padswap-pink, .padswap-farm-data .col.padswap-pink .v-icon {
  color: #FB53EF;
}
.col {
  padding: 3px;
}
.padswap-farm-title {
  font-family: Roboto Mono;
  color: #FB53EF;
  font-size: 16px;
  white-space: nowrap;
}
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
.padswap-farm-data-title {
  font-size: 12px;
  color: #71767F;
}
.padswap-farm-data-item {
  font-size: 24px;
  color: #FFFFFF;
  white-space: nowrap;
}
.padswap-farm-note {
  font-size: 12px;
  color: #979CA5;
}
.padswap-farm-note-value {
  color: #FB53EF;
}
.v-card.padswap-deposit-withdraw-box {
  border: 1px solid #595E67;
  border-radius: 15px;
  padding: 10px 20px;
  background: none;
}
.v-card.padswap-deposit-withdraw-box-disabled {
  filter: opacity(0.8) brightness(0.8);
}
.padswap-action {
  color: #979CA5;
  font-size: 16px;
  cursor: pointer;
}
.padswap-action.padswap-selected-action {
  color: #FB53EF;
  text-decoration: underline;
  cursor: unset;
}
.v-text-field {
  border-radius: 8px;
}
.padswap-dw-balance {
  font-size: 12px;
  color: #979CA5;
}
.padswap-dw-balance-amount {
  font-size: 14px;
  color: #FFFFFF;
}
.v-subheader, .v-subheader .v-icon {
  color: #B3B8C1 !important;
}
.padswap-max-btn {
  border-radius: 8px;
  text-transform: none;
  font-size: 12px;
  font-weight: bold;
}
.padswap-disabled-control {
  filter: blur(0.6px) opacity(0.2);
}

.padswap-shake {
  animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
}
@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>