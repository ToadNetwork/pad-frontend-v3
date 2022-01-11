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

    <div class="text-center">
      <v-img
        :src="$padswapTheme.theme.headerLogoSrc"
        contain
        height="150px"
        width="500px"
        style="max-width: 70vw; display: inline-block"
        />
    </div>

    <div class="main-container">

    <div class="info-link" >
        Having issues? <a id="new-tab-link" href="https://padswap.exchange/#/swap" target="_blank">Try opening the swap in a separate tab </a>
        <v-icon small>mdi-open-in-new</v-icon>
    </div>
    	<div id="swap-iframe-container">
    		<div class="menu-mask"></div>
				<iframe id="swap-iframe" class="swap-ui" src="./bsc/index.html"></iframe>
			</div>
		</div>

    <BackToDashboard style="margin-top: 40px; margin-bottom: 300px;" />

  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import BackToDashboard from '@/components/BackToDashboard.vue'
import SliderTabs from '@/components/SliderTabs.vue'
import { EcosystemId } from '@/ecosystem'


function setSwapEcosystem(chain_id : string) {
	let iframe : HTMLIFrameElement
  let link : HTMLLinkElement
	iframe = document.getElementById("swap-iframe")! as HTMLIFrameElement
  link = document.getElementById("new-tab-link")! as HTMLLinkElement

  iframe.addEventListener("load", function() {
    this.contentWindow!.document.querySelector('body')!.style.background = 'transparent'
    this.contentWindow!.document.querySelector<HTMLElement>('#root > div.sc-hlWvWH.dgxEoC > div > nav')!.style.visibility = 'hidden'
  })

  if (chain_id == "BSC") {
    iframe.src = "./bsc/index.html"
    link!.href = "./bsc/index.html"
  }
  if (chain_id == "MOVR") {
    iframe.src = "./movr/index.html"
    link!.href = "./movr/index.html"
  }
  if (chain_id == "GLMR") {
    iframe.src = "./glmr/index.html"
    link!.href = "./glmr/index.html"
  }
}

    

export default Vue.extend({
  name: 'Swap',
  components: { SliderTabs, BackToDashboard },
  data() {
    return {
      active: true,
      farmViewOption: null,
      stakedOnly: false,
      includeRetired: false,
      sortBy: 'Earned',
      searchText: ''
    }
  },
  mounted () {
    const iframe = document.getElementById('swap-iframe') as HTMLIFrameElement
    iframe.addEventListener("load", function() {
      this.contentWindow!.document.querySelector('body')!.style.background = 'transparent'
      this.contentWindow!.document.querySelector<HTMLElement>('#root > div.sc-hlWvWH.dgxEoC > div > nav')!.style.visibility = 'hidden'
    })
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
        if (val == 0) {
        	setSwapEcosystem("BSC")
        }
        else if (val == 1) {
        	setSwapEcosystem("MOVR")
        }
        else if (val == 2) {
          setSwapEcosystem("GLMR")
        }
      }
    },
  },
  watch: {
    ecosystemId() {
      this.$padswapTheme.theme = this.$store.getters.ecosystem.theme
      this.farmViewOption = null
    },
  }
})
</script>

<style scoped>

#swap-iframe-container {
	position: relative;
	display: inline-block;
	height: 1000px;
	width: 100%;
	max-width: 700px;
	border: none;
	border-radius: 30px;
  overflow: hidden;
}

#swap-iframe {
	height: 1000px;
	width: 100%;
	max-width: 700px;
	border: none;
	border-radius: 30px;
  overflow: hidden;
}

.main-container {
	text-align: center;
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


</style>