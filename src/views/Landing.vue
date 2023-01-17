<template>
  <v-container class="padswap-farms-home">

    <!-------------->
    <!-- Header ---->
    <!-------------->

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
      <div style="font-size: 14px; color: #B3B8C1; margin-top: 10px;">Truly decentralized, multi-chain DeFi ecosystem</div>
    </div>



    <!-------------------->
    <!-- Product list ---->
    <!-------------------->

    <!-- Button row -->
    <v-row class="justify-center title-card-container">
      <v-card
        href="/swap"
        class="title-card hover-rgb">
        <div class="icon-container">
          <img src="@/assets/icons/Swap Icon.svg">
        </div>
        <div class="title-card-name">Swap</div>
        <v-card-subtitle class="text-center" style="font-size: 1.05rem">Exchange tokens<br>on multiple chains.</v-card-subtitle>
      </v-card>

      <v-card
        href="/farms"
        class="title-card hover-rgb">
        <div class="icon-container">
          <img src="@/assets/icons/Farms Icon.svg">
        </div>
        <div class="title-card-name">Earn</div>
        <v-card-subtitle class="text-center" style="font-size: 1.05rem">
          Earn passive income<br>
          by providing liquidity<br>
          and staking it in farms.
        </v-card-subtitle>
      </v-card>


      <v-card
        href="/vault"
        class="title-card hover-rgb">
        <div class="icon-container">
          <img src="@/assets/icons/Vault Icon.svg">
        </div>
        <div class="title-card-name">Vault</div>
        <v-card-subtitle class="text-center" style="font-size: 1.05rem">Collects backing for PAD from service fees</v-card-subtitle>
      </v-card>

<!--       <v-card
        href="https://beta.nebul.ae/"
        target="_blank"
        class="title-card hover-rgb">
        <div class="icon-container">
          <img src="@/assets/icons/LaunchPAD Icon.svg">
        </div>
        <div class="title-card-name">Create</div>
        <v-card-subtitle class="text-center" style="font-size: 1.05rem">Our all-in-one DeFi suite for project owners</v-card-subtitle>
      </v-card> -->

<!--       <v-card
        href="/bridge"
        target="/blank"
        class="title-card hover-rgb">
        <div class="icon-container">
          <img src="@/assets/icons/Bridge Icon.svg">
        </div>
        <div class="title-card-name">Bridge</div>
        <v-card-subtitle class="text-center" style="font-size: 1.05rem">Transfer tokens<br>between supported chains.</v-card-subtitle>
      </v-card>
 -->
<!--       <v-card
        href="/vault"
        target="/blank"
        class="title-card hover-rgb">
        <div class="icon-container">
          <img src="@/assets/icons/Vault Icon.svg">
        </div>
        <div class="title-card-name">Vault</div>
        <v-card-subtitle class="text-center" style="font-size: 1.05rem">Creates backing for PAD<br>from PadSwap fees.</v-card-subtitle>
      </v-card> -->

<!--       <v-card
        href="https://meme-guardians.com/"
        target="/blank"
        class="title-card hover-rgb">
        <div class="icon-container">
          <img src="@/assets/icons/Games Icon.svg">
        </div>
        <div class="title-card-name">Meme Guardians</div>
        <v-card-subtitle class="text-center" style="font-size: 1.05rem">Our own online RPG, playable right now.</v-card-subtitle>
      </v-card> -->


    </v-row>


  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { ethers } from 'ethers'
  import { providers } from '@0xsequence/multicall'
  import { delay, toFloat } from '@/utils'
  import { IEcosystem, EcosystemId, ChainId } from '@/ecosystem'
  import {
    PADSWAP_PAIR_ABI,
    ERC20_ABI,
  } from '../constants'

  export default Vue.extend({
    data () {
      return {
        active: <boolean> true,
        toadMarketCap: <number> 0,
        padMarketCap: <number> 0,
      }
    },
    created () {
      // Setting ecosystem to bsc
      this.$store.commit('setEcosystemId', 2)
      setTimeout(async () => {
        setTimeout(async () => {
          await this.getData()
        }, 1000)
      }, 1000)
    },
    computed: {
      ecosystemId: {
        get(): EcosystemId {
          return this.$store.state.ecosystemId
        },
        set(val: EcosystemId) {
          this.$store.commit('setEcosystemId', val)
          setTimeout(async () => {
              setTimeout(async () => {
              await this.getData()
            }, 1000)
          }, 1000)
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
      biOrMiOrK(num : number) : string {
        if(num>=1e9) return this.round(num/1e9, 2) + 'BI'
        else if(num>=1e6) return this.round(num/1e6, 2) + 'M'
        else if (num>=1e3) return this.round(num/1e3, 2) + 'K'
        else if (num>= 1e2) return this.round(num, 2)
        else if (num >= 1) return this.round(num, 4)
        else return this.round(num, 6)
      },
      async getData() {
        const moonbeamToadAddress = "0xf480f38c366daac4305dc484b2ad7a496ff00cea"
        const moonbeamPadAddress = "0x59193512877e2ec3bb27c178a8888cfac62fb32d"

        const toadPrice = this.priceModel.getPriceUsd(moonbeamToadAddress)
        const padPrice = this.priceModel.getPriceUsd(moonbeamPadAddress)

        const padContract = new ethers.Contract(moonbeamPadAddress, ERC20_ABI, this.multicall)
        const padSupply = await padContract.totalSupply()

        this.toadMarketCap = toadPrice * 195000
        this.padMarketCap = padPrice * toFloat(padSupply)
      },
    },
  })
</script>

<style scoped>

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
