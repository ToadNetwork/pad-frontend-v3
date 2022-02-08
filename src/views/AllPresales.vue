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
      <h1 v-if="this.$store.getters.ecosystem.routeName == 'bsc'" style="margin-bottom: 0">All presales (BSC)</h1>
      <h1 v-else-if="this.$store.getters.ecosystem.routeName == 'moonriver'" style="margin-bottom: 0">All presales (Moonriver)</h1>
      <h1 v-else style="margin-bottom: 0">All presales (Moonbeam)</h1>
      <v-btn
      medium
      color="primary"
      to="/launchpad"
      style="margin-top: 10px;"
      >
        Back
      </v-btn>
    </div>


    <div v-if="!warningHidden" class="token-warning text-left" style="border: 1px dashed yellow; position: relative;">
      <v-btn
      rounded
      color="secondary"
      style="position: absolute; top: 20px; right: 20px; opacity: 0.7;"
      @click="warningHidden = true">
      Close
        </v-btn>
      <h3 class="text-center">DYOR!</h3><br>
      <p>This list contains <b>all presales</b> created on PadSwap - the projects on this list might not be verified and we can't guarantee their security.</p>
      <p>Although DPLP ensures that liquidity cannot be pulled, malicious contracts can still infinitely mint tokens, prevent users from selling, or falsely imitate an existing project.</p>
      <p>Please do your own research before investing.</p>
    </div>


    </v-sheet> 


    <div class="table-container">
    <img class="background" :src="getBackgroundTexture()">
    
        <v-text-field style="max-width: 500px; margin: 10px 30px;" label="search" v-model="search"></v-text-field>


      <v-data-table
      class="token-table"
      :headers="headers"
      :items="getTableContent()"
      item-key="name"
      :key="updateTable"
      :search="search"
      :footer-props="{
        'items-per-page-options': [10, 25, 50, 100]
      }"
      :items-per-page="25">

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
           <img v-if="item.logo" class="token-logo" :src="item.logo" :alt="item.name" onerror="this.style.display='none'">
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

        <template v-slot:item.status="{ item }">
          <v-chip
          small
          color="#8a9aae"
          label
          v-if="item.status == 'active'">
            <v-icon small left>
              mdi-clock-time-eight
            </v-icon>
            ACTIVE
          </v-chip>

          <v-chip
          small
          color="red"
          label
          v-if="item.status == 'aborted'">
            <v-icon small left>
              mdi-close-circle
            </v-icon>
            ABORTED
          </v-chip>

          <v-chip
          small
          color="green"
          label
          v-if="item.status == 'finished'">
            <v-icon small left>
              mdi-checkbox-marked-circle
            </v-icon>
            FINISHED
          </v-chip>
        </template>

      </v-data-table>

    </div>

</v-container>
</template>

<script lang="ts">
import SliderTabs from '@/components/SliderTabs.vue'
import { EcosystemId, IEcosystem } from '@/ecosystem'

  import Vue from 'vue'
  import { mapActions } from 'vuex'
  import AwaitLock from 'await-lock'
  import { ethers } from 'ethers'

  import { ERC20_ABI,
           LAUNCHPAD_FACTORY_ABI,
           LAUNCHPAD_PRESALE_ABI,
           APPROVE_AMOUNT } from '@/constants'
  import { ChainId } from '@/ecosystem'
  import { equalsInsensitive, delay } from '@/utils'

  import { PresaleData } from '@/types'


