<template>
  <v-container class="faucet-page">

    <v-card
    style="display: inline-block; max-width: 600px;"
    color="rgba(0.5, 0.5, 0.5, 0.6)"
    >
      <v-card-title>
        GLMR Faucet
      </v-card-title>
      <v-card-text class="text-left">
        This faucet is currently not active.
        <br>
        Stay tuned for updates.
      </v-card-text>
    </v-card>

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