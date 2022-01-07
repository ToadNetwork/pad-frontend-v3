<template>
  <v-container class="padswap-farms-home">
    <div class="padswap-header-box">
      <slider-tabs
        class="padswap-ecosystem-tabs"
        v-model="ecosystem"
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
        Swap
      </div>
      <div style="font-size: 14px; color: #B3B8C1; margin-top: 10px;">Instantly exchange any tokens</div>
    </div>

    <div class="main-container">
    	<div id="swap-iframe-container">
    		<div class="menu-mask"></div>
				<iframe id="swap-iframe" class="swap-ui" src="https://padswap.exchange/#/swap"></iframe>
			</div>
		</div>

    <BackToDashboard style="margin-top: 10px; margin-bottom: 300px;" />

  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { ethers } from 'ethers'
import { providers } from '@0xsequence/multicall'
import AwaitLock from 'await-lock'
import { List } from 'linq-collections'

import BackToDashboard from '@/components/BackToDashboard.vue'
import SliderTabs from '@/components/SliderTabs.vue'

import { BscPadswapTheme, MoonriverPadswapTheme } from '@/padswap-theme'
import { Ecosystem } from '@/types'


function setSwapEcosystem(chain_id : string) {
	let iframe : HTMLIFrameElement
	iframe = document.getElementById("swap-iframe")! as HTMLIFrameElement
  		if (chain_id == "BSC") {
  			iframe.src =  "https://padswap.exchange/#/swap"
  		}
  		if (chain_id == "MOVR") {
  		iframe.src =  "https://movr.padswap.exchange/#/swap"
  		}
  	}

export default Vue.extend({
  name: 'Home',
  components: { SliderTabs, BackToDashboard },
  data() {
    return {
      active: true,
      farmViewOption: null,
      stakedOnly: false,
      includeRetired: false,
      sortBy: 'Earned',
      searchText: '',
      syncLocks: {
        [Ecosystem.BSC]: new AwaitLock(),
        [Ecosystem.Moonriver]: new AwaitLock()
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
    ecosystem: {
      get(): Ecosystem {
        return this.$store.state.ecosystem
      },
      set(val: Ecosystem) {
        this.$store.commit('setEcosystem', val)
        if (val == 0) {
        	setSwapEcosystem("BSC")
        }
        else {
        	setSwapEcosystem("MOVR")
        }
      }
    },
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
      this.farmViewOption = null
    },
  }
})
</script>

<style scoped>

#swap-iframe-container {
	position: relative;
	display: inline-block;
	height: 720px;
	width: 100%;
	max-width: 550px;
	border: none;
	border-radius: 10px;
  overflow: hidden;
}

#swap-iframe {
	height: 720px;
	width: 100%;
	max-width: 550px;
	border: none;
	border-radius: 10px;
  overflow: hidden;
}

.main-container {
	text-align: center;
}

.menu-mask {
	position: absolute;
	left: 0;
	top: 0;
	z-index: 999;
	height: 80px;
	width: 80px;
	background-color: black;
	border-radius: 10px;
}



.content-container {
	display: inline-block;
	max-width: 1200px;
	text-align: left;
	background-image: radial-gradient(circle farthest-side at 50% -20%,rgb(17 95 13 / 35%),#101722 78%);
	padding: 20px;
	border-radius: 20px;
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