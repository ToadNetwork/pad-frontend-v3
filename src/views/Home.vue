<template>
  <v-container>
    <div class="padswap-header-box">
      <slider-tabs
        class="padswap-ecosystem-tabs"
        v-model="ecosystem"
      >
        <v-tab class="d-flex flex-column">
          <v-img style="max-height: 30px; max-width: 30px;" src="../assets/tokens/PAD.svg" />
          <div>BSC</div>
        </v-tab>
        <v-tab class="d-flex flex-column">
          <v-img style="max-height: 30px; max-width: 30px;" src="../assets/tokens/PAD.svg" />
          <div>Moonriver</div>
        </v-tab>
        <v-tab class="d-flex flex-column">
          <v-img style="max-height: 30px; max-width: 30px;" src="../assets/tokens/TOAD.svg" />
          <div>Toad</div>
        </v-tab>
      </slider-tabs>
      <v-subheader class="padswap-ecosystem-subheader">Select ecosystem</v-subheader>

      <v-img src="../assets/Toad Pad.png" />
      <div style="font-size: 36px; margin-top: 20px;">Pad Farms</div>
      <div style="font-size: 14px; color: #B3B8C1; margin-top: 10px;">Stake tokens to earn PAD, LP and partner tokens.</div>
    </div>
    <v-sheet style="margin-top: 60px;">
      <v-card class="d-flex align-center flex-wrap flex-md-nowrap justify-space-around justify-md-start">
        <slider-tabs
          v-model="farmType"
          class="padswap-farm-type-tabs mr-0"
        >
          <v-tab>V2&nbsp;Farms</v-tab>
          <v-tab>Retiring</v-tab>
        </slider-tabs>
        <div class="d-flex align-center px-sm-5 mr-md-auto">
          <v-switch /> Staked
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
            :items="['Hot']"
            value="Hot"
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
        />
      </v-card>
      <v-card class="padswap-farms mt-6 pa-3">
        <div class="mx-5 padswap-farm-title padswap-farm-title-shadow mb-4">LP Farms</div>
        <farm
          v-for="farm in displayedFarms.lpFarms"
          :key="farm.contract"
          :name="farm.name"
        />
      </v-card>
      <v-card class="padswap-farms mt-6 pa-3">
        <div class="mx-5 padswap-farm-title padswap-farm-title-shadow mb-4">Partner Farms</div>
        <farm
          v-for="farm in displayedFarms.partnerFarms"
          :key="farm.contract"
          :name="farm.name"
        />
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Farm from '../components/Farm.vue'
import SliderTabs from '../components/SliderTabs.vue'
import farmsBsc from '../farms_config_bsc.json'
import farmsMoonriver from '../farms_config_movr.json'

// TODO: config
const farmsToad = {
  regularFarms: { farms: [], retiredFarms: [] },
  lpFarms: { farms: [] },
  partnerFarms: { farms: [] }
}

type FarmData = {
  name: String,
  contract: String,
  acceptedToken: String,
  token1: String,
  token2: String
}

enum FarmType {
  Default = 0,
  IncludeRetired = 1
}

enum Ecosystem {
  BSC = 0,
  Moonriver = 1,
  Toad = 2
}

export default Vue.extend({
  name: 'Home',
  components: { Farm, SliderTabs },
  data() {
    return {
      ecosystem: Ecosystem.BSC,
      farmType: FarmType.Default,
      searchText: ''
    }
  },
  computed: {
    displayedFarms() {
      let farms
      if (this.ecosystem == Ecosystem.Toad) {
        farms = farmsToad
      } else if (this.ecosystem == Ecosystem.Moonriver) {
        farms = farmsMoonriver
      } else {
        farms = farmsBsc
      }

      const visibleFarms = {
        regularFarms: Array.from<FarmData>(farms.regularFarms.farms),
        lpFarms: Array.from<FarmData>(farms.lpFarms.farms),
        partnerFarms: Array.from<FarmData>(farms.partnerFarms.farms)
      }

      if (this.farmType == FarmType.IncludeRetired) {
        visibleFarms.regularFarms.push(...farms.regularFarms.retiredFarms)
      }

      if (this.searchText) {
        visibleFarms.regularFarms = visibleFarms.regularFarms.filter(f => f.name.toLowerCase().includes(this.searchText.toLowerCase()))
        visibleFarms.lpFarms = visibleFarms.lpFarms.filter(f => f.name.toLowerCase().includes(this.searchText.toLowerCase()))
        visibleFarms.partnerFarms.filter(f => f.name.toLowerCase().includes(this.searchText.toLowerCase()))
      }

      return visibleFarms
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
  margin-bottom: 55px;
  height: auto;
}
.padswap-ecosystem-tabs /deep/ .v-tabs-bar {
  background: #FFFFFF;
}
.padswap-ecosystem-tabs /deep/ .v-tabs-slider-wrapper {
  background: linear-gradient(180deg, #F99DF3 0%, #FA77F1 100%);
}
.padswap-ecosystem-tabs .v-tab {
  padding: 10px 0px;
  font-weight: bold;
  color: #595E67 !important;
  min-width: 100px;
}
.padswap-ecosystem-tabs .v-tab--active {
  color: #920087 !important;
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