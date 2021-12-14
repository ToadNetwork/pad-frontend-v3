<template>
  <v-app
   v-bind:style="{ 'background-image': `url(${$padswapTheme.theme.backgroundImageSrc})` }">
    <v-app-bar
      app
      dark
      flat
    >
      <div>
        <v-img
          :src="$padswapTheme.theme.headerLogoSrc"
          width="162.42px"
        />
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex align-center padswap-navbar">
        <nav-menu title="Toad">
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-News.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>News</div>
              <v-subheader>Latest news and announcements</v-subheader>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Toad.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>Toad Farms</div>
              <v-subheader>Earn tokens by providing liquidity</v-subheader>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Church.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>Temple</div>
              <v-subheader>Convert non-believers into hodlers</v-subheader>
            </v-list-item-content>
          </v-list-item>
        </nav-menu>
        <nav-menu title="Padswap">
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Swap.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>Swap</div>
              <v-subheader>Buy or sell tokens on PadSwap</v-subheader>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Pad.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>Pad Farms</div>
              <v-subheader>Earn tokens by providing liquidity</v-subheader>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Pad.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>Add Liquidity</div>
              <v-subheader>Create LP tokens to add to farms</v-subheader>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Vault.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>Vault</div>
              <v-subheader>PAD's backing reserves</v-subheader>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Chart.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>Stats</div>
              <v-subheader>Analyze token prices and volume</v-subheader>
            </v-list-item-content>
          </v-list-item>
        </nav-menu>
        <nav-menu title="Shop">
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Piramyd.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>Piramyd Store</div>
              <v-subheader>Official Toad Merch</v-subheader>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Amazon.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>Amazon Store</div>
              <v-subheader>Official Toad Merch</v-subheader>
            </v-list-item-content>
          </v-list-item>
        </nav-menu>
        <nav-menu title="Games" non-expandable />
        <nav-menu title="About">
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Wiki.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>TOAD Wiki</div>
              <v-subheader>Learn more about TOAD and PAD</v-subheader>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Academy.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>Toad Academy</div>
              <v-subheader>Learn more about crypto</v-subheader>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Audit.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>Toad Network Audit Report</div>
              <v-subheader>Contracts audit report by SpaceAudits</v-subheader>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Audit.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>PadSwap Audit Report</div>
              <v-subheader>Contracts audit report by SpaceAudits</v-subheader>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Paper.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>Toad Network White Paper</div>
              <v-subheader>Toad Network's White Paper</v-subheader>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Paper.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>PadSwap White Paper</div>
              <v-subheader>PadSwap's White Paper</v-subheader>
            </v-list-item-content>
          </v-list-item>
        </nav-menu>
      </div>
      <div class="d-flex align-center padswap-navbar ml-4">
        <v-img
          :src="$padswapTheme.theme.padLogoSrc"
          style="width: 16px; height: 16px; margin-right: 6px; padding-right: 0px;"
        />
        <div style="color: #00FC4C;">
          ${{ padPrice | formatPrice }}
        </div>
        <div style="white-space: nowrap">EN<v-icon class="padswap-chevron-down">mdi-chevron-down</v-icon></div>
        <div
          @click="connectWallet"
          class="padswap-address-box"
          :class="{ 'padswap-connect': !isConnected }"
        >
          <template v-if="!isConnected">
            Connect
          </template>
          <template v-else>
            {{ $store.state.address | formatAddress }}
          </template>
        </div>
      </div>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import NavMenu from './components/NavMenu.vue'
import web3Modal from '@/wallet'
import { delay } from '@/utils'

export default Vue.extend({
  name: 'App',
  components: { NavMenu },
  data() {
    return {
      address: null
    }
  },
  computed: {
    ...mapGetters(['isConnected']),
    ...mapState(['padPrice'])
  },
  async mounted() {
    await delay(0)
    if (web3Modal.cachedProvider) {
      await this.connectWallet()
    }
  },
  methods: {
    async connectWallet() {
      if (this.isConnected) {
        return
      }

      this.$store.dispatch('requestConnect')
    }
  },
  filters: {
    formatAddress(val: string) {
      return val.substring(0, 3) + '...' + val.substring(val.length - 3)
    },
    formatPrice(val: number | null) {
      val = val ?? 0
      return val.toLocaleString(undefined, { maximumFractionDigits: 7 })
    }
  }
})
</script>

<style scoped>
@font-face {
  font-family: Roboto Mono;
  src: url(assets/font/RobotoMono-VariableFont_wght.ttf);
}

.v-application {
  font-family: Roboto Mono;
  letter-spacing: 0.25px;
  background-size: contain !important;
  background-color: #000000 !important;
  background-repeat: no-repeat !important;
  padding: 0px 35px;
}
@media all and (max-width: 700px) {
  .v-application {
    padding: 0px;
  }

  .container {
    padding: 0px;
  }

  .container /deep/ .padswap-header-box,
  .container /deep/ .padswap-widgets {
    padding: 12px;
  }
}
.v-sheet.v-toolbar.v-app-bar {
  padding-left: 120px;
  padding-right: 120px;
  background-color: transparent !important;
}

.padswap-navbar div {
  padding-right: 25px;
}
.padswap-address-box {
  border: 1.5px solid #00FC4C;
  box-sizing: border-box;
  border-radius: 100px;
  padding: 6px 26px;
  font-size: 16px;
}

/deep/ .padswap-chevron-down {
  font-size: 20px;
  padding-left: 3px;
  margin-top: -2.6px;
}

.padswap-connect {
  cursor: pointer;
}
</style>