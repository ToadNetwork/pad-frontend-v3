<template>
  <v-app
   v-bind:style="{ 'background-image': `url(${$padswapTheme.theme.backgroundImageSrc})` }"
  >
    <v-app-bar
      app
      dark
      :elevation="isNavigationDrawerOpen ? 24 : 0"
      clipped-left
    >
      <v-app-bar-nav-icon
        @click="isNavigationDrawerOpen = !isNavigationDrawerOpen"
        class="d-sm-none d-flex"
      />
      <div>
        <v-img
          :src="$padswapTheme.theme.headerLogoSrc"
          class="d-sm-flex d-none"
          width="162.42px"
        />
      </div>

      <v-spacer></v-spacer>

      <div class="d-sm-flex d-none align-center padswap-navbar">
        <nav-menu
          v-for="navSection in this.navSections"
          :key="navSection.title"
          :title="navSection.title"
          :non-expandable="navSection.items.length == 0"
        >
          <v-list-item
            v-for="navItem in navSection.items"
            :key="navItem.name"
            :href="navItem.href"
            target="_blank"
          >
            <v-list-item-icon>
              <v-icon>{{ navItem.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <div>{{ navItem.name }}</div>
              <v-subheader>{{ navItem.desc }}</v-subheader>
            </v-list-item-content>
          </v-list-item>
        </nav-menu>
      </div>
      <div class="d-flex align-center padswap-navbar ml-4">
        <v-img
          :src="$padswapTheme.theme.padLogoSrc"
          style="width: 16px; height: 16px; margin-right: 6px; padding-right: 0px;"
        />
        <div
          style="color: #00FC4C;"
        >
          ${{ padPrice | formatPrice }}
        </div>
        <div
          class="d-sm-flex d-none"
          style="white-space: nowrap"
        >
          EN
          <v-icon class="padswap-chevron-down">mdi-chevron-down</v-icon>
        </div>
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

    <v-navigation-drawer
      v-model="isNavigationDrawerOpen"
      app
      dark
      temporary
      class="padswap-navigation-drawer"
      style="top: 56px"
    >
      <v-list nav>
        <v-list-group
          v-for="navSection in navSections"
          :key="navSection.title"
          :append-icon="navSection.items.length > 0 ? 'mdi-chevron-down' : ''"
        >
          <template v-slot:activator>
            <v-list-item-title>
              {{ navSection.title }}
            </v-list-item-title>
          </template>
          <v-list-item
            v-for="navItem of navSection.items"
            :key="navItem.name"
            link
          >
            <v-list-item-icon>
              <v-icon>{{ navItem.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              {{ navItem.name }}
              <v-subheader>{{ navItem.desc }}</v-subheader>
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>

      <!-- allows scrolling -->
      <div style="height: 200px">
        &nbsp;
      </div>
    </v-navigation-drawer>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import web3Modal from '@/wallet'

import NavMenu from '@/components/NavMenu.vue'
import { delay } from '@/utils'

type NavItem = {
  name: string,
  desc: string,
  href: string,
  icon: string
}

type NavSection = {
  title: string,
  items: NavItem[]
}

const navSections: NavSection[] = [{
  title: 'Products',
  items: [{
    name: 'Swap',
    desc: 'Buy or sell any token instantly on PadSwap',
    href: 'https://padswap.exchange/#/swap',
    icon: 'mdi-swap-horizontal'
  },
  {
    name: 'LaunchPad',
    desc: 'Partake in exclusive presales',
    href: 'https://dapps.padswap.exchange/launchpad',
    icon: 'mdi-rocket-launch'
  },
  {
    name: 'Bridge',
    desc: 'Bridge tokens between chains',
    href: 'https://dapps.padswap.exchange/bridge',
    icon: 'mdi-bridge'
  },
  {
    name: 'Vault',
    desc: 'PAD\'s backing reserves',
    href: 'https://dapps.padswap.exchange/vault',
    icon: 'mdi-safe-square-outline'
  },
  {
    name: 'Farms',
    desc: 'Earn passive income by staking liquidity',
    href: '/',
    icon: 'mdi-sprout'
  },
  {
    name: 'Stats',
    desc: 'Analyze token prices and their volume',
    href: 'https://info.padswap.exchange/home',
    icon: 'mdi-chart-bar'
  }]
},
{
  title: 'Content',
  items: [{
    name: 'TOAD Academy',
    desc: 'Learn about crypto in a fun way',
    href: 'https://toad.academy/',
    icon: 'mdi-school-outline'
  },
  {
    name: 'Games',
    desc: 'Play our TOAD-themed games',
    href: 'https://toad.academy/games',
    icon: 'mdi-gamepad-variant-outline'
  },
  {
    name: 'YouTube',
    desc: 'Watch our series of educational animated videos',
    href: 'https://www.youtube.com/channel/UCI_vUc-HrJWtKXj-Re-hTSw',
    icon: 'mdi-youtube'
  },
  {
    name: 'Pyramid Store',
    desc: 'Official TOAD merch',
    href: 'https://piramyd.me/toad-network-x-piramyd/',
    icon: 'mdi-tshirt-crew-outline'
  }]
},
{
  title: 'Socials',
  items: [{
    name: 'Telegram',
    desc: 'Come chat with us on Telegram',
    href: 'https://t.me/toadnetwork',
    icon: 'mdi-send'
  },
  {
    name: 'Reddit',
    desc: 'Partake in discussions about Toad.Network on our subreddit',
    href: 'https://reddit.com/r/toadnetwork',
    icon: 'mdi-reddit'
  },
  {
    name: 'Twitter',
    desc: 'Stay up to date with our latest news',
    href: 'https://twitter.com/toadnetwork',
    icon: 'mdi-twitter'
  }]
},
{
  title: 'About',
  items: [{
    name: 'TOAD Docs',
    desc: 'Learn all about TOAD on our Wiki',
    href: 'https://docs.toad.network/',
    icon: 'mdi-clipboard-text-search-outline'
  },
  {
    name: 'Audit Report',
    desc: 'PadSwap contracts audit report by SpadeAudits',
    href: 'https://dapps.padswap.exchange/pad_audit_report.pdf',
    icon: 'mdi-text-box-check'
  },
  {
    name: 'White Paper',
    desc: 'PadSwap white paper',
    href: 'https://www.dropbox.com/s/bng5e1bq2u03bk6/PAD%20WHITEPAPER.PDF',
    icon: 'mdi-file-outline'
  }]
}]

export default Vue.extend({
  name: 'App',
  components: { NavMenu },
  data() {
    return {
      navSections: navSections,
      isNavigationDrawerOpen: false
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

  .padswap-farms-home {
    padding: 0px;
  }

  .container /deep/ .padswap-header-box,
  .container /deep/ .padswap-widgets {
    padding: 12px;
  }

  .v-app-bar {
    padding-left: 0px !important;
    padding-right: 0px !important;
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

.padswap-navigation-drawer {
  border-radius: 8px;
  background-color: #000000 !important;
  width: 90vw !important;
}
.padswap-navigation-drawer .v-list-item .v-subheader {
  padding: 0px;
  margin-top: 2px;
  height: auto;
  font-size: 12px;
  white-space: normal;
}
.padswap-navigation-drawer /deep/ .v-list-group__header.v-list-item--active {
  color: #FFFFFF;
  filter: invert(68%) sepia(70%) saturate(3531%) hue-rotate(94deg) brightness(108%) contrast(117%);
}
</style>