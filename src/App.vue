<template>
  <v-app
   v-bind:style="{ 'background-image': `url(${$padswapTheme.theme.backgroundImageSrc})` }"
  >
    <v-app-bar
      app
      dark
      :elevation="navBarElevation"
      :class="{ 'padswap-scrolled-nav-bar': windowScroll > DESKTOP_SCROLL_THRESHOLD }"
      :style="{ 'padding-left': $vuetify.breakpoint.lgAndUp ? '120px' : '10px',
                'padding-right': $vuetify.breakpoint.lgAndUp ? '120px' : '10px' }"
      clipped-left
    >
      <v-app-bar-nav-icon
        @click="isNavigationDrawerOpen = !isNavigationDrawerOpen"
        class="d-md-none d-flex"
      />
      <a href="/">
        <v-img
          :src="$padswapTheme.theme.headerLogoSrc"
          class="d-md-flex d-none"
          width="162.42px"
          contain
        />
      </a>

      <v-spacer></v-spacer>

      <div class="d-md-flex d-none align-center padswap-navbar">
        <nav-menu
          v-for="navSection in this.navSections"
          :key="navSection.title"
          :title="navSection.title"
          :non-expandable="navSection.items.length == 0"
        >
          <template
            v-for="navItem in navSection.items" 
          >
            <!-- TODO: null out unneeded attrs for each tag type -->
            <component
              :is="navItem.target == '_self' ? 'router-link' : 'a'"
              :key="navItem.name"
              :to="navItem.href"
              :href="navItem.href"
              :target="navItem.target"
            >
              <v-list-item
                :key="navItem.name"
              >
                <v-list-item-icon>
                  <v-img
                    :src="navItem.iconSrc"
                    height="24px"
                    width="24px"
                    contain
                  />
                </v-list-item-icon>

                <v-list-item-content>
                  <div>{{ navItem.name }}</div>
                  <v-subheader>{{ navItem.desc }}</v-subheader>
                </v-list-item-content>
              </v-list-item>
            </component>
          </template>
        </nav-menu>
      </div>
      <div class="d-flex align-center padswap-navbar ml-4">
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

    <!-- TODO: support multiple notifications -->
    <v-snackbar
      app
      v-model="$store.state.showNotification"
      top
      right
      transition="scroll-x-reverse-transition"
      vertical
      width="400"
      rounded
      timeout="7000"
    >
      {{ $store.state.notificationMessage }}

      <template v-slot:action="{ attrs }">
        <!-- TODO: use mutation to hide notification -->
        <v-btn
          text
          v-bind="attrs"
          @click="$store.state.showNotification = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

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
          :value="navSection.autoExpand"
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
            :href="navItem.href"
            :target="navItem.target"
            link
          >
            <v-list-item-icon>
              <v-img
                :src="navItem.iconSrc"
                height="24px"
                width="24px"
                contain
              />
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
import { formatMixin } from '@/format'
import { delay } from '@/utils'
import { IEcosystem } from '@/ecosystem'

type NavItem = {
  name: string,
  desc: string,
  href: string,
  iconSrc: string,
  target: string
}

type NavSection = {
  title: string,
  items: NavItem[],
  autoExpand?: boolean
}

const DESKTOP_SCROLL_THRESHOLD = 430

