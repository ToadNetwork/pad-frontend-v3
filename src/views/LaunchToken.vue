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
      <h1 style="margin-bottom: 0">LaunchPAD</h1>
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

        <h1>Do I need to deploy the token contract myself?</h1>
        <p>
        Currently, yes - you will need to deploy your own token contract before using the launchpad.<br>
        However, we are already working on deploying a fully automatic token factory that will allow anyone to launch a token contract in one click, without programming experience.
        <br><br>

        <v-divider></v-divider>

        <h1>What are the perks of using the launchPAD?</h1>
        <p>
        All tokens launched via the launchPAD are automatically launched with their own DPLP farms, adding extra utility to your project and ensuring that it has liquidity forever.
        <br><br>

        <v-divider></v-divider>

        <h1>Will I be able to also put my token on other exchanges?</h1>
        <p>Of course! You can always provide liquidity on any DEXes of your choice.</p>

        <v-divider></v-divider>

        <h1>What happens if the project doesn't reach its soft cap?</h1>
        <p>The presale will be canceled and the deposited funds will be returned to the users.</p>


        <v-divider></v-divider>

        <h1>Can I cancel the presale if anything goes wrong?</h1>
        <p>Yes! As long as the presale is not over, you can cancel it and return all deposited funds to the users.</p>


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



            <!-- <div class="form-line">
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
              ></v-text-field>
            </div> -->

            <div class="form-line">
              <v-text-field
              v-model="tokenContractAddress"
              :rules="contractAddressRules"
              label="Your token's contract address"
              required
              ></v-text-field>
            </div>

            <div class="form-line" v-if="tokenName && tokenName.length > 0">
              <p>{{tokenSymbol}} ({{tokenName}})</p>
              <p>Max supply: {{displayedTokenSupply}} {{tokenSymbol}}</p>
              <p>Presale contract address (after deploy): {{ presaleContractAddress }}</p>
            </div>
            <div v-else-if="tokenContractError">
              <p style="color: red">{{ tokenContractError }}</p>
            </div>
            <div v-else-if="isTokenContractLoading">
              <v-progress-circular indeterminate />
            </div>

            <div class="form-line">
              <v-text-field
              v-model="logoUrl"
              :rules="logoUrlRules"
              label="Token logo URL (leave empty if you don't have one)"
              required
              >
                <template v-slot:append>
                  <img
                  style="width: 30px"
                  :src=logoUrl>
                </template>

              </v-text-field>
            </div>

            <div class="form-line">
              <v-text-field
              v-model="telegramUrl"
              :rules="telegramUrlRules"
              label="Telegram link (leave empty if you don't have one)"
              required
              ></v-text-field>
            </div>

            <div class="form-line">
              <v-text-field
              v-model="websiteUrl"
              :rules="websiteUrlRules"
              label="Website (leave empty if you don't have one)"
              required
              ></v-text-field>
            </div>

            <div class="form-line">
              <div class="checkbox-container">
                <v-checkbox
                v-model="enableReferrals"
                color="green"
                hide-details
                >
                  <template v-slot:label>
                    Enable referrals
                    &nbsp;
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <div
                        v-bind="attrs"
                        v-on="on"
                        class="referrals-hint"
                        >
                          ?
                        </div>
                      </template>
                      <span>Allows users to refer others to your presale<br>
                      and earn a percentage of the raised funds.<br>
                      The referral rewards are covered by PadSwap<br>
                      (taken from platform fees),<br>
                      so you don't lose anything by enabling referrals.</span>
                    </v-tooltip>
                  </template>
                </v-checkbox>
              </div>
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
            :suffix="presaleCurrency"
            ></v-text-field>

            <v-text-field
            v-model="presaleSoftCap"
            label="Soft cap (25% of hard cap)"
            pattern="[0-9]"
            disabled
            readonly
            :suffix="presaleCurrency"
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
            v-model="presalePrice"
            label="Presale price"
            :rules="presalePriceRules"
            required
            >
              <template v-slot:append>
              {{tokenSymbol}} per {{presaleCurrency}}
              </template>
            </v-text-field>
          </div>

          <div class="form-line">
            <v-text-field
            v-model="presaleTokenAmount"
            disabled
            readonly
            type="number"
            :suffix="tokenSymbol"
            >
              <template v-slot:prepend>
                Number of {{tokenSymbol}} tokens in presale
              </template>
            </v-text-field>
          </div>

          <div class="form-line">
            <v-text-field
            v-model="presaleMaxContribution"
            :label="'Maximum contribution per user (0 for infinite)'"
            :rules="maxContributionRules"
            required
            type="number"
            :suffix="presaleCurrency"
            ></v-text-field>
          </div>




        </div>
      </v-col>

    </v-row>



    <div class="form-line text-center">
      <div style="display: inline-block;">
      <v-btn
        v-if="!address"
        x-large
        outlined
        width="300"
        style="color: #0fcf0f; text-transform: none"
        @click="requestConnect"
      >
        Connect Wallet
      </v-btn>
      <v-btn
        v-else
        x-large
        outlined
        width="300"
        style="color: #0fcf0f; text-transform: none"
        :disabled="tokenContract == null || isTokenContractLoading || isApproveComplete"
        @click="approve"
      >
        <template v-if="isApproveComplete">
          Approve Complete
        </template>
        <template v-else>
          Approve {{ tokenSymbol }}
        </template>
      </v-btn>
        
      </div>
    </div>

  </div>
