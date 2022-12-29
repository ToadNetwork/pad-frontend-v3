<template>
    <v-dialog
      v-model="dialog"
      scrollable
      max-width="700px"
      color="rgb(18 58 41 / 86%)"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="#bdbbbb"
          rounded
          outlined
          dotted
          dark
          v-bind="attrs"
          v-on="on"
        >
          <v-img
          :src="getTokenImage(ecosystemName, selectedToken.address)"
          height="24px"
          width="24px">
          </v-img>
          &nbsp;
          {{ selectedToken.symbol }}
          <v-icon
          right
          dark
          >
          mdi-chevron-down
          </v-icon>
        </v-btn>
      </template>
      <v-card
      color="#1a3223"
      height="1000px"
      outlined
      max-height="90vh"
      class="ma-0 pa-0">

        <div
        class="bg bg-dark">
        </div>

        <div
        class="justify-center"
        style="width: 100%; text-align: right; position: absolute; top: 0; right: 0; z-index: 20">
          <v-btn
            color="transparent"
            fab
            small
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-card-title style="z-index: 10; font-size: 1em;">
          Select token
        </v-card-title>

        <v-card
        color="transparent"
        flat
        style="margin: 10px; padding-left: 10px; padding-right: 10px;">
          <v-text-field
          outlined
            label="Type a token name, or paste address"
            v-model='customTokenAddress'>
          </v-text-field>

          <template v-if="customTokenAddressIsValid">
            <v-card v-if="customTokenLoading">
              <v-progress-circular
              indiscriminate>
              </v-progress-circular>
            </v-card>

            <v-card v-else>
              <v-card-title>
                {{ customToken.symbol }} ({{ customToken.name }})
              </v-card-title>
              <v-card-actions>
                <v-btn
                @click="selectToken(customToken)">
                  Confirm
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-card>

        <v-divider></v-divider>
        <v-card-text
        class="ma-0 pa-0"
        style="height: 300px; margin-top: 15px;">

          <v-card v-for="tokenData in filteredTokenList"
          flat
          tile
          color="transparent"
          width="100%"
          class="ma-0 pa-0"
          style="padding-bottom: 5px !important;"
          @click="selectToken(tokenData)">
            <v-divider></v-divider>
            <v-card-title>
              <img
              style="height: 30px; width: 30px; margin-right: 10px;"
              :src="getTokenImage(ecosystemName, tokenData.address)">
              </img>
              <span style="margin-bottom: 3px;">
                {{ tokenData.symbol }}
              </span>
            </v-card-title>
            <v-card-subtitle
            color="#cfcfcfb3"
            style="margin-top: -10px;">
              {{ tokenData.description }}
            </v-card-subtitle>
          </v-card>

        </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'

import { ethers } from 'ethers'
import { IEcosystem, EcosystemId, ECOSYSTEMS, ChainId } from '@/ecosystem'

import { tokenInfo } from '@/mixins/tokenInfo'

import {
    ERC20_ABI,
    SWAP_ROUTER_ABI
} from '@/constants'

export default Vue.extend({
  name: 'TokenSelector',
  mixins: [tokenInfo],
  props: {
    selectedToken: Object,
    tokenWhitelist: Array
  },
  data() {
      return {
          dialog: <boolean> false,
          customTokenAddress: <String> '',
          customToken: <any> {},
          customTokenLoading: <boolean> false,
          customTokenAddressIsValid: <boolean> false,
          filteredTokenList: <any> []
      }
  },
  computed: {
      userAddress(): string {
        return this.$store.state.address
      },
      multicall(): ethers.providers.Provider {
        return this.$store.getters.multicall
      },
      ecosystem(): IEcosystem {
        return this.$store.getters.ecosystem
      },
      web3(): ethers.Signer | null {
        return this.$store.state.web3
      },
      chainId(): ChainId {
        return this.$store.getters.ecosystem.chainId
      },
  },
  created() {
    this.updateFilteredTokenList()
  },
  methods: {
    selectToken(tokenData : any) {
      console.log(tokenData.address)
      this.$emit('tokenSelected', tokenData)
      this.dialog = false
    },
    async loadCustomTokenData() {
      while (this.customTokenLoading) {}
      this.customTokenLoading = true
      // @ts-ignore-next-line
      const tokenInfo = await this.getTokenData(this.customTokenAddress)
      this.customToken = tokenInfo
      this.customTokenLoading = false
    },

    // Filters the token whitelist,
    // only displaying the tokens that match the search query
    // in their name or adress
    updateFilteredTokenList() {
      const list = []
      for (let i = 0; i < this.tokenWhitelist.length; i++) {
        let token : any = this.tokenWhitelist[i]

        const query = this.customTokenAddress.toUpperCase()
        const address = token.address.toUpperCase()
        const symbol = token.symbol.toUpperCase()
        const name = token.name.toUpperCase()

        if (address.includes(query) || symbol.includes(query) || name.includes(query)) {
          list.push(token)
        }
      }
      this.filteredTokenList = list
    }
  },
  watch: {
    customTokenAddress(val) {
      if (ethers.utils.isAddress(val)) {
        this.loadCustomTokenData()
        this.customTokenAddressIsValid = true
        this.filteredTokenList = []
      }
      else {
        this.customTokenAddressIsValid = false
        this.updateFilteredTokenList()
      }
    },
    tokenWhitelist(newWhitelist) {
      this.updateFilteredTokenList()
    },
  }
})

</script>

<style scoped>



.token-list-card {
  border-radius: 20px;
}

::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #1c2e1d;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #429647;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #99ffbb;
}

</style>