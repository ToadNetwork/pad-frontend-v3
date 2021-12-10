<template>
  <v-container>
    <div class="padswap-header-box">
      <slider-tabs
        class="padswap-ecosystem-tabs"
        :value="1"
      >
        <v-tab>Toad</v-tab>
        <v-tab>Pad</v-tab>
      </slider-tabs>
      <v-img src="../assets/Toad Pad.png" />
      <div style="font-size: 36px; margin-top: 20px;">Pad Farms</div>
      <div style="font-size: 14px; color: #B3B8C1; margin-top: 10px;">Stake tokens to earn PAD, LP and partner tokens.</div>
    </div>
    <v-sheet style="margin-top: 60px;">
      <v-card>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <slider-tabs class="padswap-farm-type-tabs">
              <v-tab>V2&nbsp;Farms</v-tab>
              <v-tab>Retiring</v-tab>
            </slider-tabs>

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
        <farm />
        <farm v-for="i in 5" :key="i" />
      </v-card>
      <v-card class="padswap-farms mt-6 pa-3">
        <div class="mx-5 padswap-farm-title padswap-farm-title-shadow mb-4">LP Farms</div>
        <farm v-for="i in 2" :key="i" />
      </v-card>
      <v-card class="padswap-farms mt-6 pa-3">
        <div class="mx-5 padswap-farm-title padswap-farm-title-shadow mb-4">Partner Farms</div>
        <farm v-for="i in 2" :key="i" />
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Farm from '../components/Farm.vue'
import SliderTabs from '../components/SliderTabs.vue'

export default Vue.extend({
  name: 'Home',
  components: { Farm, SliderTabs }
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

.padswap-ecosystem-tabs {
  margin-bottom: 70px;
}
.padswap-ecosystem-tabs /deep/ .v-tabs-bar {
  background: #FFFFFF;
}
.padswap-ecosystem-tabs /deep/ .v-tabs-slider-wrapper {
  background: linear-gradient(180deg, #F99DF3 0%, #FA77F1 100%);
}
.padswap-ecosystem-tabs .v-tab {
  padding: 11px 0px;
  font-weight: bold;
  color: #595E67 !important;
  min-width: 87px;
}
.padswap-ecosystem-tabs .v-tab--active {
  color: #920087 !important;
}

.padswap-farm-type-tabs /deep/ .v-tabs-bar {
  background: #292D38;
}
.padswap-farm-type-tabs .v-tab {
  color: #879CA5 !important;
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
</style>