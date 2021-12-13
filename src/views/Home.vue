<template>
  <v-container>
    <div class="padswap-header-box">
      <slider-tabs
        class="padswap-ecosystem-tabs"
        v-model="ecosystem"
      >
        <v-tab class="d-flex flex-column">
          <v-img
            style="max-height: 30px; max-width: 30px;"
            contain
            src="../assets/tokens/bsc/PAD.svg"
          />
          <div>BSC</div>
        </v-tab>
        <v-tab class="d-flex flex-column">
          <v-img
            style="max-height: 30px; max-width: 30px;"
            contain
            src="../assets/tokens/moonriver/PAD.svg"
          />
          <div>Moonriver</div>
        </v-tab>
        <v-tab class="d-flex flex-column">
          <v-img
            style="max-height: 30px; max-width: 30px;"
            contain
            src="../assets/tokens/bsc/TOAD.svg"
          />
          <div>Toad</div>
        </v-tab>
      </slider-tabs>
      <v-subheader class="padswap-ecosystem-subheader">Select ecosystem</v-subheader>

      <v-img
        :src="$padswapTheme.theme.toadPadImageSrc"
        contain
        height="105"
      />
      <div style="font-size: 36px; margin-top: 20px;">Pad Farms</div>
      <div style="font-size: 14px; color: #B3B8C1; margin-top: 10px;">Stake tokens to earn PAD, LP and partner tokens.</div>
    </div>
    <v-sheet style="margin-top: 60px;">
      <v-card class="d-flex align-center flex-wrap flex-md-nowrap justify-space-around justify-md-start">
        <slider-tabs
          v-model="farmViewOption"
          class="padswap-farm-type-tabs mr-0"
        >
          <v-tab>V2&nbsp;Farms</v-tab>
          <v-tab>Retiring</v-tab>
        </slider-tabs>
        <div class="d-flex align-center px-sm-5 mr-md-auto">
          <v-switch v-model="stakedOnly" /> Staked
        </div>
        <div class="d-flex align-center mr-md-5 py-2">
          Sort&nbsp;by:
          <v-select
            solo
            hide-details="true"
            class="ml-2"
            background-color="#292D38"
            style="max-width: 200px"
            rounded
            :items="['Hot', 'APY', 'TVL', 'Earned', 'Staked']"
            v-model="sortBy"
          />
        </div>
        <div class="d-flex align-center py-2">
          Search:
          <v-text-field
            v-model="searchText"
            solo
            hide-details="true"
            background-color="#292D38"
            rounded
            class="ml-2"
            placeholder="Enter Token Name"
            append-icon="mdi-magnify"
          />
        </div>
      </v-card>

      <v-card class="padswap-farms mt-4 pa-3">
        <div class="mx-5 padswap-farm-title padswap-farm-title-shadow mb-4">Regular Farms</div>
        <farm
          v-for="farm in displayedFarms.regularFarms"
          :key="farm.contract"
          :name="farm.name"
          :contract="farm.contract"
          :acceptedToken="farm.acceptedToken"
          :chain="ecosystem == 1 ? 'moonriver' : 'bsc'"
          :roi="farm.roi"
          :apy="farm.apy"
          :poolSize="farm.poolSize"
          :poolValue="farm.poolValue"
          :tvl="farm.tvl"
          :lpPrice="farm.lpPrice"
          :rewardTokenPrice="farm.rewardTokenPrice"
          :userLpBalance="farm.userLpBalance"
          :userStakedBalance="farm.userStakedBalance"
          :userRewardsBalance="farm.userRewardsBalance"
          :userAllowance="farm.userAllowance"
        />
      </v-card>
      <v-card class="padswap-farms mt-6 pa-3">
        <div class="mx-5 padswap-farm-title padswap-farm-title-shadow mb-4">DPLP Farms</div>
        <farm
          v-for="farm in displayedFarms.lpFarms"
          :key="farm.contract"
          :name="farm.name"
          :contract="farm.contract"
          :acceptedToken="farm.acceptedToken"
          :chain="ecosystem == 1 ? 'moonriver' : 'bsc'"
          :roi="farm.roi"
          :apy="farm.apy"
          :poolSize="farm.poolSize"
          :poolValue="farm.poolValue"
          :tvl="farm.tvl"
          :lpPrice="farm.lpPrice"
          :rewardTokenPrice="farm.rewardTokenPrice"
          :userLpBalance="farm.userLpBalance"
          :userStakedBalance="farm.userStakedBalance"
          :userRewardsBalance="farm.userRewardsBalance"
          :userAllowance="farm.userAllowance"
        />
      </v-card>
      <v-card class="padswap-farms mt-6 pa-3">
        <div class="mx-5 padswap-farm-title padswap-farm-title-shadow mb-4">Partner Farms</div>
        <farm
          v-for="farm in displayedFarms.partnerFarms"
          :key="farm.contract"
          :name="farm.name"
          :contract="farm.contract"
          :acceptedToken="farm.acceptedToken"
          :chain="ecosystem == 1 ? 'moonriver' : 'bsc'"
          :roi="farm.roi"
          :apy="farm.apy"
          :poolSize="farm.poolSize"
          :poolValue="farm.poolValue"
          :tvl="farm.tvl"
          :lpPrice="farm.lpPrice"
          :rewardTokenPrice="farm.rewardTokenPrice"
          :userLpBalance="farm.userLpBalance"
          :userStakedBalance="farm.userStakedBalance"
          :userRewardsBalance="farm.userRewardsBalance"
          :userAllowance="farm.userAllowance"
        />
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { ethers } from 'ethers'
import { providers } from '@0xsequence/multicall'

