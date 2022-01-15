<template>
  <v-container class="faucet-page">


    <h1>GLMR Faucet</h1>
    <div class="faucet-container">

      <div class="tab-container">
        <div class="tabs">
          <button
          v-for="tab in tabs"
          :key="tab"
          @click="selected = tab;"
          :class="['tab-btn', { 'tab-active': selected === tab }]"
          >
          {{ tab }}
          </button>
        </div>

        <div class="tab-description" style="display:block; padding-top: 20px;">
          <span v-if="selected == 'Send GLMR for BNB'">Directly send GLMR by depositing BNB</span>
          <span v-if="selected == 'Redeem code'">Redeem a code to get GLMR</span>
          <span v-if="selected == 'Create code'">Create a code to share with others or use later</span>
        </div>
      </div>

      <div class="content">
        <div v-if="selected == 'Send GLMR for BNB'">
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


          <span>Your GLMR wallet:</span>
          <v-text-field
              class="text-field"
              filled
              outlined
              placeholder="0x..."
              type="string"
              style="margin-bottom: 0;"
              hide-details>
          </v-text-field>
          <br>
<!--            <v-btn
            @click=""
            small
            :ripple="true"
            color="gray"
            class="my-3"
            style="margin:0;">
            Same as BSC address?
          </v-btn> -->

          <br><br>
          <v-btn
            @click=""
            x-large
            :ripple="true"
            color="primary"
            class="my-3">
            Send GLMR
          </v-btn>

        </div>

        <div v-if="selected == 'Redeem code'">
          

          <span>Enter code:</span>
          <v-text-field
              class="text-field"
              filled
              outlined
              clearable
              placeholder="XXXXX-XXXXX-XXXXX"
              type="string">
          </v-text-field>

          <span>Your GLMR wallet:</span>
          <v-text-field
              class="text-field"
              filled
              outlined
              clearable
              placeholder="0x..."
              type="string">
          </v-text-field>

          <br>
          <v-btn
            @click=""
            x-large
            :ripple="true"
            color="primary"
            class="my-3">
            Redeem GLMR
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
            @click=""
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
export default Vue.extend({
  data () {
    return {
      tabs: ["Send GLMR for BNB", "Redeem code", "Create code"],
      selected: "Send GLMR for BNB",
      createdCode: '28MCD-9KDJ2-0HK1O'
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
  cursor: pointer;
  border: none;
  outline: none;
  color: black;
  }

  .tab-active {
  background: rgb(183 206 229 / 100%);
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
  }

</style>