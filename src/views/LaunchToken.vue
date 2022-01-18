<template>
  <v-container>

    <v-sheet class="launchpad-title-bar">
    <div class="launchpad-title">
      <img class="launchpad-image" src="@/assets/icons/LaunchPAD Icon.svg">
      <h1 style="margin-bottom: 0">LaunchPAD</h1>
      <v-btn
      medium
      color="primary"
      href="/launchpad"
      >
        Back
      </v-btn>
    </div>

    <div class="launchpad-intro">
      <p>
        LaunchPAD allows users to launch a token in a single click, without coding knowledge or complicated steps.
      </p>
      <p class="please-read">
        Before launching a token, make sure to read the <b>Launchpad FAQ</b> below.
      </p>
    </div>

    <div class="launchpad-faq">
      <v-expansion-panels
      inset>
      <v-expansion-panel>
      <v-expansion-panel-header style="text-align:center !important; display: block">
        Click here to read
      </v-expansion-panel-header>
      <v-expansion-panel-content>

        <v-divider></v-divider>

        <h1>- Are there any perks of using the launchPAD?</h1>
        <p>Yes!<br>
        All tokens launched via the launchPAD are automatically eligible for:</p>
        <ul>
          <li>DPLP farms, adding extra utility to your project and ensuring that it has liquidity forever</li>
          <li>BogTools bot</li>
          <li>// other stuff, I guess?</li>
        </ul>
        <br>

        <v-divider></v-divider>

        <h1>What happens if the project doesn't reach its soft cap?</h1>
        <p>The presale will be canceled and the deposited funds will be returned to the users.</p>

        <v-divider></v-divider>

        <h1>- What will happen to the funds raised during the presale?</h1>
        <p>// no info yet</p>


      </v-expansion-panel-content>
      </v-expansion-panel>
      </v-expansion-panels>
    </div>
    </v-sheet> 




    <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    >

    <div class="form-container">
      <div class="screen">

        <v-row>
          <v-col
          cols="12"
          sm="6">
          <div class="token-settings">
            <h4>Declare your cargo</h4>
            <v-divider color="green" style="margin: 20px 0;"></v-divider>

            <div class="form-line">
              <v-text-field
              v-model="tokenName"
              :counter="20"
              :rules="nameRules"
              label="Token name"
              required
              ></v-text-field>
            </div>


            <div class="form-line">
              <v-text-field
              v-model="tokenSymbol"
              :counter="8"
              :rules="symbolRules"
              label="Token symbol"
              required
              ></v-text-field>
            </div>


            <div class="form-line">
              <v-text-field
              v-model="tokenSupply"
              :counter="13"
              :rules="supplyRules"
              label="Max supply"
              required
              type="number"
              step="1"
              min="20"
              ></v-text-field>
            </div>


            <div class="form-line">
              <v-checkbox
              v-model="cargoCheckbox"
              :rules="[v => !!v || 'Confirm that the data you entered is correct']"
              label="Confirm cargo"
              required
              ></v-checkbox>
            </div>

          </div>
        </v-col>

        <v-divider vertical color="green"></v-divider>

        <v-col
        cols="12"
        sm="6">
        <div class="presale-settings">
          <h4>Set up your mission</h4>
          <v-divider color="green" style="margin: 20px 0;"></v-divider>


          <div class="form-line">
            <v-text-field
            v-model="presaleHardCap"
            :counter="9"
            :rules="hardCapRules"
            label="Presale hard cap"
            pattern="[0-9]"
            required
            type="number"
            step="1"
            min="20"
            suffix="GLMR"
            ></v-text-field>

            <v-text-field
            v-model="presaleSoftCap"
            label="Soft cap (25% of hard cap)"
            pattern="[0-9]"
            disabled
            readonly
            suffix="GLMR"
            ></v-text-field>
          </div>


          <div class="form-line">
            <v-text-field
            v-model="presaleDuration"
            :counter="3"
            :rules="durationRules"
            label="Maximum presale duration (from 12 to 168 hours)"
            pattern="[0-9]"
            required
            type="number"
            step="1"
            suffix="hours"
            ></v-text-field>
          </div>


          <div class="form-line">
            <v-text-field
            v-model="presaleTokenAmount"
            :counter="13"
            :rules="presaleTokenAmountRules"
            label="Number of tokens in presale"
            pattern="[0-9]"
            required
            type="number"
            :suffix="tokenSymbol"
            ></v-text-field>
          </div>


          <div class="form-line">
            <v-text-field
            v-model="presalePrice"
            label="Presale price (calculated automatically)"
            disabled
            readonly
            :suffix=" tokenSymbol + ' per GLMR'"
            ></v-text-field>
          </div>

        </div>
      </v-col>

    </v-row>
  </div>