import Farm from '@/components/Farm.vue'
import SliderTabs from '@/components/SliderTabs.vue'
import farmsBsc from '@/farms_config_bsc.json'
import farmsMoonriver from '@/farms_config_movr.json'
import { BscPadswapTheme, MoonriverPadswapTheme } from '@/padswap-theme'
import { PriceModel } from '@/price-model'
import {
  PADSWAP_FARM_ABI,
  PADSWAP_LP_FARM_ABI,
  MINTER_ABI,
  BSC_MINTER_ADDRESS,
  MOVR_MINTER_ADDRESS,
  PADSWAP_PAIR_ABI,
  MULTICALL_ADDRESS
} from '../constants'
import { delay } from '@/utils'
import AwaitLock from 'await-lock'

// TODO: config
const farmsToad = {
  regularFarms: { farms: [], retiredFarms: [] },
  lpFarms: { farms: [] },
  partnerFarms: { farms: [] }
}

enum FarmType {
  Regular,
  LP,
  Partner
}

type FarmData = {
  name: string,
  contract: string,
  acceptedToken: string,
  token1: string,
  token2: string,
  rewardToken: string | undefined,
  type: FarmType | undefined,
  poolSize: number | undefined,
  poolValue: number | undefined,
  tvl: number | undefined,
  farmTotalSupply: number | undefined,
  pairTotalSupply: number | undefined,
  mintShare: number | undefined,
  lpPrice: number | undefined,
  rewardTokenPrice: number | undefined,
  roi: number | undefined,
  apy: number | undefined,
  userLpBalance: number | undefined,
  userStakedBalance: number | undefined,
  userRewardsBalance: number | undefined,
  userAllowance: number | undefined
}

type FarmSet = {
  regularFarms: { farms: FarmData[], retiredFarms: FarmData[] },
  lpFarms: { farms: FarmData[] },
  partnerFarms: { farms: FarmData[] }
}

enum FarmViewOption {
  Default = 0,
  IncludeRetired = 1
}

enum Ecosystem {
  BSC = 0,
  Moonriver = 1,
  Toad = 2
}

const TOKENS: {[address: string]: string} = {
  FUK: '0xa898bbb508c04be26af3d319b7775927afcb02af'
}

const PAD = {
  [Ecosystem.BSC]: '0xC0888d80EE0AbF84563168b3182650c0AdDEb6d5',
  [Ecosystem.Moonriver]: '0x45488C50184Ce2092756ba7CdF85731fD17e6f3d',
  [Ecosystem.Toad]: '0xC0888d80EE0AbF84563168b3182650c0AdDEb6d5'
}

