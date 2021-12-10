<template>
  <div style="margin-bottom: 5px">
    <v-card
      @click="expand = !expand"
      class="padswap-farm d-flex align-center justify-space-between"
      :class="isDetailsVisible ? 'padswap-farm-expanded' : ''"
    >
      <div class="d-flex align-center" style="width: 15%">
        <v-img
          :src="require(`../assets/tokens/${token0}.svg`)"
          class="padswap-token-img"
        />
        <v-img
          :src="require(`../assets/tokens/${token1 ? token1 : token0}.svg`)"
          class="padswap-token-img mr-4"
          style="margin-left: -5px"
          contain
        />
        <div class="padswap-farm-title">{{ name }}</div>
      </div>
      <div class="d-flex align-center justify-space-between flex-grow-1" style="max-width: 50%">
        <div class="d-flex" style="flex-direction: column;">
          <div class="padswap-farm-data-title">YEARLY APY</div>
          <div class="padswap-farm-data-item">417.04%</div>
        </div>
        <div class="d-flex" style="flex-direction: column;">
          <div class="padswap-farm-data-title">DAILY ROI</div>
          <div class="padswap-farm-data-item">0.45%</div>
        </div>
        <div class="d-flex" style="flex-direction: column;">
          <div class="padswap-farm-data-title">PAD EARNED</div>
          <div class="padswap-farm-data-item">~</div>
        </div>
      </div>
      <div class="flex-shrink-1">
        <v-btn class="padswap-farm-btn mr-5">
          Enable
        </v-btn>
        <v-icon
          color="#00FC4C"
        >
          {{ expand ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </v-icon>
      </div>
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
              <v-col>POOL&nbsp;SIZE:</v-col>
              <v-col>200.468M PAD</v-col>
            </v-row>
            <v-row>
              <v-col>POOL&nbsp;VALUE:</v-col>
              <v-col>$2.60K</v-col>
            </v-row>
            <v-row>
              <v-col>LP/TOKEN&nbsp;PRICE:</v-col>
              <v-col>$0.1434</v-col>
            </v-row>
          </v-container>
          <v-container class="padswap-farm-data">
            <v-row>
              <v-col>{{ name }}&nbsp;BALANCE:</v-col>
              <v-col>102.9179</v-col>
            </v-row>
            <v-row>
              <v-col>{{ name }}&nbsp;STAKED:</v-col>
              <v-col>3283.949974</v-col>
            </v-row>
            <v-row>
              <v-col>STAKED&nbsp;VALUE</v-col>
              <v-col class="padswap-pink">$470.91</v-col>
            </v-row>
            <v-row>
              <v-col>EARNED&nbsp;VALUE:</v-col>
              <v-col class="padswap-pink">$11.3122</v-col>
            </v-row>
          </v-container>
          <div class="d-flex flex-column flex-grow-1" style="width: 100%">
            <div class="d-flex flex-column padswap-deposit-withdraw-box">
              <div class="d-flex mb-2">
                <div class="padswap-action padswap-selected-action">Deposit</div>
                <div class="padswap-action ml-7">Withdraw</div>
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
                  Deposit
                </v-btn>
              </div>
              <div class="padswap-dw-balance">
                PAD-BNB BALANCE: 
                <span class="padswap-dw-balance-amount">102.9179</span>
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

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'Farm',
  props: {
    name: String
  },
  data() {
    const [token0, token1] = this.name.split('-')
    return {
      expand: false,
      isDetailsVisible: false,
      token0,
      token1
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
.padswap-deposit-withdraw-box {
  border: 1px solid #595E67;
  border-radius: 15px;
  padding: 10px 20px;
}
.padswap-action {
  color: #979CA5;
  font-size: 16px;
}
.padswap-action.padswap-selected-action {
  color: #FB53EF;
  text-decoration: underline;
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