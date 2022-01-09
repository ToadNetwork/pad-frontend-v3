<template>
  <v-container class="padswap-farms-home">
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
      </slider-tabs>
      <v-subheader class="padswap-ecosystem-subheader">Select ecosystem</v-subheader>

      <v-img
        :src="$padswapTheme.theme.toadPadImageSrc"
        contain
        height="105"
        width="100%"
      />
      <div style="font-size: 36px; margin-top: 20px;">
        PadSwap Farms
      </div>
      <div style="font-size: 14px; color: #B3B8C1; margin-top: 10px;">Stake tokens to earn PAD, LP and partner tokens.</div>
    </div>
    <v-sheet
      class="padswap-content-sheet"
      style="margin-top: 70px;"
    >
      <div class="padswap-widgets">
        <v-card
          class="d-flex align-center flex-wrap flex-md-nowrap justify-space-between px-0 justify-md-start"
          style="background: transparent"
        >
          <slider-tabs
            v-model="farmViewOption"
            class="padswap-farm-type-tabs mr-0"
          >
            <v-tab @click="toggleFarmViewOption(0)">PAD</v-tab>
            <v-tab @click="toggleFarmViewOption(1)">DPLP</v-tab>
            <v-tab @click="toggleFarmViewOption(2)">Partner</v-tab>
          </slider-tabs>
          <div class="d-flex align-center px-sm-5">
            <v-switch v-model="stakedOnly" /> Staked
          </div>
          <div class="d-flex align-center mr-md-auto">
            <v-switch v-model="includeRetired" /> Retired
          </div>
          <div class="d-flex align-center ml-md-2 mr-md-5 py-2">
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

        <v-row class="pt-3 pb-3">
          <v-col md="8" cols="12">
            <v-card
              class="py-4 px-2"
            >
              <v-row>
                <v-col
                  class="d-flex justify-center"
                  md="3"
                  cols="6"
                >
                  <div class="d-flex flex-column">
                    <div class="padswap-data-item">${{ totals.staked | formatNumberKM(2) }}</div>
                    <div class="padswap-data-title">TOTAL STAKED</div>
                  </div>
                </v-col>
                <v-col
                  class="d-flex justify-center"
                  md="3"
                  cols="6"
                >
                  <div class="d-flex flex-column">
                    <div class="padswap-data-item">${{ totals.rewards | formatNumberKM }}</div>
                    <div class="padswap-data-title">PENDING REWARDS</div>
                  </div>
                </v-col>
                <v-col
                  class="d-flex justify-center"
                  md="3"
                  cols="6"
                >
                  <div class="d-flex flex-column">
                    <div class="padswap-data-item">{{ totals.averageROI | formatPercent }}</div>
                    <div class="padswap-data-title">AVERAGE ROI</div>
                  </div>
                </v-col>
                <v-col
                  class="d-flex justify-center"
                  md="3"
                  cols="6"
                >
                  <div class="d-flex flex-column ml-sm-0 ml-n7">
                    <div class="padswap-data-item">{{ totals.averageAPY | formatPercent }}</div>
                    <div class="padswap-data-title">AVERAGE APY</div>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col md="4" cols="12">
            <v-card
              class="d-flex align-center flex-wrap flex-md-nowrap justify-space-around py-4 px-4"
            >
              <div class="d-flex flex-column">
                <div class="padswap-data-item">≈ ${{ totals.dailyUSD | formatNumberKM(2) }}</div>
                <div class="padswap-data-title">DAILY (EXPECTED)</div>
              </div>
              <div class="d-flex flex-column">
                <div class="padswap-data-item">≈ ${{ totals.dailyUSD * 7 | formatNumberKM(2) }}</div>
                <div class="padswap-data-title">WEEKLY (EXPECTED)</div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <v-card class="padswap-farms mt-4 pa-3">
        <div class="mx-5 padswap-farm-title padswap-farm-title-shadow mb-4">PAD Farms</div>
        <farm
          v-for="farm in displayedFarms.regularFarms"
          :key="farm.contract"
          :name="farm.name"
          :contract="farm.contract"
          :acceptedToken="farm.acceptedToken"
          :token1Address="farm.token1"
          :token2Address="farm.token2"
          :rewardToken="farm.rewardToken"
          :type="farm.type"
          :ecosystemId="ecosystemId"
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
          :token1Address="farm.token1"
          :token2Address="farm.token2"
          :rewardToken="farm.rewardToken"
          :type="farm.type"
          :ecosystemId="ecosystemId"
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
          :token1Address="farm.token1"
          :token2Address="farm.token2"
          :rewardToken="farm.rewardToken"
          :type="farm.type"
          :ecosystemId="ecosystemId"
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
import AwaitLock from 'await-lock'
import { List } from 'linq-collections'