export default Vue.extend({
  name: 'App',
  mixins: [formatMixin],
  components: { NavMenu },
  data() {
    return {
      isNavigationDrawerOpen: false,
      windowScroll: 0,
      DESKTOP_SCROLL_THRESHOLD
    }
  },
  computed: {
    ecosystem(): IEcosystem {
      return this.$store.getters.ecosystem
    },
    navBarElevation() {
      if (this.isNavigationDrawerOpen) {
        return 24
      }

      // elevate when scrolling past header box, but not on mobile
      if (this.windowScroll > DESKTOP_SCROLL_THRESHOLD &&
          this.$vuetify.breakpoint.mdAndUp) {
        return 24
      }

      return 0
    },
    navSections(): NavSection[] {
      // TODO: refactor to IEcosystem
      return [{
        title: 'Exchange',
        autoExpand: true,
        items: [{
          name: 'Swap',
          desc: 'Buy or sell any token instantly',
          href: '/swap',
          target: '_self',
          iconSrc: require('@/assets/icons/Swap Icon.svg')
        },
        {
          name: 'Farms',
          desc: 'Earn passive income by staking liquidity',
          href: '/farms',
          target: '_self',
          iconSrc: require('@/assets/icons/Farms Icon.svg')
        },
        {
          name: 'Liquidity',
          desc: 'Add liqudity, earn transaction fees',
          href: '/liquidity',
          target: '_self',
          iconSrc: require('@/assets/icons/Faucet Icon.svg')
        },
        {
          name: 'Bridge',
          desc: 'Bridge TOAD between chains',
          href: '/bridge',
          target: '_self',
          iconSrc: require('@/assets/icons/Bridge Icon.svg')
        },
        {
          name: 'Vault',
          desc: 'PAD\'s backing reserves',
          href: '/vault',
          target: '_self',
          iconSrc: require('@/assets/icons/Vault Icon.svg')
        }]
      },
      {
        title: 'Create',
        autoExpand: true,
        items: [
        {
          name: 'Token factory',
          desc: 'Create your own token in a few clicks',
          href: '/tokenfactory',
          target: '_self',
          iconSrc: require('@/assets/icons/Token List Icon.svg')
        },
        {
          name: 'Launchpad',
          desc: 'Partake in presales, or start your own',
          href: '/launchpad',
          target: '_self',
          iconSrc: require('@/assets/icons/LaunchPAD Icon.svg')
        }]
      },
      {
        title: 'Socials',
        items: [
        {
          name: 'YouTube',
          desc: 'Watch our series of educational animated videos',
          href: 'https://www.youtube.com/channel/UCI_vUc-HrJWtKXj-Re-hTSw',
          target: '_blank',
          iconSrc: require('@/assets/icons/YouTube Icon.svg')
        },
        {
          name: 'Telegram',
          desc: 'Come chat with us on Telegram',
          href: 'https://t.me/toadnetwork',
          target: '_blank',
          iconSrc: require('@/assets/icons/Telegram Icon.svg')
        },
        {
          name: 'Discord',
          desc: 'Our own Discord server',
          href: 'https://discord.gg/yChaaxyGjf',
          target: '_blank',
          iconSrc: require('@/assets/icons/Discord Icon.svg')
        },
        {
          name: 'Reddit',
          desc: 'Partake in discussions about Toad.Network on our subreddit',
          href: 'https://reddit.com/r/toadnetwork',
          target: '_blank',
          iconSrc: require('@/assets/icons/Reddit Icon.svg')
        },
        {
          name: 'Twitter',
          desc: 'Stay up to date with our latest news',
          href: 'https://twitter.com/toadnetwork',
          target: '_blank',
          iconSrc: require('@/assets/icons/Twitter Icon.svg')
        }]
      },
      {
        title: 'Info',
        items: [{
          name: 'Docs',
          desc: 'Learn all about us on our Wiki',
          href: 'https://docs.toad.network/',
          target: '_blank',
          iconSrc: require('@/assets/icons/Docs Icon.svg')
        },
        {
          name: 'PadSwap Stats',
          desc: 'Analyze token prices and their volume',
          href: this.ecosystem.infoUrl,
          target: '_blank',
          iconSrc: require('@/assets/icons/Stats Icon.svg')
        },
        {
          name: 'Donate',
          desc: 'Help us fund TOAD\'s marketing',
          href: '/donate',
          target: '_self',
          iconSrc: require('@/assets/icons/Vault Icon.svg')
        },
        ]
      }]
    },
    ...mapGetters(['isConnected']),
    ...mapState(['padPrice']),
  },
  created() {
    window.addEventListener('scroll', this.updateScroll)
  },
  async mounted() {
    this.startSyncing()

    await delay(0)
    if (web3Modal.cachedProvider) {
      await this.connectWallet()
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.updateScroll)
  },
  methods: {
    async connectWallet() {
      if (this.isConnected) {
        return
      }

      this.$store.dispatch('requestConnect')
    },
    async startSyncing() {
      while (true) {
        try {
          this.sync()
        } catch (e) {
          console.error(e)
        }

        await delay(5000)
      }
    },
    async sync() {
      const ecosystem = this.ecosystem
      const blockNumber = await ecosystem.dataseed.getBlockNumber()
      await ecosystem.priceModel.syncWithin(blockNumber, 20)

      if (this.ecosystem.ecosystemId == ecosystem.ecosystemId) {
        const padPrice = ecosystem.priceModel.getPriceUsd(ecosystem.padAddress)
        // TODO: remove setPadPrice calls from landing/farms and update only here
        this.$store.commit('setPadPrice', padPrice)
      }
    },
    updateScroll() {
      this.windowScroll = window.scrollY
    }
  },
  filters: {
    formatAddress(val: string) {
      return val.substring(0, 3) + '...' + val.substring(val.length - 3)
    }
  }
})
</script>

<style src="@/styles/style.css">
</style>

<style scoped>
@font-face {
  font-family: Roboto Mono;
  src: url(assets/font/RobotoMono-VariableFont_wght.ttf);
}

@font-face {
  font-family: Roboto;
  src: url(assets/font/Roboto-Regular.ttf);
}

.v-application {
  font-family: Roboto Mono;
  letter-spacing: 0.25px;
  background-size: contain !important;
  background-color: #000000 !important;
  background-repeat: no-repeat !important;
  padding: 0px 35px;
}

.v-sheet.v-toolbar.v-app-bar {
  background-color: transparent !important;
}
.v-sheet.v-toolbar.v-app-bar.padswap-scrolled-nav-bar {
  background-color: rgba(0, 0, 0, 0.85) !important;
}

@media all and (max-width: 970px) {
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

  .v-sheet.v-toolbar.v-app-bar.padswap-scrolled-nav-bar {
    background-color: unset !important;
  }
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
a { text-decoration: none !important; }
</style>