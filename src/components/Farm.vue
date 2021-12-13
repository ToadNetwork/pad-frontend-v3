<template>
  <div style="margin-bottom: 5px">
    <v-card
      @click="expand = !expand"
      class="padswap-farm d-flex align-center justify-space-between"
      :class="isDetailsVisible ? 'padswap-farm-expanded' : ''"
    >
      <div class="d-flex align-center" style="width: 15%">
        <v-img
          :src="require(`../assets/tokens/${chain.toLowerCase()}/${token0}.svg`)"
          class="padswap-token-img"
        />
        <v-img
          :src="require(`../assets/tokens/${chain.toLowerCase()}/${token1 ? token1 : token0}.svg`)"
          class="padswap-token-img mr-4"
          style="margin-left: -5px"
          contain
        />
        <div class="padswap-farm-title">{{ name }}</div>
      </div>
      <div
        class="d-flex align-center justify-space-between flex-grow-1 ml-10"
        style="max-width: 55%"
      >
        <div class="d-flex flex-column" style="min-width: 33.3%">
          <div class="padswap-farm-data-title">YEARLY APY</div>
          <div class="padswap-farm-data-item">{{ apy | formatPercent }}</div>
        </div>
        <div class="d-flex flex-column" style="min-width: 33.3%">
          <div class="padswap-farm-data-title">DAILY ROI</div>
          <div class="padswap-farm-data-item">{{ roi | formatPercent }}</div>
        </div>
        <div class="d-flex flex-column" style="min-width: 33.3%">
          <div class="padswap-farm-data-title">PAD EARNED</div>
          <div class="padswap-farm-data-item">
            <template v-if="userRewardsBalance">
              {{ userRewardsBalance | formatDecimals(4) }}
              <div class="padswap-farm-note">
                Earned value:
                <span class="padswap-farm-note-value">
                  ${{ earnedValue | formatDecimals(4) }}
                </span>
              </div>
            </template>
            <template v-else>
              ~
            </template>
          </div>
        </div>
      </div>
      <div class="flex-shrink-1">
        <v-btn class="padswap-farm-btn mr-5">
          <template v-if="isEnabled">
            Harvest
          </template>
          <template v-else>
            Enable
          </template>
        </v-btn>
        <v-icon
          color="#00FC4C"
        >
          {{ expand ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </v-icon>
      </div>
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
          class="padswap-farm-details d-flex align-baseline justify-space-between"
        >
          <v-container class="padswap-farm-data">
            <v-row>
              <v-col class="padswap-pink">
                GET {{ name }}
                <v-icon dense>mdi-arrow-top-right</v-icon>
              </v-col>
              <v-col></v-col>
            </v-row>
            <v-row>
              <v-col>TVL:</v-col>
              <!-- TODO: unify formatting -->
              <v-col>${{ tvl | formatUnits('K') }}</v-col>
            </v-row>
            <v-row>
              <v-col>POOL&nbsp;SIZE:</v-col>
              <v-col>{{ poolSize | formatUnits('M') }} PAD</v-col>
            </v-row>
            <v-row>
              <v-col>POOL&nbsp;VALUE:</v-col>
              <v-col>${{ poolValue | formatUnits('K') }}</v-col>
            </v-row>
            <v-row>
              <v-col>LP/TOKEN&nbsp;PRICE:</v-col>
              <v-col>${{ lpPrice | formatUnits() }}</v-col>
            </v-row>
          </v-container>
          <v-container class="padswap-farm-data">
            <v-row>
              <v-col>{{ name }}&nbsp;BALANCE:</v-col>
              <v-col>{{ userLpBalance | formatDecimals(4) }}</v-col>
            </v-row>
            <v-row>
              <v-col>{{ name }}&nbsp;STAKED:</v-col>
              <v-col>{{ userStakedBalance | formatDecimals(4) }}</v-col>
            </v-row>
            <v-row>
              <v-col>STAKED&nbsp;VALUE</v-col>
              <v-col class="padswap-pink">${{ stakedLpValue | formatDecimals(2) }}</v-col>
            </v-row>
            <v-row>
              <v-col>EARNED&nbsp;VALUE:</v-col>
              <v-col class="padswap-pink">${{ earnedValue | formatDecimals(4) }}</v-col>
            </v-row>
          </v-container>
          <div class="d-flex flex-column flex-grow-1" style="width: 100%">
            <div class="d-flex flex-column padswap-deposit-withdraw-box">
              <div class="d-flex mb-2">
                <div
                  @click="detailsAction = 'deposit'"
                  :class="{ 'padswap-selected-action': detailsAction == 'deposit' }"
                  class="padswap-action"
                >
                  Deposit
                </div>
                <div
                  @click="detailsAction = 'withdraw'"
                  :class="{ 'padswap-selected-action': detailsAction == 'withdraw' }"
                  class="padswap-action ml-7"
                >
                  Withdraw
                </div>
              </div>
              <div class="d-flex mb-1">
                <v-text-field
                  solo
                  outlined
                  rounded
                  dense
                  background-color="#71767F"
                  hide-details
                  append-icon
                  class="mr-3"
                  height="40px">
                  <template v-slot:append>
                    <v-btn
                      x-small
                      color="#595E67"
                      class="padswap-max-btn mr-n3">
                      Max
                    </v-btn>
                  </template>
                </v-text-field>
                <v-btn
                  class="padswap-farm-btn pa-5"
                >
                  {{ detailsAction == 'deposit' ? 'Deposit' : 'Withdraw' }}
                </v-btn>
              </div>
              <div class="padswap-dw-balance">
                <template v-if="detailsAction == 'deposit'">
                  {{ name }} BALANCE:
                </template>
                <template v-else>
                  {{ name }} STAKED:
                </template>
                <span class="padswap-dw-balance-amount">
                  <template v-if="detailsAction == 'deposit'">
                    {{ userLpBalance | formatDecimals(4) }}
                  </template>
                  <template v-else>
                    {{ userStakedBalance | formatDecimals(4) }}
                  </template>
                </span>
              </div>
            </div>
            <v-subheader class="d-flex align-baseline px-0 mt-3">
              <v-icon small class="mr-2">mdi-information-outline</v-icon>
              <div>V2 Farms: 1% fee when staking and unstaking. This fee goes to the PadSwap vault.</div>
            </v-subheader>
          </div>
        </v-card>
      </div>
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { FARM_ALLOWANCE } from '@/constants'

export default Vue.extend({
  name: 'Farm',
  props: {
    name: String,
    chain: String,
    roi: Number,
    apy: Number,
    poolSize: Number,
    poolValue: Number,
    tvl: Number,
    lpPrice: Number,
    rewardTokenPrice: Number,
    userLpBalance: Number,
    userStakedBalance: Number,
    userRewardsBalance: Number,
    userAllowance: Number
  },
  data() {
    const [token0, token1] = this.name.split('-')
    return {
      expand: false,
      isDetailsVisible: false,
      detailsAction: 'deposit',
      token0,
      token1
    }
  },
  computed: {
    isLoading(): boolean {
      if (!(this.name as any).includes('-')) {
        return false // TODO: remove
      }
      return this.roi === undefined
    },
    isEnabled(): boolean {
      console.log(this.userAllowance)
      return this.userAllowance !== undefined && this.userAllowance >= FARM_ALLOWANCE
    },
    stakedLpValue(): number {
      if (!this.userStakedBalance) {
        return 0
      }

      return (this.userStakedBalance as number) * (this.lpPrice as number)
    },
    earnedValue(): number {
      if (!this.userRewardsBalance) {
        return 0
      }

      return (this.userRewardsBalance as number) * (this.rewardTokenPrice as number)
    }
  },
  filters: {
    formatPercent(val: number | null) {
      val = val ?? 0
      const formatted = val.toLocaleString(undefined, {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
      return formatted.replaceAll(',', '')
    },
    formatUnits(val: number, units: string) {
      let denom = 1e0
      if (units == 'M') {
        denom = 1e6
      } else if (units == 'K') {
        denom = 1e3
      }

      const formatted = (val / denom).toLocaleString(undefined, {
        maximumFractionDigits: 3
      })
      return `${formatted}${units || ''}`.replaceAll(',', '')
    },
    formatDecimals(val: number, maxDecimals: number) {
      val = val ?? 0
      const formatted = val.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: maxDecimals
      })
      return formatted.replaceAll(',', '')
    }
  }
})
</script>

<style scoped>
.padswap-farm {
  background: #181D26 !important;
  border-radius: 15px !important;
  width: 100%;
  color: #B3B8C1 !important;
  padding: 30px !important;
  font-family: Roboto;
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
  padding: 30px;
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
}
.padswap-token-img {
  max-width: 30px;
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
.padswap-farm-data-title {
  font-size: 12px;
  color: #71767F;
}
.padswap-farm-data-item {
  font-size: 24px;
  color: #FFFFFF;
}
.padswap-farm-note {
  font-size: 12px;
  color: #979CA5;
}
.padswap-farm-note-value {
  color: #FB53EF;
}
.padswap-deposit-withdraw-box {
  border: 1px solid #595E67;
  border-radius: 15px;
  padding: 10px 20px;
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
  border: solid 1px #979CA5;
  width: 330px;
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
</style>