const MINTER = {
  [Ecosystem.BSC]: BSC_MINTER_ADDRESS,
  [Ecosystem.Moonriver]: MOVR_MINTER_ADDRESS,
  [Ecosystem.Toad]: BSC_MINTER_ADDRESS
}

function initializeFarms(farms: FarmData[], type: FarmType): FarmData[] {
  return farms.map(f => ({
    ...f,
    rewardToken: f.rewardToken,
    type,
    poolSize: undefined,
    poolValue: undefined,
    tvl: undefined,
    farmTotalSupply: undefined,
    pairTotalSupply: undefined,
    mintShare: undefined,
    lpPrice: undefined,
    rewardTokenPrice: undefined,
    roi: undefined,
    apy: undefined,
    userLpBalance: undefined,
    userStakedBalance: undefined,
    userRewardsBalance: undefined,
    userAllowance: undefined
  }))
}

function initializeFarmSet(farmSet: FarmSet) {
  const copy: FarmSet = JSON.parse(JSON.stringify(farmSet))
  copy.regularFarms.farms = initializeFarms(copy.regularFarms.farms, FarmType.Regular)
  copy.regularFarms.retiredFarms = initializeFarms(copy.regularFarms.retiredFarms, FarmType.Regular)
  copy.lpFarms.farms = initializeFarms(copy.lpFarms.farms, FarmType.LP)
  copy.partnerFarms.farms = initializeFarms(copy.partnerFarms.farms, FarmType.Partner)
  return copy
}

