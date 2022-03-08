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

    <v-form
    ref="form"
    v-model="valid"
    class="form"
    >
      <div class="form-container text-center">

        <!-- Farm type -->
        <v-row
        align="stretch"
        justify="center">
          <v-col
          cols="12"
          sm="6">
            <v-card
            style="height:100%"
            elevation="5"
            :color="getFarmTypeButtonColor(farmType == 'dplp')"
            @click="farmType = 'dplp'">
              <v-card-title style="display:inline-block;">
                DPLP farm
              </v-card-title>
              <v-card-subtitle>
                10% fee when staking/unstaking
              </v-card-subtitle>
              <v-card-text>
                Stake LP tokens, earn more LP tokens
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
          cols="12"
          sm="6">
            <v-card
            style="height:100%"
            elevation="5"
            :color="getFarmTypeButtonColor(farmType == 'partner')"
            @click="farmType = 'partner'">
              <v-card-title style="display:inline-block;">
                Partner farm
              </v-card-title>
              <v-card-subtitle>
                1% fee when staking/unstaking
              </v-card-subtitle>
              <v-card-text>
                Stake LP tokens, earn partner token
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row
        align="center"
        justify="center">
          <v-col
          v-if="farmType != ''"
          cols="12"
          md="6"
          style="padding: 3%">
            <v-text-field
            label="LP token address"
            :rules="contractAddressRules"
            required>
            </v-text-field>
            <v-text-field
            label="LP tokens to provide"
            :rules="tokenAmountRules"
            required>
            </v-text-field>
          </v-col>
          <v-col
          v-if="farmType == 'partner'"
          cols="12"
          md="6"
          style="padding: 3%">
            <v-text-field
            label="Partner token address"
            :rules="farmType == 'partner' ? contractAddressRules : true"
            :required="farmType == 'partner'">
            </v-text-field>
            <v-text-field
            label="Partner tokens to provide"
            :rules="farmType == 'partner' ? tokenAmountRules : true"
            :required="farmType == 'partner'">
            </v-text-field>
          </v-col>
        </v-row>

        <div class="text-center">
          <v-btn
          style="margin-top:20px"
          x-large
          color="primary"
          :disabled="!valid"
          @click="submit">
            Create farm
          </v-btn>
        </div>

      </div>

    </v-form>

  </v-container>
</template>

<script lang="ts">
import SliderTabs from '@/components/SliderTabs.vue'
import { EcosystemId, IEcosystem } from '@/ecosystem'

  import Vue from 'vue'
  import { mapActions } from 'vuex'
  import AwaitLock from 'await-lock'
  import { ethers } from 'ethers'

  import { ERC20_ABI } from '@/constants'
  import { ChainId } from '@/ecosystem'
  import { equalsInsensitive, delay } from '@/utils'


  export default Vue.extend ({
    components: { SliderTabs },
    data: () => ({
      valid: false,
      hostname: <string> '',


      farmType: <"dplp" | "partner" | ''> '',

      active: true,
      syncLock: new AwaitLock(),

      tokenAmountRules: [
        (v: any) => !!v || 'Choose the amount of tokens to provide',
        (v: any) => (v && parseInt(v) != 0) || '0 tokens is clearly not enough',
        (v: any) => (parseFloat(v) >= 0 && (/[0-9]*(?:\.[0-9]*)?/.test(v))) || 'Input a valid positive number'
      ],
      contractAddressRules: [
        (v: any) => !!v || 'Specify the contract address',
        (v: any) => (v.length == 42 && v.slice(0, 2) == '0x') || 'Not a valid contract address.'
      ],
    }),
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
      }
    },
    async mounted() {
      while (this.active) {
        try {
          await this.sync()
        } catch (e) {
          console.error(e)
        }

        await delay(3000)
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
      getFarmTypeButtonColor(selected : boolean) {
        if (selected) {
          return "#437742"
        }
        else {
          return "#1e1e1e6b"
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
      async submit() {
        const form = this.$refs.form as any
        if (!form.validate()) {
          return
        }
      },
      async sync() {
        await this.syncLock.acquireAsync()
        try {
          await this.syncInternal()
        } finally {
          this.syncLock.release()
        }
      },
      async syncInternal() {
      }
    },
    watch: {
      ecosystemId() {
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

/********/
/* FAQ */
/********/

.launchpad-intro {
  margin-top: 25px;
}

.v-expansion-panels {
  background: none !important;
  border: none !important;
}

.v-expansion-panel {
  background-color: #00000085 !important;
}

.v-expansion-panel-header:hover {
  background-color: #d2f3f21a !important;
}

.launchpad-faq {
  border-radius: 20px;
  overflow: hidden;
  text-align: left;
}

.launchpad-faq h1 {
  background-color: #80808012;
  padding: 10px;
  border-radius: 10px;
  margin-top: 15px;
  font-size: 1rem;
  color: #f7f7f7;
}
.launchpad-faq p, .launchpad-faq li {
  color: #abc2bf;
}

.perks-list li {
  margin-top: 10px;
}


/********/
/* Form */
/********/

.form {
  text-align: center;
}
.form-container {
  background: rgba(24, 29, 38, 0.7) !important;
  border-radius: 20px;
  padding: 20px;
  width: 100%;
  max-width: 1000px;
  display: inline-block;
}


.token-settings {
  padding-right: 10px;
}

.presale-settings {
  padding-left: 10px;
}

.form-line {
  display: block !important;
  margin-top: 10px;
  margin-bottom: 10px;
}

.presale-contract-address {
  margin-bottom: 15px;
}

.address-box {
  display: inline-block;
  border: 1px solid green;
  padding-left: 10px;
  border-radius: 10px;
}

/* Referrals checkbox */

.checkbox-container {
  display: inline-block;
}

.hint-icon {
  display: inline-block;
  border: 1px solid gray;
  border-radius: 50%;
  padding: 1px;
  width: 25px;
  height: 25px;
  color: #c3c0c0;
  line-height: 21px;
  text-align: center;
}


</style>
