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


	<div class="main-container">
		<div class="content-container"> 
    <img class="background" :src="$padswapTheme.theme.backgroundTextureSrc">

			<!------------------->
			<!-- PadSwap logo --->
			<!------------------->

			<div class="header-box">
				<div class="header-img-container">
					<v-img
					:src="$padswapTheme.theme.headerLogoSrc"
					contain
					height="150px"
					width="500px"
					style="max-width: 70vw"
					/>
				</div>
      	<div style="font-size: 14px; color: #B3B8C1; margin-top: 10px;">One stop shop for your farming needs</div>
			</div>

			<!----------------->
			<!-- Your stake --->
			<!----------------->

			<v-row
			style="padding-top: 20px; padding-bottom: 20px;"
			align="center"
			justify="center">

				<v-col
				cols="12">
					<div class="rounded-box">
						<p class="text-center">Your stake</p>
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

						<div class="text-center" style="margin-top: 20px;">
							<router-link
            	to="/farms"
              style="display: inline-block;"
          		>
                <div
                class="padswap-farm-btn"
                style="padding: 10px; text-decoration: none;">
          	 		  Go to farms
                </div>
          		</router-link>
						</div>
					</div>
				</v-col>
			
			</v-row>

			<!--------------------->
			<!-- Stats sections --->
			<!--------------------->

			<v-row
			style="padding-top: 20px; padding-bottom: 20px;"
			align="center"
			justify="center">

				<v-col
				cols="12"
				md="5">
					<div class="rounded-box">
						<p class="text-center">Expected daily ROI</p>
						<div class="inner-rounded-box">
							<div class="padswap-data-item text-center">≈ ${{ totals.dailyUSD | formatNumberKM(2) }}
							</div>
						</div>
					</div>
				</v-col>

				<v-col
				cols="12"
				md="2">
					<v-img
					:src="$padswapTheme.theme.toadPadImageSrc"
					contain
					height="105"
					width="100%"
					/>
				</v-col>

				<v-col
				cols="12"
				md="5">
					<div class="rounded-box">
						<p class="text-center">Expected monthly ROI</p>
						<div class="inner-rounded-box">
							<div class="padswap-data-item text-center">≈ ${{ totals.dailyUSD * 30 | formatNumberKM(2) }}
							</div>
						</div>
					</div>
				</v-col>
			
			</v-row>

			<!-------------------------------->
			<!-- Get started with farming ---->
			<!-------------------------------->

			<v-row style="padding-top: 20px; padding-bottom: 20px;">

				<v-col
				cols="12">
					<div class="rounded-box">
						<p class="text-center">Get started with farming</p>
						<div class="inner-rounded-box">
							<v-row class="text-center"
							align="center"
							justify="center">
								<div class="tutorial-item-container">
									<a
									class="tutorial-item"
									href="/onramp"
									target="_self"
									>
										<v-icon large class="rounded-icon">mdi-cash-multiple</v-icon>
										<p>Buy BNB<br>with fiat</p>
									</a>
								</div>

								<v-icon>mdi-arrow-right</v-icon>

								<div class="tutorial-item-container">
									<a
									class="tutorial-item"
									href="/swap"
									target="_blank"
									>
									<v-icon large class="rounded-icon">mdi-swap-horizontal</v-icon>
									<p>Swap BNB for tokens<br>of your choice</p>
								</a>
								</div>

								<v-icon>mdi-arrow-right</v-icon>

								<div class="tutorial-item-container">
									<a
									class="tutorial-item"
									href="/swap"
									target="_blank"
									>
										<v-icon large class="rounded-icon">mdi-vector-link</v-icon>
										<p>Create a<br>liquidity pair</p>
									</a>
								</div>

								<v-icon>mdi-arrow-right</v-icon>

								<div class="tutorial-item-container">
									<a
									class="tutorial-item"
									href="/farms"
									target="_self"
									>
										<v-icon large class="rounded-icon">mdi-sprout-outline</v-icon>
										<p>Stake LP tokens<br> in a farm</p>
									</a>
								</div>

							</v-row>
						</div>

						<div class="info-link" style="padding-top: 15px;">
							Don't have a BNB wallet? Here's <a href="https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain" target="_blank">Binance's official guide for setting up Metamask </a>
							<v-icon small>mdi-open-in-new</v-icon>
						</div>

					</div>
				</v-col>

			</v-row>

		</div>
	</div>

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
import { EcosystemId, IEcosystem, ECOSYSTEMS } from '@/ecosystem'
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

.background {
  pointer-events: none;
  position: absolute;
  min-width: 100%;
  min-height: 100%;
  left: 0;
  top: 0;
  z-index: -1;
  opacity: 0.1;
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


/*******************************/
/* Dashboard content container */
/*******************************/

.main-container {
	text-align: center;
}

.content-container {
  z-index: 1;
  position: relative;
  overflow: hidden;

	display: inline-block;
	max-width: 1200px;
	text-align: left;
	background-image: radial-gradient(circle farthest-side at 50% -20%,rgb(17 95 13 / 35%),#101722 78%);
	padding: 20px;
	border-radius: 20px;
}

/*****************/
/* Content boxes */
/*****************/

.header-box {
	text-align: center;
	margin-top: 50px;
	margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: center;
}

.header-img-container {
	display: inline-block;
  width: 100%;
  text-align:;
	padding-left: 40px;
	padding-right: 30px;
	/*background-color: #84848466;*/
	/*border-radius: 20px;*/
	/*border: 1px solid #ffffff2e;*/
}

.header-img-container div {
  display: inline-block;
}

.rounded-box {
	background-color: #182326a3;
	padding: 20px;
	border-radius: 20px;
	/*border: 1px solid #ffffff2e;*/
}

.inner-rounded-box {
	background-color: #181d26;
	padding: 20px;
	border-radius: 10px;
	border: 1px solid #ffffff0f;
}

/***********************/
/* Informational links */
/***********************/

.info-link {
	display: inline-block;
	width: 100%;
	padding-top: 7px;
	text-align: center;
	color: white;
}
.info-link a {
	color: white;
}
.info-link a:hover {
	color: orange;
}


/****************************/
/* Get started with farming */
/****************************/

.tutorial-item-container {
	padding-top: 20px;
	padding-left: 20px;
	padding-right: 20px;
}

.tutorial-item {
	text-decoration: none;
	color: white;
}

.tutorial-item p {
	margin-top: 5px;
}

.tutorial-item .rounded-icon {
	padding: 40px;
	border-radius: 20%;
	border: 2px dashed rgba(255, 255, 255, 0.2);
}

/* Hover effect */
.tutorial-item:hover {
	color: orange;
}
.tutorial-item:hover .rounded-icon {
	border: 2px dashed orange;
}
.tutorial-item:hover .rounded-icon {
	border: 2px dashed orange;
	color: orange;
}

/****************/
/* Product list */
/****************/

.product-description {
	color: gray;
}


.padswap-farm-btn {
  border-radius: 100px;
  background: linear-gradient(180deg, #00FC4c 0%, #00D741 100%);
  color: #00310F;
  width: 220px;
  text-transform: none;
  font-size: 16px;
  font-weight: bold;
  font-family: Roboto Mono;
}
.padswap-farm-btn:hover {
  background: linear-gradient(180deg, #76ae88 0%, #1e843d 100%);
}
a { text-decoration: none !important; }
</style>