</div>


<div class="launch-button-container">
  <div class="launch-button-box">
    <button
    :disabled="!valid"
    type="button"
    name="button"
    @click="submit"
    class="launch-button">Launch</button>
  </div>
</div>

</v-form>

</v-container>
</template>

<script>
  // These token symbols will not be allowed
  let symbolBlacklist = ['TOAD', 'PAD', 'USDC', 'USDT', 'DAI', 'BNB', 'BUSD', 'ETH', 'BTC', 'GLMR', 'MOVR', 'XRP', 'XMR', 'DOT', 'ADA', 'SOLAR']

  import Vue from 'vue'
  export default Vue.extend ({
    data: () => ({
      valid: true,
      tokenName: '',
      tokenSymbol: '',
      tokenSupply: 0,
      presaleHardCap: 0,
      presaleSoftCap: 0,
      presaleDuration: 0,
      presaleTokenAmount: 0,
      presalePrice: 0,
      presaleEndTime: 0,
      nameRules: [
      v => !!v || 'Token name is required',
      v => (v && v.length <= 20) || 'Token name cannot be longer than 20 characters',
      ],
      symbolRules: [
      v => !!v || 'Token symbol is required',
      v => (v && v.length <= 8) || 'Token symbol cannot be longer than 8 characters',
      v => (!symbolBlacklist.includes(v)) || 'Please don\'t create tokens that falsely represent other projects'
      ],
      supplyRules: [
      v => !!v || 'Choose the max supply of your token',
      v => (v && v.length <= 13 && parseFloat(v) <= 1000000000000) || 'Let\'s be reasonable, you don\'t need more than a trillion tokens',
      v => (v && parseInt(v) != 0) || '0 tokens is not enough',
      v => (parseFloat(v) % 1 == 0 && parseFloat(v) > 0 && /[0-9]/.test(v)) || 'Input a positive integer number'
      ],
      hardCapRules: [
      v => !!v || 'Choose the hard cap of the presale',
      v => (v && v.length <= 10 && parseFloat(v) <= 1000000000) || 'That\'s unreasonably high',
      v => (parseFloat(v) > 0 && /[0-9]/.test(v)) || 'Input a positive number'
      ],
      durationRules: [
      v => !!v || 'You need to specify the presale duration',
      v => (v && v.length <= 3 && parseFloat(v) <= 168 && parseFloat(v) >= 12) || 'Choose a value between 12 and 168 hours',
      v => (parseFloat(v) % 1 == 0 && /[0-9]/.test(v)) || 'Input a positive integer number'
      ],
      presaleTokenAmountRules: [
      v => !!v || 'Specify the number of tokens allocated to the presale',
      v => (parseFloat(v) % 1 == 0 && /[0-9]/.test(v)) || 'Input a positive integer number'
      ],
      cargoCheckbox: false,
    }),
    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          this.presaleEndTime = Date.now() + this.presaleDuration * 60 * 60 * 1000
        }
      }
    },
    watch: {
      tokenSymbol: function(newSymbol) {
        this.tokenSymbol = newSymbol.toUpperCase()
      },
      presaleTokenAmount: function(newAmount) {
        this.presalePrice = parseFloat(this.presaleTokenAmount) / parseFloat(this.presaleHardCap)
      },
      tokenSupply: function(newSupply) {
        this.presalePrice = parseFloat(this.presaleTokenAmount) / parseFloat(this.presaleHardCap)
      },
      presaleHardCap: function(newSupply) {
        this.presaleSoftCap = parseFloat(this.presaleHardCap) * 0.25
        this.presalePrice = parseFloat(this.presaleTokenAmount) / parseFloat(this.presaleHardCap)
      }
    }
  })
