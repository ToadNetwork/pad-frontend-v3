<template>
<v-container>
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


  <v-sheet class="launchpad-title-bar">
    <img class="background" :src="getBackgroundTexture()">

    <div class="launchpad-title">
      <img class="launchpad-image" :src="getLaunchpadRocket()">
      <h1>LaunchPAD</h1>
    </div>
    <v-row
    align="center"
    justify="center">
      <v-col
      cols="12"
      sm="6">
        <div class="launchpad-title-bar-section">
          <h2>Want to launch your own project?</h2>
          <v-btn
          style="margin-right: 10px"
          large
          class="launch-token-btn"
          color="primary"
          to="/tokenfactory">
          Create token
          </v-btn>
          <v-btn
          large
          class="launch-token-btn"
          color="green"
          to="/launch">
          Launch presale
          </v-btn>
        </div>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col
      cols="12"
      sm="6">
        <div class="launchpad-title-bar-section">
          <h2>Looking for a presale that isn't listed?</h2>
          <v-form
          v-model="validPresaleAddress">
            <v-text-field
            v-model="customPresaleAddress"
            label="Presale address"
            :rules="presaleAddressRules"
            >
              <template v-slot:append>
              <v-btn
              color="primary"
              :disabled="!validPresaleAddress"
              @click="goToPresale(customPresaleAddress)">
                View
              </v-btn>
              </template>
            </v-text-field>
          </v-form>
        </div>
      </v-col>
    </v-row>
  </v-sheet>

    <div class="table-container">

    <div class="text-center">
    <v-btn
    to="/allpresales"
    style="margin: 20px"
    color="primary"
    >
      Click to see all presales
    </v-btn>
    </div>
    <div class="text-center">
      <h4 style="margin-bottom: 30px; margin-top: 10px;">Featured presales:</h4>
    </div>
    <img class="background" :src="getBackgroundTexture()">

      <v-data-table
      class="token-table"
      :headers="headers"
      :items="getTableContent()"
      item-key="name">

        <template v-slot:item.favorite="{ item }">
          <v-btn
          small
          color="green"
          v-if="presaleImported(item.presaleLink)"
          @click="removePresale(item.presaleLink)">
            <v-icon>mdi-star</v-icon>
          </v-btn>
          <v-btn
          small
          v-else
          @click="importPresale(item.logo, item.name, item.ticker, item.presaleLink)">
            <v-icon>mdi-star-outline</v-icon>
          </v-btn>
        </template>

        <template v-slot:item.logo="{ item }">
           <img v-if="item.logo" class="token-logo" :src="item.logo" :alt="item.name">
        </template>


        <template v-slot:item.presaleLink="{ item }">
          <v-btn
          small
          color="primary"
          :href="item.presaleLink"
          >
          View presale
          </v-btn>
        </template>

      </v-data-table>

      <div class="text-center" style="margin: 30px 0; color: #d6d4d4">
        Want your presale to be featured here?
        <v-btn
        small
        color="secondary"
        to="/whitelistpresale">
          Contact us
        </v-btn>
      </div>

    </div>


</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import SliderTabs from '@/components/SliderTabs.vue'
import { EcosystemId, IEcosystem } from '@/ecosystem'
import { delay, equalsInsensitive } from '@/utils'
import { PresaleData } from '@/types'


const presales : {[unit: string] : object} = {
  'BSC': [
    ],
  'Moonriver': [
      // {
      //   logo: 'https://www.freeiconspng.com/thumbs/mark-zuckerberg-png/mark-zuckerberg-png-images-photos-7.png',
      //    name: 'Zucked Inu',
      //    ticker: 'ZUCK',
      //    presaleLink: '/moonriver/presale/0x86b6cC87A427EB416B4d0Ba4Fe95d0B6Ba7b4a87'
      // },
    ],
  'Moonbeam': [
    ]
}

