<template>
    <v-dialog
      v-model="dialog"
      scrollable
      max-width="700px"
      color="rgb(18 58 41 / 86%)"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
        rounded
          color="green"
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
      class="token-list-card"
      color="#1a3223"
      height="1000px"
      outlined
      max-height="90vh">

        <div
        class="bg bg-aqua">
        </div>

        <v-card-title
        class="justify-center"
        style="text-align: center;">
          <v-btn-toggle
          v-model="tab"
          large
          mandatory
          dense
          rounded
          light>
            <v-btn>
              Common tokens
            </v-btn>
            <v-btn>
              Custom token
            </v-btn>
          </v-btn-toggle>
        </v-card-title>

        <v-divider></v-divider>
        <v-card-text style="height: 300px; margin-top: 15px;">

          <template v-if="tab == 0">
            <v-card v-for="tokenData in tokenWhitelist"
            color="rgb(64 98 88 / 75%)"
            elevation="10"
            style="margin: 25px 5px"
            @click="selectToken(tokenData)">

              <v-row>
                <v-col
                cols="3"
                class="text-center">
                  <v-layout
                  style="width: 100%;"
                  fill-height
                  align-center
                  justify-center>
                    <img
                    :src="getTokenImage(ecosystemName, tokenData.address)"
                    height="50px"
                    width="50px">
                    </v-img>
                  </v-layout>
                </v-col>
                <v-col
                cols="9">
                  <v-card-title>{{ tokenData.symbol }}</v-card-title>
                  <v-card-subtitle>{{ tokenData.description }}</v-card-subtitle>
                </v-col>
              </v-row>
            </v-card>
          </template>
          <template v-else>            
            <v-text-field
            label="Custom token address"
            v-model='customTokenAddress'
            :rules="contractAddressRules">
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
          </template>


        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
<!--           <v-btn
            color="blue darken-1"
            text
            @click=""
          >
            Confirm
          </v-btn> -->
        </v-card-actions>
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
          tab: 0,
          customTokenAddress: <String> '',
          customToken: <any> {},
          customTokenLoading: <boolean> false,
          customTokenAddressIsValid: <boolean> false,
          contractAddressRules: [
            (v: any) => !!v || 'Specify your token\'s contract address',
            (v: any) => (v.length == 42 && v.slice(0, 2) == '0x') || 'Not a valid contract address.'
          ],
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
    }
  },
  watch: {
    customTokenAddress(val) {
      if (ethers.utils.isAddress(val)) {
        this.loadCustomTokenData()
        this.customTokenAddressIsValid = true
      }
      else {
        this.customTokenAddressIsValid = false
      }
    }
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