<template>
  <v-container class="faucet-page">


    <h1>GLMR Faucet</h1>
    <div class="faucet-container">

      <div class="tab-container">
        <div class="tabs">
          <v-tooltip
            v-for="tab in tabs"
            :key="tab.title"
            :disabled="!tab.disabled"
            open-on-hover
            bottom
          >
            <template v-slot:activator="{ on, attrs }">
              <button
                v-on="on"
                v-bind="attrs"
                :class="['tab-btn', { 'tab-active': selected === tab.title }]"
              >
                {{ tab.title }}
              </button>
            </template>

            Coming soon!
          </v-tooltip>
        </div>

        <div class="tab-description" style="display:block; padding-top: 20px;">
          <span v-if="selected == 'Redeem code'">Redeem a code to get GLMR</span>
        </div>
      </div>

      <div class="content">

        <div v-if="selected == 'Redeem code'">
          
          <span>Enter code:</span>
          <v-text-field
            v-model="code"
            class="text-field"
            filled
            outlined
            clearable
            placeholder="XXXX-XXXX-XXXX-XXXX"
            :error="Boolean(code) && !validationStatus"
            type="string">
          </v-text-field>

          <span>Your GLMR wallet:</span>
          <v-text-field
            class="text-field"
            disabled
            :value="displayedAddress"
            filled
            outlined
            clearable
            placeholder="0x..."
            type="string">
          </v-text-field>

          <br>
          <div class="d-flex justify-center flex-column">
            <span v-if="errorPrompt" style="color: red">
              {{ errorPrompt }}
            </span>
            <template v-if="redeemTx">
              Success!
              <a
                :href="`https://blockscout.moonbeam.network/tx/${redeemTx}`"
                target="_blank"
              >
                View on explorer
              </a>
            </template>
          </div>
          <v-btn
            @click="address ? redeemCoupon() : $store.dispatch('requestConnect')"
            x-large
            :ripple="validationStatus"
            :disabled="address && Boolean(code) && !validationStatus"
            :loading="isRedeemingCode"
            color="primary"
            class="my-3">
            <template v-if="address">
              Redeem GLMR
            </template>
            <template v-else>
              Connect Wallet
            </template>

          </v-btn>

        </div>


        <div v-if="selected == 'Create code'">
          <span>BNB to deposit (min 0.001, max 0.1):</span>
          <v-text-field
            v-model="bridgeAmount"
            filled
            outlined
            clearable
            :messages="balanceMessage"
            placeholder="0.0"
            type="number"
            min="0.0">
            <template v-slot:prepend-inner>
              <v-btn
                v-show="tokenBalance !== null"
                x-small
                @click="setMaxTokens">
                Max
              </v-btn>
            </template>
          </v-text-field>


          <span>This will be your code.</span>
          <span>Make sure to write it down.</span>
          <v-text-field
              class="text-field"
              filled
              outlined
              placeholder="0x..."
              readonly
              type="string"
              v-model="createdCode">
          </v-text-field>

          <br>
          <v-btn
            x-large
            :ripple="true"
            color="primary"
            class="my-3">
            Deposit BNB
          </v-btn>
        </div>
      </div>

    </div>


  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { ethers } from 'ethers'

export default Vue.extend({
  data () {
    return {
      tabs: [{
        title: "Create code",
        disabled: true
      },
      {
        title: "Redeem code",
        disabled: false
      }],
      selected: "Redeem code",
      createdCode: '28MCD-9KDJ2-0HK1O',
      code: <string | null> null,
      isRedeemingCode: false,
      errorPrompt: <string | null> null,
      redeemTx: <string | null> null
    }
  },
  computed: {
    address(): string | null {
      return this.$store.state.address
    },
    dataseed(): ethers.providers.Provider {
      return this.$store.getters.ecosystem.dataseed
    },
    displayedAddress(): string | null {
      if (!this.address) {
        return null
      }
      return this.address.substring(0, 12) + '...' + this.address.substring(this.address.length - 12)
    },
    validationStatus(): boolean {
      if (!this.code) {
        return false
      }

      return this.code.replaceAll('-', '').length == 16
    }
  },
  methods: {
    async redeemCoupon() {
      if (!this.code) {
        return
      }

      this.isRedeemingCode = true
      this.errorPrompt = null
      this.redeemTx = null
      try {
        const codeNoDashes = this.code.replaceAll('-', '')
        const response = await fetch('https://subgraph.toadlytics.com:6100/coupon/redeem', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            code: codeNoDashes,
            to: this.address
          })
        })
        if (response.status == 404) {
          this.errorPrompt = 'Code not valid. It may already be redeemed.'
          return
        }
        if (response.status != 200) {
          console.error(response)
          throw new Error()
        }
        const data = await response.json()
        this.redeemTx = data.tx
      } catch (e) {
        console.error(e)
        this.errorPrompt = 'Unexpected error. Please try again later.'
      } finally {
        this.isRedeemingCode = false
      }
    }
  }
})

</script>

<style scoped>
  .faucet-page {
    display: block;
    text-align: center;
  }

  .faucet-container {
    display: inline-block;
    background: rgba(24, 29, 38, 0.7);
    border-radius: 20px;
    margin-top: 30px;
    max-width: 800px;
    padding-bottom: 50px;
  }

  .tab-container {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    padding: 30px 100px 10px 100px;
    margin-bottom: 40px;
    background: rgb(183 206 229 / 5%);;
  }

  .tabs {
    display: inline-block;
    border-radius: 10px;
    overflow: hidden;
  }

  .tab-btn {
    margin-left: 1px;
    margin-right: 1px;
    padding: 10px 20px;
    background: rgb(183 206 229 / 40%);
    border: none;
    outline: none;
    color: black;
    cursor: unset;
  }

  .tab-active {
    background: rgb(183 206 229 / 100%);
    cursor: pointer;
  }

  .content span {
    display: block;
    text-align: center;
  }

  .content div {
    display: inline-block;
  }

  .text-field {
    max-width: 600px;
    width: 360px;
  }

</style>