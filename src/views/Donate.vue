<template>
  <v-container>
    <div class="donation-form-container">
      <v-sheet class="donation-form-box" elevation="4">
        <div class="title-section">
          <h2>Donate to TOAD marketing</h2>
          <br>
          <v-divider></v-divider>
          <br>
          <p>If you wish to help us promote TOAD, you can donate to the multisig wallet managed by our marketing team.</p>

          <p style="color: orange; font-weight: bold;">Important: donations are only accepted on <u>Moonbeam</u> network</p>
        </div>

        <v-divider></v-divider>

        <div class="donation-address-container">
          <v-text-field
          :value="donationAddress"
          readonly>
            <template v-slot:label>
              <u>Moonbeam</u> donation wallet address:
            </template>
            <template v-slot:append>
            <v-tooltip
            :open-on-hover="false"
            right
            >
            <template #activator="{ on, attrs }">
              <v-btn
              style="min-width: 0;"
              @click="on.click"
              v-on:click="copyText(donationAddress)"
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
          </v-text-field>

          <div class="funds-raised">
            <v-card class="funds-raised-total" elevation="4">
              <h4>Funds in marketing wallet:</h4>
              <span v-if="usdDonationAmount > 0">
              ${{usdDonationAmount}}
              </span>
            </v-card>
          </div>

          <v-divider></v-divider>

          <div class="counted-token-list">
            <span>The following tokens are counted:</span>
            <p>GLMR, TOAD, PAD, USDC, USDT, BUSD, ETH</p>
            <span>Other tokens are also accepted, but might not be calculated here.</span>
          </div>

        </div>
      </v-sheet>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { ethers } from 'ethers'
import { providers } from '@0xsequence/multicall'
import AwaitLock from 'await-lock'
import { List } from 'linq-collections'

import Farm from '@/components/Farm.vue'
import SliderTabs from '@/components/SliderTabs.vue'
import {
  MULTICALL_ADDRESS,
  ERC20_ABI,
} from '../constants'
import { IEcosystem, EcosystemId, ECOSYSTEMS } from '@/ecosystem'
import { formatMixin } from '@/format'
import { delay, equalsInsensitive, toFloat } from '@/utils'

function tryParseUrl(url: string) {
  try {
    return new URL(url)
  } catch {
    return null
  }
}

export default Vue.extend({
  name: 'Home',
  mixins: [formatMixin],
  components: { Farm, SliderTabs },
  data() {
    const syncLocks = <Record<EcosystemId, AwaitLock>> {}
    for (const ecosystem of Object.values(ECOSYSTEMS)) {
      syncLocks[ecosystem.ecosystemId] = new AwaitLock()
    }

    return {
      syncLocks,
      active: true,
      sortBy: 'Earned',
      searchText: '',
      usdDonationAmount: 0.0,
      donationAddress: '0xc0a458c02de2f82ee78c93b91b045703bc2c35b3'
    }
  },
  async mounted() {
    this.$store.commit('setEcosystemId', 2)

    while (this.active) {
      try {
        await this.sync()
      } catch (e) {
        console.error(e)
      } finally {
        await delay(5000)
      }
    }
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
      }
    },
    ecosystem(): IEcosystem {
      return this.$store.getters.ecosystem
    },
    multicall(): ethers.providers.Provider {
      return new providers.MulticallProvider(this.ecosystem.dataseed, {
        batchSize: 300,
        timeWindow: 0,
        contract: MULTICALL_ADDRESS
      })
    },
    isConnected(): boolean {
      return this.$store.getters.isConnected
    },
    userAddress(): string {
      return this.$store.state.address
    },
    lastChainTransactionBlock(): Object {
      // access properties explicitly to trigger reactivity
      return Object.entries(this.$store.state.lastChainTransactionBlock)
    }
  },
  watch: {
    ecosystem() {
      this.$padswapTheme.theme = this.ecosystem.theme
      setTimeout(() => this.sync())
    },
    lastChainTransactionBlock() {
      setTimeout(() => this.sync())
    },
  },
  methods: {
    async sync() {
      const ecosystem = this.ecosystem
      const multicall = this.multicall
      const mutex = this.syncLocks[this.ecosystemId]
      await mutex.acquireAsync()

      try {
        await this.syncInternal(ecosystem, multicall)
      } finally {
        mutex.release()
      }
    },
    async syncInternal(ecosystem: IEcosystem, multicall: ethers.providers.Provider) {
      const priceModel = ecosystem.priceModel

      const blockNumber = await multicall.getBlockNumber()
      let promises = [
        priceModel.syncWithin(blockNumber, 12),
      ]

      await Promise.all(promises)

      const acceptedTokens : string[] = [
      '0xe3db50049c74de2f7d7269823af3178cf22fd5e3', // WGLMR
      '0x818ec0a7fe18ff94269904fced6ae3dae6d6dc0b', // USDC (anySwap)
      '0x8f552a71efe5eefc207bf75485b356a0b3f01ec9', // USDC (xPollinate)
      '0x8e70cd5b4ff3f62659049e74b6649c6603a0e594', // USDT
      '0x30d2a9f5fdf90ace8c17952cbb4ee48a55d916a7', // ETH (xPollinate)
      '0xfA9343C3897324496A05fC75abeD6bAC29f8A40f', // ETH (anySwap)
      '0x59193512877e2ec3bb27c178a8888cfac62fb32d', // GLMR PAD
      '0xF480f38C366dAaC4305dC484b2Ad7a496FF00CeA', // TOAD
      // '0xc9BAA8cfdDe8E328787E29b4B078abf2DaDc2055', // BNB
      '0xA649325Aa7C5093d12D6F98EB4378deAe68CE23F', // BUSD

      ]

      let tokenUsdAmount = 0.0

      for (const tokenAddress of acceptedTokens) {
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, multicall)
        const tokenBalance = await tokenContract.balanceOf(this.donationAddress)
        tokenUsdAmount += parseFloat(ethers.utils.formatEther(tokenBalance)) * priceModel.getPriceUsd(tokenAddress)
      }

      let ethBalance = await multicall.getBalance(this.donationAddress)
      let ethUsdAmount = parseFloat(ethers.utils.formatEther(ethBalance)) * priceModel.getPriceUsd('0xe3db50049c74de2f7d7269823af3178cf22fd5e3')

      this.usdDonationAmount = Math.floor(tokenUsdAmount + ethUsdAmount)

    },
    copyText (text : string) {
      let textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.top = "0"
      textArea.style.left = "0"
      textArea.style.position = "fixed"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      let successful = document.execCommand('copy')

      document.body.removeChild(textArea)
    },
  }
})
</script>

<style scoped>

.donation-form-container {
  display: block;
  width: 100%;
  text-align: center;
  margin-top: 40px;
}

.donation-form-box {
  display: inline-block;
  margin: 20px;
  padding: 20px;
  background: rgba(24, 29, 38, 0.7);
  border-radius: 20px;
  max-width: 700px;
}

.donation-address-container {
  display: block;
  text-align: center;
  margin-top: 20px;
}

.donation-address-box {
  display: inline-block;
  border: 1px solid gray;
  border-radius: 10px;
  padding-left: 10px;
  max-height: 30px;
}

.funds-raised {
  text-align: center;
  margin-bottom: 20px;
}

.funds-raised-total {
  display: inline-block;
  background-color: #5a556238;
  border-radius: 20px;
  padding: 10px 20px;
  margin-top: 10px;
  font-size: 2em;
}

.funds-raised-total h4 {
  font-size: 0.4em;
  color: #b3b3b3;
}

.counted-token-list {
  margin-top: 20px;
}

</style>