import Farm from '@/components/Farm.vue'
import SliderTabs from '@/components/SliderTabs.vue'
import {
  PADSWAP_FARM_ABI,
  PADSWAP_LP_FARM_ABI,
  MINTER_ABI,
  PADSWAP_PAIR_ABI,
  MULTICALL_ADDRESS
} from '../constants'
import { IEcosystem, EcosystemId, ECOSYSTEMS } from '@/ecosystem'
import { formatMixin } from '@/format'
import { FarmType, FarmData, FarmSet } from '@/types'
import { delay } from '@/utils'

enum FarmViewOption {
  Regular = 0,
  DPLP = 1,
  Partner = 2
}

const TOKENS: {[address: string]: string} = {
  FUK: '0xa898bbb508c04be26af3d319b7775927afcb02af'
}

function toFloat(bn: ethers.BigNumber, units: number = 18) {
  return parseFloat(ethers.utils.formatUnits(bn, units))
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

const MIN_VISIBLE_STAKE = ethers.utils.parseEther('0.00000001')

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
  mixins: [formatMixin],
  components: { Farm, SliderTabs },
  data() {
    const farms = <Record<EcosystemId, FarmSet>> {}
    const syncLocks = <Record<EcosystemId, AwaitLock>> {}
    for (const ecosystem of Object.values(ECOSYSTEMS)) {
      farms[ecosystem.ecosystemId] = initializeFarmSet(ecosystem.farmSet)
      syncLocks[ecosystem.ecosystemId] = new AwaitLock()
    }

    return {
      farms,
      syncLocks,
      active: true,
      farmViewOption: null,
      stakedOnly: false,
      includeRetired: false,
      sortBy: 'Earned',
      searchText: ''
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
    currentFarmSet(): FarmSet {
      return this.farms[this.ecosystemId]
    },
    displayedFarms(): Object {
      const visibleFarms = {
        regularFarms: Array.from<FarmData>(this.currentFarmSet.regularFarms.farms),
        lpFarms: Array.from<FarmData>(this.currentFarmSet.lpFarms.farms),
        partnerFarms: Array.from<FarmData>(this.currentFarmSet.partnerFarms.farms)
      }

      if (this.includeRetired) {
        visibleFarms.regularFarms.push(...this.currentFarmSet.regularFarms.retiredFarms)
      }

      if (this.farmViewOption === FarmViewOption.Regular) {
        visibleFarms.lpFarms = []
        visibleFarms.partnerFarms = []
      } else if (this.farmViewOption === FarmViewOption.DPLP) {
        visibleFarms.regularFarms = []
        visibleFarms.partnerFarms = []
      } else if (this.farmViewOption === FarmViewOption.Partner) {
        visibleFarms.regularFarms = []
        visibleFarms.lpFarms = []
      }

      if (this.searchText) {
        visibleFarms.regularFarms = visibleFarms.regularFarms.filter(f => f.name.toLowerCase().includes(this.searchText.toLowerCase()))
        visibleFarms.lpFarms = visibleFarms.lpFarms.filter(f => f.name.toLowerCase().includes(this.searchText.toLowerCase()))
        visibleFarms.partnerFarms = visibleFarms.partnerFarms.filter(f => f.name.toLowerCase().includes(this.searchText.toLowerCase()))
      }

      if (this.stakedOnly) {
        visibleFarms.regularFarms = visibleFarms.regularFarms.filter(f => f.userStakedBalance !== undefined && f.userStakedBalance.gt(MIN_VISIBLE_STAKE))
        visibleFarms.lpFarms = visibleFarms.lpFarms.filter(f => f.userStakedBalance !== undefined && f.userStakedBalance.gt(MIN_VISIBLE_STAKE))
        visibleFarms.partnerFarms = visibleFarms.partnerFarms.filter(f => f.userStakedBalance !== undefined && f.userStakedBalance.gt(MIN_VISIBLE_STAKE))
      }

      let sortfn = (_1: FarmData, _2: FarmData) => 1
      if (this.sortBy == 'APY') {
        sortfn = (f1, f2) => f2.apy! - f1.apy!
      } else if (this.sortBy == 'TVL') {
        sortfn = (f1, f2) => f2.tvl! - f1.tvl!
      } else if (this.sortBy == 'Earned') {
        sortfn = (f1, f2) => f2.userRewardsBalance! * f2.rewardTokenPrice! - f1.userRewardsBalance! * f2.rewardTokenPrice!
      } else if (this.sortBy == 'Staked') {
        sortfn = (f1, f2) => toFloat(f2.userStakedBalance || ethers.BigNumber.from(0)) * f2.lpPrice! - toFloat(f1.userStakedBalance || ethers.BigNumber.from(0)) * f1.lpPrice!
      }
      visibleFarms.regularFarms.sort(sortfn)
      visibleFarms.lpFarms.sort(sortfn)
      visibleFarms.partnerFarms.sort(sortfn)

      return visibleFarms
    },
    totals(): Object {
      const allFarms: FarmData[] = []
      allFarms.push(...this.currentFarmSet.regularFarms.farms,
                    ...this.currentFarmSet.regularFarms.retiredFarms,
                    ...this.currentFarmSet.lpFarms.farms,
                    ...this.currentFarmSet.partnerFarms.farms)
      const farmsList = new List(allFarms)

      const totals: any = {
        staked: farmsList.sum(f => toFloat(f.userStakedBalance || ethers.BigNumber.from(0)) * f.lpPrice!),
        rewards: farmsList.sum(f => f.userRewardsBalance! * f.rewardTokenPrice!)
      }

      const weightedTotalROI = farmsList.sum(f => toFloat(f.userStakedBalance || ethers.BigNumber.from(0)) * f.lpPrice! * f.roi!)
      const weightedTotalAPY = farmsList.sum(f => toFloat(f.userStakedBalance || ethers.BigNumber.from(0)) * f.lpPrice! * f.apy!)
      totals.averageROI = weightedTotalROI / totals.staked
      totals.averageAPY = weightedTotalAPY / totals.staked

      const padPrice = this.$store.state.padPrice
      totals.dailyPAD = totals.staked * totals.averageROI / padPrice
      totals.dailyUSD = totals.staked * totals.averageROI

      for (const total in totals) {
        if (isNaN(totals[total])) {
          totals[total] = 0
        }
      }
      return totals
    },
    multicall(): ethers.providers.Provider {
      return new providers.MulticallProvider(this.ecosystem.dataseed, {
        batchSize: 300,
        timeWindow: 0,
        contract: MULTICALL_ADDRESS
      })
    },
    isConnected(): boolean {
      return this.$store.getters.isConnected
    },
    userAddress(): string {
      return this.$store.state.address
    },
    lastChainTransactionBlock(): Object {
      // access properties explicitly to trigger reactivity
      return Object.entries(this.$store.state.lastChainTransactionBlock)
    }
  },
  watch: {
    ecosystem(val) {
      this.$padswapTheme.theme = this.ecosystem.theme
      this.farmViewOption = null
      setTimeout(() => this.sync())
    },
    lastChainTransactionBlock() {
      setTimeout(() => this.sync())
    }
  },
  methods: {
    async sync() {
      const ecosystem = this.ecosystem
      const multicall = this.multicall
      const mutex = this.syncLocks[this.ecosystemId]
      await mutex.acquireAsync()

      try {
        await this.syncInternal(ecosystem, multicall)
      } finally {
        mutex.release()
      }
    },
    async syncInternal(ecosystem: IEcosystem, multicall: ethers.providers.Provider) {
      const priceModel = ecosystem.priceModel
      const allFarms: FarmData[] = []
      allFarms.push(...this.currentFarmSet.regularFarms.farms,
                    ...this.currentFarmSet.regularFarms.retiredFarms,
                    ...this.currentFarmSet.lpFarms.farms,
                    ...this.currentFarmSet.partnerFarms.farms)

      let mintSupply: number
      const minterContract = new ethers.Contract(ecosystem.minterAddress, MINTER_ABI, multicall)
      const blockNumber = await multicall.getBlockNumber()
      const promises = [
        priceModel.syncWithin(blockNumber, 12),
        minterContract.totalSupply().then((n: ethers.BigNumber) => mintSupply = parseFloat(ethers.utils.formatEther(n)))
      ]

      for (const farm of allFarms) {
        const farmContract = new ethers.Contract(farm.contract, farm.type == FarmType.LP ? PADSWAP_LP_FARM_ABI : PADSWAP_FARM_ABI, multicall)
        const pairContract = new ethers.Contract(farm.acceptedToken, PADSWAP_PAIR_ABI, multicall)
        const p1 = farm.type == FarmType.LP ? farmContract.dividendPool().then((n: ethers.BigNumber) => farm.poolSize = parseFloat(ethers.utils.formatEther(n)))
                                            : farmContract.farmPool().then((n: ethers.BigNumber) => farm.poolSize = parseFloat(ethers.utils.formatEther(n)))
        const p2 = farmContract.totalSupply().then((n: ethers.BigNumber) => farm.farmTotalSupply = parseFloat(ethers.utils.formatEther(n)))
        const p3 = pairContract.totalSupply().then((n: ethers.BigNumber) => farm.pairTotalSupply = parseFloat(ethers.utils.formatEther(n)))
        const p4 = minterContract.sharesOf(farm.contract).then((n: ethers.BigNumber) => farm.mintShare = parseFloat(ethers.utils.formatEther(n)))
        promises.push(p1, p2, p3, p4)

        if (this.isConnected) {
          const p5 = pairContract.balanceOf(this.userAddress).then((n: ethers.BigNumber) => farm.userLpBalance = n)
          const p6 = pairContract.allowance(this.userAddress, farm.contract).then((n: ethers.BigNumber) => farm.userAllowance = parseInt(n.toString()))
          const p7 = farmContract.sharesOf(this.userAddress).then((n: ethers.BigNumber) => farm.userStakedBalance = n)
          const p8 = farmContract.estimateRewardsOf(this.userAddress).then((n: ethers.BigNumber) => farm.userRewardsBalance = parseFloat(ethers.utils.formatEther(n)))
          promises.push(p5, p6, p7, p8)
        }
      }

      await Promise.all(promises)
      const padPrice = priceModel.getPriceUsd(ecosystem.padAddress)
      this.$store.commit('setPadPrice', padPrice)

      for (const farm of allFarms) {
        const isSingleStake = farm.token1 == farm.token2
        if (isSingleStake) {
          farm.lpPrice = priceModel.getPriceUsd(farm.acceptedToken)
          farm.tvl = farm.lpPrice * farm.farmTotalSupply!
        } else {
          const reserveUsd = priceModel.getReserveUsd(farm.acceptedToken)
          farm.lpPrice = reserveUsd / farm.pairTotalSupply!
          farm.tvl = reserveUsd
        }

        let dripRate
        let decay
        if (farm.type == FarmType.Regular) {
          dripRate = 0.1
          decay = 0
          farm.rewardTokenPrice = padPrice
          farm.roi = farm.poolSize! * farm.rewardTokenPrice * dripRate / (farm.lpPrice! * farm.farmTotalSupply!)
        } else if (farm.type == FarmType.Partner) {
          dripRate = 0.0069
          decay = 0.0075
          const rewardTokenAddress = TOKENS[farm.rewardToken!]
          farm.rewardTokenPrice = priceModel.getPriceUsd(rewardTokenAddress)
          farm.roi = farm.poolSize! * farm.rewardTokenPrice * dripRate / (farm.lpPrice! * farm.farmTotalSupply!)
        } else {
          dripRate = 0.0075
          decay = 0.0075
          farm.rewardTokenPrice = farm.lpPrice
          farm.roi = farm.poolSize! * dripRate / farm.farmTotalSupply!
        }

        farm.poolValue = farm.poolSize! * farm.rewardTokenPrice
        farm.apy = this.getApy(farm.roi, decay)
      }
    },
    getApy(roi: number, decay: number) {
      let initial = 100
      for (let i = 0; i < 365; i++) {
        initial += initial * roi
        roi -= roi * decay
      }
      return Math.round(100 * (initial - 100)) / 10000
    },
    toggleFarmViewOption(option: FarmViewOption) {
      if (this.farmViewOption === option) {
        setTimeout(() => this.farmViewOption = null)
      }
    }
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
  min-width: 120px;
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
</style>