const presales : any = [
]

  export default Vue.extend ({
    components: { SliderTabs },
    data: () => ({
      valid: true,

      updateTable: <boolean> false,
      warningHidden: <boolean> false,

      // Ecosystem-specific
      backgroundImage: '',

      active: true,
      syncLock: new AwaitLock(),
      search: '',

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
        text: 'Status',
        value: 'status',
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
    }),
    created () {
      window.onstorage = () => {
        this.$store.commit('setUserProfile')
      };
      this.updatePresaleList()
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
      ecosystem(): IEcosystem {
        return this.$store.getters.ecosystem
      },
      address(): string {
        return this.$store.state.address
      },
      web3(): ethers.Signer | null {
        return this.$store.state.web3
      },
      chainId(): ChainId {
        return this.$store.getters.ecosystem.chainId
      },
      multicall(): ethers.providers.Provider {
        return this.$store.getters.multicall
      },
      ecosystemName() : string {
        if (this.$store.getters.ecosystem.chainId == 56) {
          return 'bsc'
        }
        if (this.$store.getters.ecosystem.chainId == 1285) {
          return 'moonriver'
        }
        if (this.$store.getters.ecosystem.chainId == 1284) {
          return 'moonbeam'
        }
        return 'undefined'
      },
      factoryContract(): ethers.Contract {
        return new ethers.Contract(this.$store.getters.ecosystem.launchPadFactoryAddress, LAUNCHPAD_FACTORY_ABI, this.multicall)
      }
    },
    beforeRouteLeave(to, from, next) {
      this.active = false
      next()
    },
    beforeDestroy() {
      this.active = false
    },
    methods: {
      renderTable() {
        this.updateTable = !this.updateTable
      },
      updatePresaleList() {
        presales.length = 0

        let presalesLength = this.factoryContract.allPresalesLength().then(
        (len: ethers.BigNumber) => {
          const length = parseInt(len.toString())
          for (let i = 0; i < length; i += 1)
          this.factoryContract.allPresales(i).then((address: string) => this.getPresaleData(address))
        })
      },
      getPresaleData(presaleAddress : string) {
        const presaleContract = new ethers.Contract(presaleAddress, LAUNCHPAD_PRESALE_ABI, this.multicall)

        let presaleInfo : any = {
          logo: '',
          name: '',
          ticker: '',
          presaleLink: '/' + this.$store.getters.ecosystem.routeName + '/presale/' + presaleAddress,
          status: '',
          isPublic: true
        }
        presales.push(presaleInfo)

        presaleContract.presaleInfo().then((info: string) => {
          const presaleEntry = presales.find((f: any) => equalsInsensitive(f.presaleLink, presaleInfo.presaleLink))
          if (presaleEntry) {
            const parsedInfo = JSON.parse(info)
            presaleEntry.logo = parsedInfo.tokenLogoUrl
            if (parsedInfo.isPublic != undefined) {
              presaleEntry.isPublic = parsedInfo.isPublic
            }
            this.renderTable()
          }
        })

        presaleContract.canBuy().then((canBuy: boolean) => {
          presaleContract.canEnd().then((canEnd: boolean) => {
            presaleContract.isAborted().then((presaleIsAborted: boolean) => {
              const presaleIsActive = canBuy && !canEnd
              const presaleEntry = presales.find((f: any) => equalsInsensitive(f.presaleLink, presaleInfo.presaleLink))
              if (presaleEntry) {
                if (presaleIsActive && !presaleIsAborted) {
                  presaleEntry.status = 'active'
                }
                else if (presaleIsAborted) {
                  presaleEntry.status = 'aborted'
                }
                else {
                  presaleEntry.status = 'finished'
                }
                this.renderTable()
              }
            })
          }) 
        })

        presaleContract.token().then((tokenAddress: string) => this.getTokenData(presaleAddress, tokenAddress, presaleInfo))
      },
      getTokenData(presaleAddress : string, tokenAddress : string, presaleInfo : any) {
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.multicall)

        this.renderTable()

        tokenContract.name().then((tokenName: string) => {
          const presaleEntry = presales.find((f: any) => equalsInsensitive(f.presaleLink, presaleInfo.presaleLink))
          if (presaleEntry) {
            presaleEntry.name = tokenName
            this.renderTable()
          }
        })

        tokenContract.symbol().then((tokenSymbol: string) => {
          const presaleEntry = presales.find((f: any) => equalsInsensitive(f.presaleLink, presaleInfo.presaleLink))
          if (presaleEntry) {
            presaleEntry.ticker = tokenSymbol
            this.renderTable()
          }
        })
      },
      getTableContent() {
        var content = this.getAllPresales()
        var criteria : any = {"active": 3, "finished": 2, "aborted": 1}

        content.sort((a : any, b : any) => {
          if (criteria[a.status] > criteria[b.status]) {
            return -1
          }
          else if (criteria[a.status] < criteria[b.status]) {
            return 1
          }
          else {
            return 0
          }
        })
        return content
      },
      getAllPresales() {
        var presaleList : any = []
        var whiteList : any = presales
        var importedPresales : any = this.$store.state.userProfile.importedPresales[this.ecosystemId]

        whiteList.forEach((item: any) => {
          var presaleListItem = {
            logo: item.logo,
            name: item.name,
            ticker: item.ticker,
            presaleLink: item.presaleLink,
            status: item.status,
            isPublic: item.isPublic
          }
          if (presaleListItem.name && presaleListItem.ticker && presaleListItem.presaleLink && presaleListItem.isPublic) {
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
      copyAddress (address : string) {
        let textArea = document.createElement("textarea")
        textArea.value = address
        textArea.style.top = "0"
        textArea.style.left = "0"
        textArea.style.position = "fixed"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        let successful = document.execCommand('copy')

        document.body.removeChild(textArea)
      },
      ...mapActions(['requestConnect', 'safeSendTransaction'])
    },
    watch: {
      ecosystemId() {
        this.updatePresaleList()
      }
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
  opacity: 0.06;
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

/* Title bar */
.launchpad-title-bar {
  padding-top: 20px;
  z-index: 1;
  position: relative;
  overflow: hidden;
  text-align: center;
  background: rgba(24, 29, 38, 0.7) !important;
  border-radius: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
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


/* Token warning */
.token-warning {
  background: #ffa52d69 !important;
  border-radius: 20px;
  padding: 20px;
  margin: 20px 20px 0 20px;
}

</style>