</script>
<style>

/* Title bar */
.launchpad-title-bar {
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
  background-color: #ffffff05 !important;
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


/********/
/* Form */
/********/

.form-container {
  background: linear-gradient(40deg, #5a5a5a 0%, #8e8e8e 100%);
  padding: 20px;
  border-radius: 20px;
  border-top: 5px solid #6e6e6e;
  border-bottom: 5px solid #232323;
  border-left: 5px solid #3c3a3a;
  border-right: 5px solid #3b3a3a;
}

.screen {
  border-radius: 5px;
  border-top: 5px solid #232323;
  border-bottom: 5px solid #6e6e6e;
  border-left: 5px solid #3b3a3a;
  border-right: 5px solid #3c3a3a;
  padding: 10px;
  background-image: radial-gradient(circle farthest-side at 50% -20%,rgb(0 0 0 / 35%),#0e1219 78%);
}

.screen, label {
  color: #0fcf0f !important;
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
  background: #ec0000;
  background: -webkit-radial-gradient( hsl(0deg 100% 50%), hsl(0deg 100% 40%) );
  background: -o-radial-gradient( hsl(0deg 100% 50%), hsl(0deg 100% 40%) );
  background: -moz-radial-gradient( hsl(0deg 100% 50%), hsl(0deg 100% 40%) );
  background: radial-gradient( hsl(0deg 100% 50%), hsl(0deg 100% 40%) );
  font-size: 2rem;
  text-shadow: 0 -1px 0 #c30707;
  color: #3b5441;
  border: solid 1px hsl(0deg 100% 20%);
  border-radius: 100%;
  height: 160px;
  width: 160px;
  z-index: 4;
  outline: none;
  box-shadow: inset 0 1px 0 hsl(0deg 100% 50%), 0 2px 0 hsl(0deg 100% 20%), 0 3px 0 hsl(0deg 100% 18%), 0 4px 0 hsl(0deg 100% 16%), 0 5px 0 hsl(0deg 100% 14%), 0 6px 0 hsl(0deg 100% 12%), 0 7px 0 hsl(0deg 100% 10%), 0 8px 0 hsl(0deg 100% 8%), 0 9px 0 hsl(0deg 100% 6%)
}
.launch-button:hover {
  background: -webkit-radial-gradient( hsl(0deg 100% 45%), hsl(0deg 100% 35%) );
  background: -o-radial-gradient( hsl(0deg 100% 45%), hsl(0deg 100% 35%) );
  background: -moz-radial-gradient( hsl(0deg 100% 45%), hsl(0deg 100% 35%) );
  background: radial-gradient( hsl(0deg 100% 45%), hsl(0deg 100% 35%) );
}
.launch-button:active {
  background: webkit-radial-gradient( hsl(54, 100%, 43%), hsl(54, 100%, 33%) );
  background: -o-radial-gradient( hsl(54, 100%, 43%), hsl(54, 100%, 33%) );
  background: -moz-radial-gradient( hsl(54, 100%, 43%), hsl(54, 100%, 33%) );
  background: radial-gradient( hsl(54, 100%, 43%), hsl(54, 100%, 33%) );
  top: 2px;
  box-shadow: inset 0 1px 0 hsl(0deg 100% 50%), 0 2px 0 hsl(0deg 100% 20%), 0 3px 0 hsl(0deg 100% 18%), 0 4px 0 hsl(0deg 100% 16%), 0 5px 0 hsl(0deg 100% 14%), 0 6px 0 hsl(0deg 100% 12%), 0 7px 0 hsl(0deg 100% 10%), 0 8px 0 hsl(0deg 100% 8%), 0 9px 0 hsl(0deg 100% 6%)
}


</style>