</div>


<div class="launch-button-container">
  <div class="launch-button-box">
    <button
    :disabled="!valid || !isApproveComplete"
    type="button"
    name="button"
    @click="submit"
    class="launch-button">Launch</button>
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
      valid: true,

      presaleContractAddress: <string | null> null,
      tokenName: <string | null> null,
      tokenSymbol: <string | null> null,
      tokenSupply: <ethers.BigNumber | null> null,
      tokenDecimals: <number | null> null,
      userTokenAllowance: <ethers.BigNumber | null> null,
      userTokenBalance: <ethers.BigNumber | null> null,
      enableReferrals: <boolean> true,

      tokenContractAddress: '',
      tokenContractError: <string | null> null,

      presaleHardCap: <string> '0',
      presaleSoftCap: 0,
      presaleDuration: 0,
      presaleTokenAmount: 0,
      presalePrice: <string> '0',
      presaleMaxContribution: 0,

      // Custom data to be stored in a json string
      logoUrl: '',
      telegramUrl: '',
      websiteUrl: '',

      // Ecosystem-specific
      currentChain: '',
      backgroundImage: '',

      nameRules: [
        (v: any) => !!v || 'Token name is required',
        (v: any) => (v && v.length <= 20) || 'Token name cannot be longer than 20 characters',
      ],
      symbolRules: [
        (v: any) => !!v || 'Token symbol is required',
        (v: any) => (v && v.length <= 8) || 'Token symbol cannot be longer than 8 characters',
        (v: any) => (!symbolBlacklist.includes(v)) || 'Please don\'t create tokens that falsely represent other projects'
      ],
      supplyRules: [
        (v: any) => !!v || 'Choose the max supply of your token',
        (v: any) => (v && v.length <= 13 && parseFloat(v) <= 1000000000000) || 'Let\'s be reasonable, you don\'t need more than a trillion tokens',
        (v: any) => (v && parseInt(v) != 0) || '0 tokens is not enough',
        (v: any) => (parseFloat(v) % 1 == 0 && parseFloat(v) > 0 && /[0-9]/.test(v)) || 'Input a positive integer number'
      ],
      hardCapRules: [
        (v: any) => !!v || 'Choose the hard cap of the presale',
        (v: any) => (v && v.length <= 10 && parseFloat(v) <= 1000000000) || 'That\'s unreasonably high',
        (v: any) => (parseFloat(v) > 0 && /[0-9]/.test(v)) || 'Input a positive number'
      ],
      durationRules: [
        (v: any) => !!v || 'You need to specify the presale duration',
        (v: any) => (v && v.length <= 3 && parseFloat(v) <= 168 && parseFloat(v) >= 12) || 'Choose a value between 12 and 168 hours',
        (v: any) => (parseFloat(v) % 1 == 0 && /[0-9]/.test(v)) || 'Input a positive integer number'
      ],
      presalePriceRules: [
        (v: any) => !!v || 'Specify the price of your tokens during presale',
        (v: any) => (parseFloat(v) > 0) || 'Input a positive number'
      ],
      contractAddressRules: [
        (v: any) => !!v || 'Specify your token\'s contract address',
        (v: any) => (v.length == 42 && v.slice(0, 2) == '0x') || 'Not a valid contract address'
      ],
      maxContributionRules: [
        (v: any) => !!v || 'Specify the maximum contribution per user (0 for infinite)',
        (v: any) => (parseFloat(v) > 0) || 'Input a positive number'
      ],
      websiteUrlRules: [],
      logoUrlRules: [],
      telegramUrlRules: [],
      validationCheckbox: false,
      active: true,
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
      },
      tokenContract(): ethers.Contract | null {
        if (!ethers.utils.isAddress(this.tokenContractAddress)) {
          return null
        }

        return new ethers.Contract(this.tokenContractAddress, ERC20_ABI, this.multicall)
      },
      factoryContract(): ethers.Contract {
        return new ethers.Contract(this.$store.getters.ecosystem.launchPadFactoryAddress, LAUNCHPAD_FACTORY_ABI, this.multicall)
      },
      factoryContractSigner(): ethers.Contract | null {
        if (!this.web3) {
          return null
        }

        return this.factoryContract.connect(this.web3)
      },
      isTokenContractLoading(): boolean {
        return ethers.utils.isAddress(this.tokenContractAddress) && this.tokenName === null
      },
      isApproveComplete(): boolean {
        if (this.userTokenAllowance === null) {
          return false
        }

        const maxApprove = ethers.BigNumber.from(APPROVE_AMOUNT)
        return this.userTokenAllowance.eq(maxApprove)
      },
      displayedTokenSupply(): string | null {
        if (!this.tokenSupply || !this.tokenDecimals) {
          return null
        }

        return ethers.utils.formatUnits(this.tokenSupply, this.tokenDecimals)
      },
      presaleCurrency(): string {
        return this.$store.getters.ecosystem.ethName
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
      async approve() {
        const tokenContract = this.tokenContract!.connect(this.web3!)
        const tx = await tokenContract.populateTransaction.approve(this.presaleContractAddress, APPROVE_AMOUNT)
        await this.safeSendTransaction({ tx, targetChainId: this.chainId })
      },
      async submit() {
        if (!this.factoryContractSigner) {
          this.requestConnect()
          return
        }

        const form = this.$refs.form as any
        if (!form.validate()) {
          return
        }

        const buyLimit = ethers.utils.parseEther(this.presaleMaxContribution.toString())
        const hardCap = ethers.utils.parseEther(this.presaleHardCap)
        const tokensPerEth = ethers.utils.parseUnits(this.presalePrice, this.tokenDecimals!)
        const durationTime = parseFloat(this.presaleDuration.toString()) * 60 * 60
        const presaleInfo = JSON.stringify({
          tokenLogoUrl: this.logoUrl,
          telegramUrl: this.telegramUrl,
          websiteUrl: this.websiteUrl
        })

        const tx = await this.factoryContractSigner.populateTransaction.createPresale(
          this.tokenContract!.address,
          buyLimit,
          hardCap,
          tokensPerEth,
          durationTime,
          presaleInfo
        )
        await this.safeSendTransaction({ tx, targetChainId: this.chainId })
      },
      copyAddress (address : string) {
        let textArea = document.createElement("textarea")
        textArea.value = address
        textArea.style.top = "0"
        textArea.style.left = "0"
        textArea.style.position = "fixed"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        let successful = document.execCommand('copy')

        document.body.removeChild(textArea)
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
        const tokenContract = this.tokenContract
        if (!tokenContract) {
          return
        }

        const contractCode = await this.multicall.getCode(tokenContract.address)
        if (contractCode == '0x') {
          this.tokenContractError = 'Address is not a valid ERC20 contract'
          return
        }

        const contractData = {
          presaleContractAddress: <string | null> null,
          tokenName: <string | null> null,
          tokenSymbol: <string | null> null,
          tokenSupply: <ethers.BigNumber | null> null,
          tokenDecimals: <number | null> null,
          userTokenAllowance: <ethers.BigNumber | null> null,
          userTokenBalance: <ethers.BigNumber | null> null
        }

        // TODO: check if address is a valid ERC20
        const promises = [
          // this.factoryContract.getPresaleAddress(tokenContract.address).then((a: string) => contractData.presaleContractAddress = a),
          tokenContract.name().then((n: string) => contractData.tokenName = n),
          tokenContract.symbol().then((s: string) => contractData.tokenSymbol = s),
          tokenContract.totalSupply().then((s: ethers.BigNumber) => contractData.tokenSupply = s),
          tokenContract.decimals().then((d: number) => contractData.tokenDecimals = d)
        ]
        if (this.address) {
          promises.push(
            // tokenContract.allowance(this.address, this.presaleContractAddress).then((a: ethers.BigNumber) => contractData.userTokenAllowance = a),
            tokenContract.balanceOf(this.address).then((b: ethers.BigNumber) => contractData.userTokenBalance = b)
          )
        }
        await Promise.all(promises)
        // TODO: remove when new launchpad contract is deployed
        contractData.presaleContractAddress = '0x0000000000000000000000000000000000000000'

        if (tokenContract.address == this.tokenContract?.address) {
          Object.assign(this, contractData)
        }
      },
      ...mapActions(['requestConnect', 'safeSendTransaction'])
    },
    watch: {
      presalePrice: function(newAmount) {
        this.presaleTokenAmount = Math.ceil(parseFloat(this.presalePrice) * parseFloat(this.presaleHardCap))
      },
      presaleHardCap: function(newSupply) {
        this.presaleSoftCap = parseFloat(this.presaleHardCap) * 0.25
        this.presaleTokenAmount = Math.ceil(parseFloat(this.presalePrice) * parseFloat(this.presaleHardCap))
      },
      tokenContractAddress(val) {
        this.tokenContractError = null
        if (!ethers.utils.isAddress(val)) {
          this.presaleContractAddress = null,
          this.tokenName = null
          this.tokenSymbol = null
          this.tokenSupply = null
          this.tokenDecimals = null
          this.userTokenAllowance = null
          this.userTokenBalance = null
          return
        }

        setTimeout(() => this.sync())
      },
      ecosystemId() {
        this.tokenContractAddress = ''
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
