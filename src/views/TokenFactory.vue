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
      <h1 style="margin-bottom: 0">LaunchPAD token factory</h1>
      <v-btn
      medium
      color="primary"
      href="/launchpad"
      style="margin-top: 10px;"
      >
        Back
      </v-btn>
    </div>

    <div class="launchpad-intro">
      <p class="please-read">
        Use the form below to create your own token.
      </p>
    </div>

    </v-sheet> 




    <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    >

    <div class="form-container">
      <div class="screen-glass">
      </div>
      <div class="screen">


        
  <div class="win98-window">
  <div class="win98-title-bar">
    <div class="win98-title-bar-text">Creating your token</div>
    <div class="win98-title-bar-controls">
      <button v-on:click.prevent class="win98-button" aria-label="Minimize"></button>
      <button v-on:click.prevent class="win98-button" aria-label="Maximize"></button>
      <button v-on:click.prevent class="win98-button" aria-label="Close"></button>
    </div>
  </div>
  <div class="win98-window-body">
    <h1 class="win98-header">TOAD Token Master</h1>
    <v-stepper class="win98-fieldset" v-model="formStep">

    <v-stepper-items>
      <v-stepper-content step="1">

        <p class="win98-paragraph">This program will guide you through creating your token on Moonriver network.</p>
        <p class="win98-paragraph">Press "Continue" to proceed with creating your own token..</p>

      </v-stepper-content>

      <v-stepper-content step="2">

        <p class="win98-paragraph">Please enter the details of the token you wish to create.</p>
        
        <label for="tokenName" class="win98-label">Token name:</label><br>
        <input id="tokenName" class="win98-input" v-model="tokenName"><br><br>

        <label for="tokenName" class="win98-label">Token symbol:</label><br>
        <input id="tokenName" class="win98-input" v-model="tokenSymbol"><br><br>

        <label for="tokenName" class="win98-label">Total supply:</label><br>
        <input id="tokenName" class="win98-input" v-model="tokenSupply"><br><br>

        <label for="tokenName" class="win98-label">Decimals:</label><br>
        <input id="tokenName" class="win98-input" v-model="tokenDecimals"><br><br>


      </v-stepper-content>

      <v-stepper-content step="3">

        <p class="win98-paragraph">Please review the info below.</p>

        <label for="tokenName" class="win98-label">Token name: &nbsp;</label><br>
        <input id="tokenName" class="win98-input" v-model="tokenName" disabled><br><br>

        <label for="tokenName" class="win98-label">Token symbol: &nbsp;</label><br>
        <input id="tokenName" class="win98-input" v-model="tokenSymbol" disabled><br><br>

        <label for="tokenName" class="win98-label">Total supply: &nbsp;</label><br>
        <input id="tokenName" class="win98-input" v-model="tokenSupply" disabled><br><br>

        <label for="tokenName" class="win98-label">Decimals: &nbsp;</label><br>
        <input id="tokenName" class="win98-input" v-model="tokenDecimals" disabled><br><br>

        <p class="win98-paragraph">If the info is correct, press "Continue"</p>

      </v-stepper-content>

      <v-stepper-content step="4">

      <div>
        <p class="win98-paragraph">Pressing the button below will create your token.</p>
        <button
          class="win98-button"
          v-on:click.prevent 
          @click="submit()"
          :disabled="tokenCreated">
          Create token
        </button>
        <br><br>

        <p class="win98-paragraph">After the token is created, your token's contract address will appear here.</p>
        <input style="width: 100%" class="win98-input" v-model="tokenContractAddress" readonly>

        <p v-if="tokenCreated" class="win98-paragraph" style="margin-top: 20px;">
          Success!<br>
          Your token was created and the {{ tokenSymbol }} tokens have been sent to your wallet.<br>
          You can now use the LaunchPAD to launch your presale.<br>
          <a style="color: blue" href="/launch" target="_blank">Launch presale</a>
        </p>

      </div>

      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>

    <div style="display: block; text-align: right; padding: 20px;">
      <button
      v-if="formStep > 1 && !(tokenCreated && formStep == 4)"
      style="margin-right: 10px;"
      class="win98-button"
      color="primary"
      v-on:click.prevent 
      @click="advanceForm(-1)">
        Back
      </button>

      <button
      v-if="formStep < 4"
      class="win98-button"
      v-on:click.prevent 
      @click="advanceForm(1)"
      >
        Continue
      </button>
  </div>

  <div class="form-content">
      <div style="text-align: right; margin: 20px;">
      </div>
  </div>


  </div>
  <div class="win98-status-bar">
    <p class="win98-status-bar-field">Network: Moonriver</p>
    <p class="win98-status-bar-field">LaunchPAD</p>
    <p class="win98-status-bar-field">TOAD Network</p>
  </div>

      </div>
    </div>

  </div>
