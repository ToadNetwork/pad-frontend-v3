<template>
  <v-container class="padswap-header-box">
    <div class="padswap-farm-picker" style="margin-bottom: 70px;">
      <div class="padswap-farm-picker-left padswap-toad-picker">Toad</div>
      <div class="padswap-farm-picker-right padswap-pad-picker">Pad</div>
    </div>
    <v-img src="../assets/Toad Pad.png" />
    <div style="font-size: 36px; margin-top: 20px;">Pad Farms</div>
    <div style="font-size: 14px; color: #B3B8C1; margin-top: 10px;">Stake tokens to earn PAD, LP and partner tokens.</div>
    <v-sheet style="margin-top: 60px;">
    <v-card>
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
        <div class="padswap-farm-picker">
          <div class="padswap-farm-picker-left padswap-v2farms-picker">
            V2 Farms
          </div>
          <div class="padswap-farm-picker-right padswap-retiringfarms-picker">
            Retiring
          </div>
        </div>
        <div class="d-flex align-center ml-5">
          <v-switch /> Staked
        </div>
        </div>
        <div class="d-flex align-center">
          Sort by:
          <v-select
            solo
            hide-details="true"
            class="ml-2"
            background-color="#292D38"
            rounded
            :items="['Hot']"
            value="Hot"
          />
          <div class="mx-3"></div>
          Search
          <v-text-field
           solo
           hide-details="true"
           background-color="#292D38"
           rounded
           class="ml-2"
           placeholder="Enter Token Name"
           append-icon="mdi-magnify"
          />
        </div>
      </div>
    </v-card>
    <v-card class="padswap-farms mt-4 pa-3">
      <div class="mx-5 padswap-farm-title padswap-farm-title-shadow mb-4">Regular Farms</div>

      <v-card
        v-for="i in 6"
        :key="i"
        class="d-flex align-center justify-space-between"
      >
        <div class="d-flex align-center">
          <v-img src="../assets/tokens/BNB.png" class="padswap-token-img" />
          <v-img src="../assets/tokens/BUSD.png" class="padswap-token-img mr-4" style="margin-left: -5px;" />
          <div class="padswap-farm-title">BNB-BUSD</div>
        </div>
        <div class="d-flex align-center justify-space-between" style="width: 45%;">
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
        <div>
          <v-btn
            rounded
            class="padswap-farm-btn mr-5"
          >
            Enable
          </v-btn>
          <v-icon color="#00FC4C">mdi-chevron-down</v-icon>
        </div>
      </v-card>
    </v-card>
    </v-sheet>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'Home'
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

.padswap-header-box {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.padswap-farm-picker {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  background: #FFFFFF;
  box-sizing: border-box;
  border-radius: 100px;
  font-size: 14px;
  font-weight: bold;
}
.padswap-toad-picker {
  color: #595E67;
  padding: 10px 29px;
}
.padswap-pad-picker {
  background: linear-gradient(180deg, #F99DF3 0%, #FA77F1 100%);
  color: #920087;
  border-radius: 100px;
  padding: 10px 28px;
}
.padswap-v2farms-picker {
  color: #181D26;
  padding: 7px 15px;
}
.padswap-retiringfarms-picker {
  color: #879CA5;
  background: #292D38;
  border-radius: 100px;
  padding: 7px 15px;
  font-weight: 500;
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
.padswap-farms .v-card {
  padding-top: 30px;
  padding-bottom: 30px;
  margin-bottom: 5px;
}
.padswap-token-img {
  height: 30px;
  width: 30px;
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
</style>