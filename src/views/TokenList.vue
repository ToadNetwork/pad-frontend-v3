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

    <div class="token-warning">
      <h3>Attention!</h3>
      <br>
      <p>The tokens on this list are user-created, and as such, PadSwap cannot give any guarantees about their safety.</p>
      <p>Anyone can provide liquidity on PadSwap, including fake versions of existing projects, or tokens that you might be unable to sell.</p>
      <p>Please do your own research before investing.</p>
    </div>

    <div class="table-container">

      <v-data-table
      class="token-table no-background"
      :headers="headers"
      :items="tokens[currentChain]"
      :total-items="tokens[currentChain].length"
      rows-per-page-items="20"
      item-key="name">

        <template v-slot:item.logo="{ item }">
           <img v-if="item.logo != null" class="token-logo" :src="item.logo" :alt="item.name">
        </template>

        <template v-slot:item.address="{ item }">
           <span style="word-break: break-all; word-wrap: break-word;">{{ item.address }}</span>

         <v-tooltip
          :open-on-hover="false"
          right
        >
          <template #activator="{ on }">
            <v-btn
              style="min-width: 0;"
              @click="on.click"
              v-on:click="copyAddress(item.ticker, item.address)"
              icon
              retain-focus-on-click
              v-bind="attrs"
              v-on="on"
            >
            <v-icon small>mdi-clipboard-multiple</v-icon>
            </v-btn>
          </template>
          <span>Copied!</span>
        </v-tooltip>

        </template>


        <template v-slot:item.telegram="{ item }">
           <a :href="item.telegram">Telegram</a>
        </template>

        <template v-slot:item.chart="{ item }">
           <a :href="'https://dexscreener.com/moonbeam/' + item.address" target="blank">Chart</a>
        </template>

      </v-data-table>
    </div>

  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import SliderTabs from '@/components/SliderTabs.vue'
import { EcosystemId } from '@/ecosystem'



export default Vue.extend({
  name: 'Token List',
  components: { SliderTabs },
  methods: {
    setEcosystem(chain_id : string) {
     this.currentChain = chain_id
    },
    copyAddress (token : string, address : string) {
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
  },
  data() {
    return {
      currentChain: 'Moonbeam',
      active: true,
      stakedOnly: false,
      includeRetired: false,
      sortBy: 'Earned',
      searchText: '',
      headers: [
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
        text: 'Contract address',
        value: 'address',
        align: 'center',
        sortable: false
      },
      {
        text: 'Socials',
        value: 'telegram',
        align: 'center',
        sortable: false
      },
      {
        text: 'DexScreener Link',
        value: 'chart',
        align: 'center',
        sortable: false
      }
    ],
    tokens: {

    'BSC': [
      ],
    'Moonriver': [

      ],
    'Moonbeam': [
      {
        logo: require('@/assets/custom-tokens/moonbeam/Bronze.png'),
        name: 'Moonbeam Ingots (Bronze)',
        ticker: 'BRONZE',
        address: '0x2d5f85444D6699b77fEE834145975c71639A75D0',
        telegram: 'https://t.me/Moonbeam_Ingots'
      },
      {
        logo: require('@/assets/custom-tokens/moonbeam/Silver.png'),
        name: 'Moonbeam Ingots (Silver)',
        ticker: 'SILVER',
        address: '0xA8c0453B31Fd1F9F03fdAA84A89845De43A68a3e',
        telegram: 'https://t.me/Moonbeam_Ingots'
      },
      {
        logo: require('@/assets/custom-tokens/moonbeam/Gold.png'),
        name: 'Moonbeam Ingots (Gold)',
        ticker: 'GOLD',
        address: '0x4dD0c86746E8C1CEf05A987b13079343A30E05eF',
        telegram: 'https://t.me/Moonbeam_Ingots'
      },
      {
        logo: require('@/assets/custom-tokens/moonbeam/LunarRise.png'),
        name: 'LunarRise',
        ticker: 'LUNAR',
        address: '0x4142d74292eae9dd1d185cabc572808c73189675',
        telegram: 'https://t.me/LunarRise_glmr'
      },
      {
        logo: require('@/assets/custom-tokens/moonbeam/Moonshiba.png'),
        name: 'MoonbeamShiba',
        ticker: 'MOONSHIB',
        address: '0xde93d50804c0ceeacb5ec5cad2db0ac71b13e44e',
        telegram: 'https://t.me/MoonbeamShiba'
      },
      ]
    }
    }
  },
  mounted () {
    this.ecosystemId = this.$store.state.ecosystemId
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
  },
  watch: {
    ecosystemId() {
      this.$padswapTheme.theme = this.$store.getters.ecosystem.theme
    },
  }
})

</script>

<style scoped>

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

.token-warning {
  background: #ac762269 !important;
  border-radius: 20px;
  padding: 20px;
}

.table-container {
  margin-top: 30px;
  background: rgba(24, 29, 38, 0.7) !important;
  border-radius: 20px;
}

.no-background, .no-background * {
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
  width: 40px;
}

.token-verification {
  width: 24px;
}

</style>