<template>
  <v-container>

    <div class="iframe-container">
      <iframe :src="iframeSrc" ref="gameIframe" class="game-iframe">
      </iframe>
    </div>

  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { ethers } from 'ethers'
  import { Client, WriteStorageObject } from "@heroiclabs/nakama-js"
  import { providers } from '@0xsequence/multicall'
  import { delay, toFloat } from '@/utils'
  import { IEcosystem, EcosystemId, ChainId } from '@/ecosystem'
  import {
    PADSWAP_PAIR_ABI,
    ERC20_ABI,
  } from '../constants'


  // @ts-ignore:disable-next-line
  import VueCryptojs from 'vue-cryptojs';
  Vue.use(VueCryptojs)

  export default Vue.extend({
    data () {
      return {
        active: <boolean> true,
        toadMarketCap: <number> 0,
        padMarketCap: <number> 0,

        client: <any> null,
        session: <any> null,
        account: <any> null,

        gameSrc: <string> "./memeguardians-executable/index.html",
        iframeSrc: <string> "./memeguardians-executable/index.html"
      }
    },
    created () {
      this.$store.commit('setEcosystemId', 2)
      setInterval(async () => {
        await this.updateWalletData()
      }, 1000)
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
      address(): string {
        return this.$store.state.address
      },
      multicall(): ethers.providers.Provider {
        return this.$store.getters.multicall
      },
      ecosystem(): IEcosystem {
        return this.$store.getters.ecosystem
      },
      priceModel() : any {
        return this. $store.getters.ecosystem.priceModel
      },
      web3(): ethers.Signer | null {
        return this.$store.state.web3
      },
      chainId(): ChainId {
        return this.$store.getters.ecosystem.chainId
      },
      chainName(): string {
        return this.$store.getters.ecosystem.routeName
      },
    },
    beforeRouteLeave (to, from, next) {
      next()
    },
    methods: {
      async updateWalletData() {
        // TODO: Encrypt the data before sending

        var data : any = {
          "walletAddress": this.address
        }

        const moonbeamToadAddress = "0xf480f38c366daac4305dc484b2ad7a496ff00cea"
        const moonbeamPadAddress = "0x59193512877e2ec3bb27c178a8888cfac62fb32d"

        const padContract = new ethers.Contract(moonbeamPadAddress, ERC20_ABI, this.multicall)
        const toadContract = new ethers.Contract(moonbeamToadAddress, ERC20_ABI, this.multicall)

        const padAmount = await padContract.balanceOf(this.address)
        const toadAmount = await toadContract.balanceOf(this.address)

        data["tokens"] = {
          "TOAD": toadAmount,
          "PAD": padAmount
        }

        this.iframeSrc = this.gameSrc + "#" + JSON.stringify(data)
      },
      round(num : any, dec : any) {
        num = Number(num).toFixed(20)
        if(!Number.isFinite(Number(num))) num = '0.0'
        num = Number(num).toFixed(20)
        const regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${dec}})?`)
        let [int, decimals] = num.toString().replace(',', '.').split('.')
        if(dec == 0) return int
        const rounded = num.toString().match(regex)[0]
        return rounded
      },
    },
  })
</script>

<style scoped>

.iframe-container {
  margin: 0;
  padding: 0;
  position: fixed;
  top: 50px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 50px);
}

.game-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Header and TOAD stats */

.toad-stats-card * {
  height: 100%;
  min-width: 200px;
  font-family: Roboto Mono, monospace;
}

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

/*****************/
/* Content boxes */
/*****************/

.header-box {
	text-align: center;
	margin-top: 20px;
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
}

.header-img-container div {
  display: inline-block;
}

.rounded-box {
  background: linear-gradient(135deg, rgb(178 0 255 / 20%) 0%, rgb(84 0 255 / 20%) 100%);
  padding: 20px;
  border-radius: 20px;
  border: 1px solid rgb(0 166 255 / 26%);
}

.inner-rounded-box {
  background-color: rgba(0, 0, 0, 0.3);
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

/*****************/
/* Product cards */
/*****************/

.title-card-container {
  padding-top: 60px;
}

.title-card * {
  font-family: Roboto Mono, monospace;
}

.title-card, .title-card:before {
  z-index: 2;
  background-color: #000 !important;
  border: 1px solid rgb(0 166 255 / 26%);
  width: 210px;
  margin: 40px 15px;
  padding-bottom: 10px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgb(178 0 255 / 20%) 0%, rgb(84 0 255 / 20%) 100%);
}
.title-card:hover {
  border: 1px solid green;
}

.title-card .v-card__subtitle {
  padding: 10px 0 0 0 !important;
  font-size: 0.8em !important;
}

.title-card .icon-container {
  text-align: center;
  /*border-radius: 100px;*/
}

.title-card .icon-container img {
  padding: 10px;
  border-radius: 20px;
  border: 1px solid rgb(0 166 255 / 26%);
  overflow: show;
  height: 80px;
  width: 80px;
  margin-top: -30px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0.05) 100%);
}

.title-card-name {
  text-align: center;
  font-size: 1.2rem;
  color: white;
}

@media all and (max-width: 400px) {
  .title-card, .title-card:before {
    width: 85vw;
  }
}


</style>