</div>

</v-form>

</v-container>
</template>

<script lang="ts">
import SliderTabs from '@/components/SliderTabs.vue'
import { EcosystemId } from '@/ecosystem'

  import Vue from 'vue'
  import { mapActions } from 'vuex'
  import AwaitLock from 'await-lock'
  import { ethers } from 'ethers'

  import { ERC20_ABI,
           LAUNCHPAD_FACTORY_ABI,
           APPROVE_AMOUNT } from '@/constants'
  import { ChainId } from '@/ecosystem'
  import { delay } from '@/utils'

  // These token symbols will not be allowed
  const symbolBlacklist = ['TOAD', 'PAD', 'USDC', 'USDT', 'DAI', 'BNB', 'BUSD', 'ETH', 'BTC', 'GLMR', 'MOVR', 'XRP', 'XMR', 'DOT', 'ADA', 'SOLAR']

  export default Vue.extend ({
    components: { SliderTabs },
    data: () => ({
      active: true,
      formStep: 1,
      maxFormStep: 4,

      valid: true,

      // Filled in the form
      tokenName: <string | null> null,
      tokenSymbol: <string | null> null,
      tokenSupply: <ethers.BigNumber | null> null,
      tokenDecimals: <number | null> 18,

      // Created token address
      tokenContractAddress: '',

      tokenCreated: <boolean> false, // Set to true when the token has been created

      syncLock: new AwaitLock()
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
      advanceForm(delta : number) {
        this.formStep += delta
        if (this.formStep < 1) 
          this.formStep = 1
        if (this.formStep > this.maxFormStep)
          this.formStep = this.maxFormStep
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
      async submit() {
      }
    }
  })
</script>

<style src="../styles/win98.css" />

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
  z-index: 1;
  position: relative;
  overflow: hidden;
  text-align: center;
  padding: 50px;
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
}

.launchpad-faq h1, .launchpad-faq p {
  margin-left: 20px;
  margin-right: 20px;
}

.perks-list li {
  margin-top: 10px;
}


/********/
/* Form */
/********/

.form-container {
  position: relative;
  background: linear-gradient(40deg, #5a5a5a 0%, #8e8e8e 100%);
  padding: 20px;
  border-radius: 20px;
  border-top: 5px solid #6e6e6e;
  border-bottom: 5px solid #232323;
  border-left: 5px solid #3c3a3a;
  border-right: 5px solid #3b3a3a;
  min-height: 40vw;
}

.screen {
  border-radius: 5px;
  border-top: 5px solid #232323;
  border-bottom: 5px solid #6e6e6e;
  border-left: 5px solid #3b3a3a;
  border-right: 5px solid #3c3a3a;
  padding: 10px;
  background-color: #00807F;
  min-height: 40vw;
}

.screen-glass {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  border-radius: 5px;
  border-top: 5px solid #232323;
  border-bottom: 5px solid #6e6e6e;
  border-left: 5px solid #3b3a3a;
  border-right: 5px solid #3c3a3a;
  padding: 10px;
  background-image: radial-gradient(circle farthest-side at 50% -5%,rgb(200 200 200 / 54%),#00000045 78%);
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

.referrals-hint {
  display: inline-block;
  border: 1px solid gray;
  border-radius: 50%;
  padding: 1px;
  width: 25px;
  text-align: center;
}

/*****************/
/* Launch button */
/*****************/

.launch-button-container {
  display: block;
  width: 100vw;
  text-align: center;
}

.launch-button-box {
  display: inline-block;
  background: radial-gradient(ellipse at center,  #333333 0%,#333333 88%,#000000 100%);  
  padding: 50px;
  border-radius: 10px;
  border-top: 5px solid #6e6e6e;
  border-bottom: 5px solid #232323;
  border-left: 5px solid #3c3a3a;
  border-right: 5px solid #3b3a3a;

}

.launch-button {
  position: relative;
  background: #00ec07;
  background: -webkit-radial-gradient( hsl(122deg 100% 44%), hsl(122deg 100% 20%) );
  background: -o-radial-gradient( hsl(122deg 100% 44%), hsl(122deg 100% 20%) );
  background: -moz-radial-gradient( hsl(122deg 100% 44%), hsl(122deg 100% 20%) );
  background: radial-gradient( hsl(122deg 100% 44%), hsl(122deg 100% 20%) );
  font-size: 2rem;
  text-shadow: 0 -1px 0 #000000;
  color: #3b5441;
  border: solid 1px #096706;
  border-radius: 100%;
  height: 160px;
  width: 160px;
  z-index: 4;
  outline: none;
  box-shadow: inset 0 1px 0 hsl(120deg 100% 50%), 0 2px 0 hsl(121deg 100% 20%), 0 3px 0 hsl(127deg 100% 18%), 0 4px 0 hsl(132deg 100% 16%), 0 5px 0 hsl(125deg 100% 14%), 0 6px 0 hsl(132deg 100% 12%), 0 7px 0 hsl(109deg 100% 10%), 0 8px 0 hsl(118deg 100% 8%), 0 9px 0 hsl(122deg 100% 6%);
}
.launch-button:hover {
  background: -webkit-radial-gradient( hsl(128deg 100% 45%), #b38c00 );
  background: -o-radial-gradient( hsl(128deg 100% 45%), #b38c00 );
  background: -moz-radial-gradient( hsl(128deg 100% 45%), #b38c00 );
  background: radial-gradient( hsl(128deg 100% 45%), #b38c00 );
}
.launch-button:active {
  background: webkit-radial-gradient( hsl(54, 100%, 43%), hsl(54, 100%, 33%) );
  background: -o-radial-gradient( hsl(54, 100%, 43%), hsl(54, 100%, 33%) );
  background: -moz-radial-gradient( hsl(54, 100%, 43%), hsl(54, 100%, 33%) );
  background: radial-gradient( hsl(54, 100%, 43%), hsl(54, 100%, 33%) );
  top: 2px;
  box-shadow: inset 0 1px 0 hsl(0deg 100% 50%), 0 2px 0 hsl(0deg 100% 20%), 0 3px 0 hsl(0deg 100% 18%), 0 4px 0 hsl(0deg 100% 16%), 0 5px 0 hsl(0deg 100% 14%), 0 6px 0 hsl(0deg 100% 12%), 0 7px 0 hsl(0deg 100% 10%), 0 8px 0 hsl(0deg 100% 8%), 0 9px 0 hsl(0deg 100% 6%)
}

.launch-button:disabled {
  background: #818181;
  background: -webkit-radial-gradient( hsl(0deg 0% 49%), hsl(0deg 0% 29%) );
  background: -o-radial-gradient( hsl(0deg 0% 49%), hsl(0deg 0% 29%) );
  background: -moz-radial-gradient( hsl(0deg 0% 49%), hsl(0deg 0% 29%) );
  background: radial-gradient( hsl(0deg 0% 49%), hsl(0deg 0% 29%) );
  font-size: 2rem;
  text-shadow: 0 -1px 0 #000000;
  color: #575757;
  border: solid 1px #4e4e4e;
  border-radius: 100%;
  height: 160px;
  width: 160px;
  z-index: 4;
  outline: none;
  box-shadow: inset 0 1px 0 hsl(0deg 0% 29%), 0 2px 0 hsl(0deg 0% 31%), 0 3px 0 hsl(0deg 0% 34%), 0 4px 0 hsl(0deg 0% 27%), 0 5px 0 hsl(0deg 0% 36%), 0 6px 0 hsl(0deg 0% 29%), 0 7px 0 hsl(0deg 0% 19%), 0 8px 0 hsl(0deg 0% 32%), 0 9px 0 hsl(0deg 0% 23%);
}

</style>
