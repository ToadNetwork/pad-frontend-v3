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
      style="border-radius: ;"
      max-height="100vh">
        <v-card-title>Select token</v-card-title>
<!--         <v-text-field
        v-model='customTokenAddress'>
        </v-text-field> -->

        <v-divider></v-divider>
        <v-card-text style="height: 300px;">

          <v-card v-for="tokenData in tokenWhitelist"
          color="#315237"
          style="margin: 10px 5px"
          @click="selectToken(tokenData)">
            <v-card-title>{{ tokenData.symbol }}</v-card-title>
            <v-card-subtitle>{{ tokenData.description }}</v-card-subtitle>
          </v-card>

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
import { EcosystemId, ECOSYSTEMS, ChainId } from '@/ecosystem'

import {
    ERC20_ABI,
    SWAP_ROUTER_ABI
} from '@/constants'

import { ChainId } from '@/ecosystem'

export default Vue.extend({
  name: 'TokenSelector',
  props: {
    selectedToken: Object,

    tokenWhitelist: Array
  },
  data() {
      return {
          dialog: <boolean> false,
          customTokenAddress: <String> ''
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
    this.updateWhitelist()

  },
  watch: {
    tokenWhitelist(newWhitelist) {
      this.updateWhitelist()
    }
  },
  methods: {
    updateWhitelist() {
      this.tokenWhitelist.forEach((tokenData) => {
        
      })
    },

    selectToken(tokenData) {
      this.selectedToken = tokenData
      this.$emit('tokenSelected', tokenData)
      this.dialog = false
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