export default Vue.extend({
  name: 'Home',
  components: { Farm, SliderTabs },
  data() {
    return {
      farms: {
        bsc: initializeFarmSet(farmsBsc as any),
        moonriver: initializeFarmSet(farmsMoonriver as any),
        toad: initializeFarmSet(farmsToad as any)
      },
      active: true,
      ecosystem: Ecosystem.BSC,
      farmViewOption: FarmViewOption.Default,
      stakedOnly: false,
      sortBy: 'Earned',
      searchText: '',
      syncLocks: {
        [Ecosystem.BSC]: new AwaitLock(),
        [Ecosystem.Moonriver]: new AwaitLock()
      }
    }
  },
  async mounted() {
    while (this.active) {
      try {
        await this.sync()
      } catch (e) {
        console.error(e)
      } finally {
        await delay(5000)
      }
    }
  },
  beforeDestroy() {
    this.active = false
  },
  beforeRouteLeave(to: any, from: any, next: Function) {
    this.active = false
    next()
  },
  computed: {
    currentFarmSet(): FarmSet {
      if (this.ecosystem == Ecosystem.Toad) {
        return this.farms.toad
      } else if (this.ecosystem == Ecosystem.Moonriver) {
        return this.farms.moonriver
      } else {
        return this.farms.bsc
      }
    },
    displayedFarms(): Object {
      const visibleFarms = {
        regularFarms: Array.from<FarmData>(this.currentFarmSet.regularFarms.farms),
        lpFarms: Array.from<FarmData>(this.currentFarmSet.lpFarms.farms),
        partnerFarms: Array.from<FarmData>(this.currentFarmSet.partnerFarms.farms)
      }

      if (this.farmViewOption == FarmViewOption.IncludeRetired) {
        visibleFarms.regularFarms.push(...this.currentFarmSet.regularFarms.retiredFarms)
      }

      if (this.searchText) {
        visibleFarms.regularFarms = visibleFarms.regularFarms.filter(f => f.name.toLowerCase().includes(this.searchText.toLowerCase()))
        visibleFarms.lpFarms = visibleFarms.lpFarms.filter(f => f.name.toLowerCase().includes(this.searchText.toLowerCase()))
        visibleFarms.partnerFarms = visibleFarms.partnerFarms.filter(f => f.name.toLowerCase().includes(this.searchText.toLowerCase()))
      }

      if (this.stakedOnly) {
        visibleFarms.regularFarms = visibleFarms.regularFarms.filter(f => f.userStakedBalance !== undefined && f.userStakedBalance > 0)
        visibleFarms.lpFarms = visibleFarms.lpFarms.filter(f => f.userStakedBalance !== undefined && f.userStakedBalance > 0)
        visibleFarms.partnerFarms = visibleFarms.partnerFarms.filter(f => f.userStakedBalance !== undefined && f.userStakedBalance > 0)
      }

      let sortfn = (_1: FarmData, _2: FarmData) => 1
      if (this.sortBy == 'APY') {
        sortfn = (f1, f2) => f2.apy! - f1.apy!
      } else if (this.sortBy == 'TVL') {
        sortfn = (f1, f2) => f2.tvl! - f1.tvl!
      } else if (this.sortBy == 'Earned') {
        sortfn = (f1, f2) => f2.userRewardsBalance! * f2.rewardTokenPrice! - f1.userRewardsBalance! * f2.rewardTokenPrice!
      } else if (this.sortBy == 'Staked') {
        sortfn = (f1, f2) => f2.userStakedBalance! * f2.lpPrice! - f1.userStakedBalance! * f1.lpPrice!
      }
      visibleFarms.regularFarms.sort(sortfn)
      visibleFarms.lpFarms.sort(sortfn)
      visibleFarms.partnerFarms.sort(sortfn)

      return visibleFarms
    },
    dataseed(): ethers.providers.Provider {
      if (this.ecosystem == Ecosystem.Moonriver) {
        return new ethers.providers.StaticJsonRpcProvider('https://moonriver.api.onfinality.io/public')
      } else {
        return new ethers.providers.StaticJsonRpcProvider('https://bsc-dataseed1.defibit.io/')
      }
    },
    multicall(): ethers.providers.Provider {
      return new providers.MulticallProvider(this.dataseed, {
        batchSize: 300,
        timeWindow: 0,
        contract: MULTICALL_ADDRESS
      })
    },
    priceModel(): PriceModel {
      if (this.ecosystem == Ecosystem.Moonriver) {
        return PriceModel.getPriceModelForChain(this.dataseed, 1285)
      } else {
        return PriceModel.getPriceModelForChain(this.dataseed, 56)
      }
    },
    isConnected(): boolean {
      return this.$store.getters.isConnected
    },
    userAddress(): string {
      return this.$store.state.address
    },
    lastChainTransactionBlock(): Object {
      // access properties explicitly to trigger reactivity
      return {
        [56]: this.$store.state.lastChainTransactionBlock[56],
        [1285]: this.$store.state.lastChainTransactionBlock[1285]
      }
    }
  },
  watch: {
    ecosystem(val) {
      let theme
      if (val == Ecosystem.Moonriver) {
        theme = MoonriverPadswapTheme
      } else {
        theme = BscPadswapTheme
      }

      this.$padswapTheme.theme = theme
      setTimeout(() => this.sync())
    },
    lastChainTransactionBlock() {
      setTimeout(() => this.sync())
    }
  },
  methods: {
    async sync() {
      if (this.ecosystem == Ecosystem.Toad) {
        // TODO
        return
      }

      const mutex = this.syncLocks[this.ecosystem]
      await mutex.acquireAsync()

      try {
        await this.syncInternal()
      } finally {
        mutex.release()
      }
    },
    async syncInternal() {
      const allFarms: FarmData[] = []
      allFarms.push(...this.currentFarmSet.regularFarms.farms,
                    ...this.currentFarmSet.regularFarms.retiredFarms,
                    ...this.currentFarmSet.lpFarms.farms,
                    ...this.currentFarmSet.partnerFarms.farms)
      const priceModel = this.priceModel

      let mintSupply: number
      const minterAddress = MINTER[this.ecosystem]
      const minterContract = new ethers.Contract(minterAddress, MINTER_ABI, this.multicall)
      const blockNumber = await this.multicall.getBlockNumber()
      const promises = [
        priceModel.syncWithin(blockNumber, 12),
        minterContract.totalSupply().then((n: ethers.BigNumber) => mintSupply = parseFloat(ethers.utils.formatEther(n)))
      ]

      for (const farm of allFarms) {
        const farmContract = new ethers.Contract(farm.contract, farm.type == FarmType.LP ? PADSWAP_LP_FARM_ABI : PADSWAP_FARM_ABI, this.multicall)
        const pairContract = new ethers.Contract(farm.acceptedToken, PADSWAP_PAIR_ABI, this.multicall)
        const p1 = farm.type == FarmType.LP ? farmContract.dividendPool().then((n: ethers.BigNumber) => farm.poolSize = parseFloat(ethers.utils.formatEther(n)))
                                            : farmContract.farmPool().then((n: ethers.BigNumber) => farm.poolSize = parseFloat(ethers.utils.formatEther(n)))
        const p2 = farmContract.totalSupply().then((n: ethers.BigNumber) => farm.farmTotalSupply = parseFloat(ethers.utils.formatEther(n)))
        const p3 = pairContract.totalSupply().then((n: ethers.BigNumber) => farm.pairTotalSupply = parseFloat(ethers.utils.formatEther(n)))
        const p4 = minterContract.sharesOf(farm.contract).then((n: ethers.BigNumber) => farm.mintShare = parseFloat(ethers.utils.formatEther(n)))
        promises.push(p1, p2, p3, p4)

        if (this.isConnected) {
          const p5 = pairContract.balanceOf(this.userAddress).then((n: ethers.BigNumber) => farm.userLpBalance = parseFloat(ethers.utils.formatEther(n)))
          const p6 = pairContract.allowance(this.userAddress, farm.contract).then((n: ethers.BigNumber) => farm.userAllowance = parseInt(n.toString()))
          const p7 = farmContract.sharesOf(this.userAddress).then((n: ethers.BigNumber) => farm.userStakedBalance = parseFloat(ethers.utils.formatEther(n)))
          const p8 = farmContract.estimateRewardsOf(this.userAddress).then((n: ethers.BigNumber) => farm.userRewardsBalance = parseFloat(ethers.utils.formatEther(n)))
          promises.push(p5, p6, p7, p8)
        }
      }

      await Promise.all(promises)
      const padAddress = PAD[this.ecosystem]
      const padPrice = priceModel.getPriceUsd(padAddress)
      this.$store.commit('setPadPrice', padPrice)

      for (const farm of allFarms) {
        const isSingleToken = farm.token1 == farm.token2
        if (isSingleToken) {
          // TODO
          continue
        } else {
          const reserveUsd = priceModel.getReserveUsd(farm.acceptedToken)
          farm.lpPrice = reserveUsd / farm.pairTotalSupply!
          farm.poolValue = farm.poolSize! * padPrice
          farm.tvl = reserveUsd

          let dripRate
          let decay
          if (farm.type == FarmType.Regular) {
            farm.rewardTokenPrice = padPrice
            dripRate = 0.1
            decay = 0
            farm.roi = farm.poolSize! * farm.rewardTokenPrice * dripRate / (farm.lpPrice! * farm.farmTotalSupply!)
          } else if (farm.type == FarmType.Partner) {
            const rewardTokenAddress = TOKENS[farm.rewardToken!]
            farm.rewardTokenPrice = priceModel.getPriceUsd(rewardTokenAddress)
            dripRate = 0.0069
            decay = 0.0075
            farm.roi = farm.poolSize! * farm.rewardTokenPrice * dripRate / (farm.lpPrice! * farm.farmTotalSupply!)
          } else {
            farm.rewardTokenPrice = 1
            dripRate = 0.0075
            decay = 0.0075
            farm.roi = farm.poolSize! * dripRate / farm.farmTotalSupply!
          }

          farm.apy = this.getApy(farm.roi, decay)
        }
      }
    },
    getApy(roi: number, decay: number) {
      let initial = 100
      for (let i = 0; i < 365; i++) {
        initial += initial * roi
        roi -= roi * decay
      }
      return Math.round(100 * (initial - 100)) / 10000
    }
  }
})
</script>

<style scoped>
.v-sheet {
  width: 100%;
  background-color: #000000;
}
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
  min-width: 100px;
}
.padswap-ecosystem-tabs .v-tab--active {
  color: #66015e !important;
}

.padswap-farm-type-tabs {
  width: 180px;
  max-width: 180px;
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

.v-text-field /deep/ .v-icon {
  opacity: 0.5;
}
</style>