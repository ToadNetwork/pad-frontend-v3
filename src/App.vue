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
          >
            <v-list-item-icon>
              <v-img :src="navItem.iconSrc" />
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
              <v-img :src="navItem.iconSrc" />
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
  iconSrc: string
}

type NavSection = {
  title: string,
  items: NavItem[]
}

const navSections: NavSection[] = [{
  title: 'Toad',
  items: [{
    name: 'News',
    desc: 'Latest news and announcements',
    href: '',
    iconSrc: require('./assets/icons/Icon-News.svg')
  },
  {
    name: 'Toad Farms',
    desc: 'Earn tokens by providing liquidity',
    href: '',
    iconSrc: require('./assets/icons/Icon-Toad.svg')
  },
  {
    name: 'Temple',
    desc: 'Convert non-believers into hodlers',
    href: '',
    iconSrc: require('./assets/icons/Icon-Church.svg')
  }]
},
{
  title: 'Padswap',
  items: [{
    name: 'Swap',
    desc: 'Buy or sell tokens on PadSwap',
    href: '',
    iconSrc: require('./assets/icons/Icon-Swap.svg')
  },
  {
    name: 'Pad Farms',
    desc: 'Earn tokens by providing liquidity',
    href: '',
    iconSrc: require('./assets/icons/Icon-Pad.svg')
  },
  {
    name: 'Add Liquidity',
    desc: 'Create LP tokens to add to farms',
    href: '',
    iconSrc: require('./assets/icons/Icon-Pad.svg')
  },
  {
    name: 'Vault',
    desc: 'PAD\'s backing reserves',
    href: '',
    iconSrc: require('./assets/icons/Icon-Vault.svg')
  },
  {
    name: 'Stats',
    desc: 'Analyze token prices and volume',
    href: '',
    iconSrc: require('./assets/icons/Icon-Chart.svg')
  }]
},
{
  title: 'Shop',
  items: [{
    name: 'Piramyd Store',
    desc: 'Official Toad Merch',
    href: '',
    iconSrc: require('./assets/icons/Icon-Piramyd.svg')
  },
  {
    name: 'Amazon Store',
    desc: 'Official Toad Merch',
    href: '',
    iconSrc: require('./assets/icons/Icon-Amazon.svg')
  }]
},
{
  title: 'Games',
  items: []
},
{
  title: 'About',
  items: [{
    name: 'TOAD Wiki',
    desc: 'Learn more about TOAD and PAD',
    href: '',
    iconSrc: require('./assets/icons/Icon-Wiki.svg')
  },
  {
    name: 'Toad Academy',
    desc: 'Learn more about crypto',
    href: '',
    iconSrc: require('./assets/icons/Icon-Academy.svg')
  },
  {
    name: 'Toad Network Audit Report',
    desc: 'Contracts audit report by Spade Audits',
    href: '',
    iconSrc: require('./assets/icons/Icon-Audit.svg')
  },
  {
    name: 'PadSwap Audit Report',
    desc: 'Contracts audit report by Spade Audits',
    href: '',
    iconSrc: require('./assets/icons/Icon-Audit.svg')
  },
  {
    name: 'Toad Network White Paper',
    desc: 'Toad Network\'s White Paper',
    href: '',
    iconSrc: require('./assets/icons/Icon-Paper.svg')
  },
  {
    name: 'PadSwap White Paper',
    desc: 'PadSwap\'s White Paper',
    href: '',
    iconSrc: require('./assets/icons/Icon-Paper.svg')
  }]
}]

export default Vue.extend({
  name: 'App',
  components: { NavMenu },
  data() {
    return {
      navSections,
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