export default Vue.extend({
  name: 'LaunchPAD',
  components: { SliderTabs },
  methods: {
    getTableContent() {
      var content = this.getImportedPresales().concat(this.getWhitelistedPresales())

      return content
    },
    getImportedPresales() {
      var presaleList : any = []
      const whiteList = presales[this.currentChain]

      const importedPresales = this.$store.state.userProfile.importedPresales[this.ecosystemId]
      
      importedPresales.forEach((item : any) => {
        var presaleListItem = {
          logo: item.logo,
          name: item.name,
          ticker: item.ticker,
          presaleLink: item.presaleLink
        }
        if (presaleListItem.name && presaleListItem.ticker && presaleListItem.presaleLink ) {
          presaleList.push(presaleListItem)
        }
      })
      return presaleList
    },
    getWhitelistedPresales() {
      var presaleList : any = []
      var whiteList : any = presales[this.currentChain]
      var importedPresales : any = this.$store.state.userProfile.importedPresales[this.ecosystemId]

      whiteList.forEach((item: any) => {
        var presaleListItem = {
          logo: item.logo,
          name: item.name,
          ticker: item.ticker,
          presaleLink: item.presaleLink
        }
        const existingEntry = importedPresales.find((f: any) => equalsInsensitive(f.presaleLink, item.presaleLink)) 
        if (!existingEntry) {
          presaleList.push(presaleListItem)
        }
      })
      return presaleList
      },
      presaleImported(presaleLink : string) {
        if (!presaleLink) {
          return
        }

        const importedPresales = this.$store.state.userProfile.importedPresales[this.ecosystemId]

        const existingEntry = importedPresales.find((f: PresaleData) => equalsInsensitive(f.presaleLink, presaleLink))
        if (existingEntry) {
          return true
        }
        return false
      },
      importPresale(importedLogo : string, importedName : string, importedTicker : string, importedLink : string) {
        if (!importedName || !importedTicker || !importedLink) {
          return
        }

        const presaleConfig = {
          logo: importedLogo,
          name: importedName,
          ticker: importedTicker,
          presaleLink: importedLink
        }

        const importedPresales = this.$store.state.userProfile.importedPresales[this.ecosystemId]

        const existingEntry = importedPresales.find((f: PresaleData) => equalsInsensitive(f.presaleLink, presaleConfig.presaleLink))
        if (existingEntry) {
          const id = importedPresales.indexOf(existingEntry)
          if (id > -1) {
            importedPresales.splice(id, 1);
           }
        }

        this.$store.state.userProfile.importedPresales[this.ecosystemId].push(presaleConfig)
      },
      removePresale(presaleLink : string) {
        const importedPresales = this.$store.state.userProfile.importedPresales[this.ecosystemId]

        const existingEntry = importedPresales.find((f: PresaleData) => equalsInsensitive(f.presaleLink, presaleLink))
        if (existingEntry) {
          const id = importedPresales.indexOf(existingEntry)
          if (id > -1) {
            importedPresales.splice(id, 1);
           }
        }
      },
    setEcosystem(chain_id : string) {
     this.currentChain = chain_id
    },
    getBackgroundTexture() {
      if (this.$store.getters.ecosystem.chainId == 56) {
        return require('@/assets/images/launchpad-texture-bsc.jpg')
      }
      if (this.$store.getters.ecosystem.chainId == 1285) {
        return require('@/assets/images/launchpad-texture-moonriver.jpg')
      }
      if (this.$store.getters.ecosystem.chainId == 1284) {
        return require('@/assets/images/launchpad-texture-moonbeam.jpg')
      }
    },
    getLaunchpadRocket() {
      if (this.$store.getters.ecosystem.chainId == 56) {
        return require('@/assets/images/launchpad-rocket-bsc.svg')
      }
      if (this.$store.getters.ecosystem.chainId == 1285) {
        return require('@/assets/images/launchpad-rocket-moonriver.svg')
      }
      if (this.$store.getters.ecosystem.chainId == 1284) {
        return require('@/assets/images/launchpad-rocket-moonbeam.svg')
      }
    },
    goToPresale(presaleAddress: string) {
      const chain = this.$store.getters.ecosystem.routeName
      this.$router.push(`/${chain}/presale/${presaleAddress}`)
    }
  },
  data() {
    return {
      currentChain: <string> '',
      active: true,
      searchText: '',
      customPresaleAddress: <string> '',
      validPresaleAddress: <boolean> false,
      headers: [
      {
        text: 'Favorite',
        value: 'favorite',
        align: 'center',
        sortable: false
      },
      {
        text: 'Logo',
        value: 'logo',
        align: 'center',
        sortable: false
      },
      {
        text: 'Ticker',
        value: 'ticker',
        align: 'center',
        sortable: false
      },
      {
        text: 'Token name',
        value: 'name',
        align: 'center',
        sortable: false
      },
      {
        text: 'Presale link',
        value: 'presaleLink',
        align: 'center',
        sortable: false
      }
    ],
    presaleAddressRules: [
        (v: any) => !!v || 'Specify the presale address',
        (v: any) => (v.length == 42 && v.slice(0, 2) == '0x') || 'Not a valid contract address.'
      ]
    }
  },
  mounted () {
    this.ecosystemId = this.$store.state.ecosystemId
  },
  created () {
    window.onstorage = () => {
      this.$store.commit('setUserProfile')
    };
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
          this.setEcosystem("BSC")
        }
        else if (val == 1) {
          this.setEcosystem("Moonriver")
        }
        else if (val == 2) {
          this.setEcosystem("Moonbeam")
        }
      }
    },
    ecosystem(): IEcosystem {
      return this.$store.getters.ecosystem
    }
  },
  watch: {
    ecosystemId() {
      this.$padswapTheme.theme = this.$store.getters.ecosystem.theme
    },
  }
})

</script>

<style scoped>

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

/* Title bar */
.launchpad-title-bar {
  z-index: 1;
  position: relative;
  overflow: hidden;
  text-align: center;
  padding: 20px;
  background: rgba(24, 29, 38, 0.7) !important;
  border-radius: 20px;
}
.launchpad-title-bar h1 {
  margin-bottom: 25px;
}

.launchpad-title-bar-section {
  text-align: center;
  font-size: 0.7rem;
}

.launchpad-title-bar-section {
  text-align: center;
  padding: 20px;
}

.launch-token-btn {
  margin-top: 20px;
}

/* Title */
.launchpad-title {
  width: 100%;
}
.launchpad-title img {
  max-width: 100px;
}
.launchpad-title h1 {
  color: white;
  text-shadow: #000 2px 2px 2px;
  -webkit-font-smoothing: antialiased;
}

/********************/
/* Ecosystem slider */
/********************/

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

.padswap-header-box {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/***************/
/* Token table */
/***************/

.table-container {
  position: relative;
  overflow: hidden;
  z-index: 1;
  margin-top: 30px;
  background: rgba(24, 29, 38, 0.7) !important;
  border-radius: 20px;
}

.token-table {
  background-color: none !important;
  background: none !important;
}

.token-table /deep/ tbody tr:hover {
  background: #ffffff1c !important;
}

.padswap-header-box {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.token-logo {
  height: 35px;
  width: auto;
}

.token-verification {
  width: 24px;
}

</style>