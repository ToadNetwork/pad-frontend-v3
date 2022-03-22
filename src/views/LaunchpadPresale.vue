<template>
  <v-container>
    <div v-if="customTokenWarning" class="token-warning">
      <h3>DYOR!</h3>
      <br>
      <p>This token uses a custom contract, and as such, PadSwap cannot give any guarantees about its safety.</p>
      <p>Please do your own research before investing.</p>
    </div>

    <v-sheet
    v-if="!isPresaleValid"
    class="launchpad-title-bar">
    <div class="launchpad-title">
      <img class="launchpad-image" src="@/assets/icons/LaunchPAD Icon.svg">
      <h1 style="padding-bottom: 0; margin-bottom: 15px;">Oops!</h1>
      <p>We couldn't find a presale with the specified address on {{$store.getters.ecosystem.routeName}} network.</p>

      <div style="display:inline-block; margin-bottom: 30px; max-width: 900px;">
      <ul>
        <li>Make sure that you selected the right ecosystem when searching for this presale.</li>
        <li>Double-check the address. Presale address is NOT the same as the token address.</li>
      </ul>
      </div> 
      <br>

      <v-btn
      medium
      color="primary"
      to="/launchpad"
      >
        Back to launchpad
      </v-btn>
    </div>
    </v-sheet>

    <v-sheet v-if="isPresaleValid" class="launchpad-title-bar">
    <div class="text-right">


      <v-btn
      v-if="presaleImported()"
      color="green"
      @click="removePresale()">
        <v-icon>mdi-star</v-icon>&nbsp;Remove from favorites
      </v-btn>
      <v-btn
      v-else
      color="#4d7ea5"
      @click="importPresale()">
        <v-icon>mdi-star-outline</v-icon>&nbsp;Add to favorites
      </v-btn>
    </div>
    <div class="launchpad-title">
      <img class="launchpad-image" :src="displayedSale.presaleInfo.tokenLogoUrl">
      <h1 style="padding-bottom: 0; word-wrap: break-word;">${{displayedSale.tokenSymbol}} ({{displayedSale.tokenName}}) presale</h1>
      <v-btn
      medium
      color="primary"
      href="/launchpad"
      >
        Back
      </v-btn>
    </div>
    <v-row
    align="center"
    justify="center">
      <v-col
      cols="12"
      sm="6"
      class="data-card">
        <h3>Token info</h3>
        <v-divider></v-divider>
        <v-simple-table class="data-table">
          <tbody>
            <tr>
              <td>Token contract</td>
              <td v-html="tokenContractLink()"></td>
            </tr>
            <tr>
              <td>Token symbol</td>
              <td>{{ displayedSale.tokenSymbol }}</td>
            </tr>
            <tr>
              <td>Total supply</td>
              <td>{{ formatNumberWithCommas(displayedSale.tokenSupply) }} {{ displayedSale.tokenSymbol }}</td>
            </tr>
            <tr>
              <td>Website</td>
              <td><a :href="displayedSale.presaleInfo.websiteUrl" target="_blank">{{displayedSale.presaleInfo.websiteUrl}}</a></td>
            </tr>
            <tr>
              <td>Telegram</td>
              <td><a :href="displayedSale.presaleInfo.telegramUrl" target="_blank">{{displayedSale.presaleInfo.telegramUrl}}</a></td>
            </tr>
            <tr>
              <td>Discord</td>
              <td><a :href="displayedSale.presaleInfo.discordUrl" target="_blank">{{displayedSale.presaleInfo.discordUrl}}</a></td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>

      <v-divider vertical></v-divider>

      <v-col
      cols="12"
      sm="6"
      class="data-card">
        <h3>Presale info</h3>
        <v-divider></v-divider>
        <v-simple-table class="data-table">
          <tbody>
            <tr>
              <td>Tokens in presale</td>
              <td :style="suppliedTokenStyle">{{ formatNumberWithCommas(displayedSale.presaleTokenAmount) }} {{ displayedSale.tokenSymbol }}
                ({{
                  trimNumber(
                    (displayedSale.presaleTokenAmount / displayedSale.tokenSupply) * 100
                  ) 
                }}% of supply)</td>
            </tr>
            <tr>
              <td>Total tokens provided by owner (presale + DPLP)</td>
              <td :style="suppliedTokenStyle">{{ formatNumberWithCommas(parseFloat(displayedSale.presaleTokenAmount) * 1.72) }} {{ displayedSale.tokenSymbol }}
                ({{
                  trimNumber(
                    ((parseFloat(displayedSale.presaleTokenAmount) * 1.72) / displayedSale.tokenSupply) * 100
                  ) 
                }}% of supply)</td>
            </tr>
            <tr>
              <td>Hard cap</td>
              <td>{{ displayedSale.presaleHardCap }} {{ presaleCurrency }}</td>
            </tr>
            <tr>
              <td>Soft cap</td>
              <td>{{ displayedSale.presaleSoftCap }} {{ presaleCurrency }}</td>
            </tr>
            <tr>
              <td>Price</td>
              <td>{{ formatNumberWithCommas(displayedSale.presaleTokenAmount/displayedSale.presaleHardCap) }} {{ displayedSale.tokenSymbol }} per {{ presaleCurrency }}</td>
            </tr>
            <tr>
              <td>Maximum contribution</td>
              <td>{{ displayedSale.maxContribution }} {{ presaleCurrency }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
      
      </v-row>
    </v-sheet>

    <div v-if="isPresaleValid" class="presale-form-container">
      <div class="presale-form-box">

        <!---------------------------------------->
        <!-- Countdown timer for active presale -->
        <!---------------------------------------->
        <div v-if="presaleIsActive == true && presaleIsAborted == false" class="form-line">
          <div class="time-left-box">
            <p class="time-left-title">Time left:</p>
            <v-row class="time-left-counter">
              <v-col cols="4"><span class="time-number">{{hoursLeft}}</span></v-col>
              <v-col cols="4"> <span class="time-number">{{minutesLeft}}</span></v-col>
              <v-col cols="4"><span class="time-number">{{secondsLeft}}   </span></v-col>
            </v-row>
            <v-row>
              <v-col cols="4"><span class="time-description">Hours</span></v-col>
              <v-col cols="4"> <span class="time-description">Minutes</span></v-col>
              <v-col cols="4"><span class="time-description">Seconds</span></v-col>
            </v-row>
          </div>

          <v-divider></v-divider>
        
          <div class="time-left-description">
            <p>
              The presale will end when the timer expires or when the hard cap is reached, whichever comes first.
            </p>
            <p>
              If the presale fails to reach the soft cap, the token will <u>not</u> be launched, and user deposits will be refunded.
            </p>
          </div>
        </div>

        <!---------------------->
        <!-- Presale finished -->
        <!---------------------->
        <div v-if="presaleIsCompleted" class="form-line">

          <h2 class="presale-success-title">Presale finished</h2>

          <v-divider></v-divider>
        
          <br>
          <p>This presale has ended.</p>
          <p>If you participated in this presale, use the button below to claim your {{ displayedSale.tokenSymbol }}.</p>

        </div>

        <!--------------------->
        <!-- Presale aborted -->
        <!--------------------->
        <div v-if="presaleIsAborted == true" class="form-line">
          
          <h2 class="presale-aborted-title">Presale aborted</h2>

          <v-divider></v-divider>
        
          <br>
          <p>Possible reasons may include failing to reach the soft cap or being canceled by the presale owner.</p>
          <p>If you participated in this presale, use the button below to withdraw your deposited {{ presaleCurrency }}.</p>

        </div>

        <v-divider></v-divider>

        <div v-if="presaleIsActive == true && presaleIsAborted == false" class="presale-progress-title">Presale progress:</div>
        <div v-if="presaleIsActive == true && presaleIsAborted == false" class="presale-progress">
          <v-progress-linear
          :value="(parseFloat(displayedSale.presaleRaised) / parseFloat(displayedSale.presaleHardCap)) * 100"
          color="#12a362"
          height="25"
          >{{ displayedSale.presaleRaised }} {{ presaleCurrency }} / {{ displayedSale.presaleHardCap }} {{ presaleCurrency }}</v-progress-linear>
        </div>

        <!----------------------------------------->
        <!-- Participating in the active presale -->
        <!----------------------------------------->
        <div v-if="presaleIsActive == true && presaleIsAborted == false">
          <v-form
          v-model="depositFormValid">

          <div class="form-line">
            <v-text-field
            v-model="amountToDeposit"
            label="Amount to deposit"
            :suffix="presaleCurrency"
            :rules="validDepositAmount()"
            ></v-text-field>
          </div>

          <div class="form-line">
            <v-text-field
            v-model="tokensGiven"
            label="You will receive"
            :suffix="tokenSymbol"
            disabled
            readonly
            ></v-text-field>

          </div>

          <div class="form-line">
            <v-btn
            x-large
            color="primary"
            :disabled="!depositFormValid"
            @click="deposit">
              <template>
                Deposit {{ presaleCurrency }}
              </template>
            </v-btn>
          </div>
          </v-form>
        </div>

        <!----------------------->
        <!-- Claiming a refund -->
        <!----------------------->
        <div v-if="presaleIsAborted == true">
          <div class="form-line">
            <v-btn
            x-large
            color="primary"
            @click="refund">
              <template>
                Withdraw {{ displayedSale.yourContribution }} {{ presaleCurrency }}
              </template>
            </v-btn>
          </div>
        </div>

        <!---------------------------------------------->
        <!-- Claiming tokens after successful presale -->
        <!---------------------------------------------->
        <div v-if="presaleIsCompleted">
          <div class="form-line">
            <v-btn
            x-large
            color="green"
            @click="claimTokens">
              <template>
                Claim {{ displayedSale.tokenSymbol }}
              </template>
            </v-btn>
          </div>
        </div>

        <!-- Your current contribution will always be displayed, regardless of the state of the presale, as long as your wallet is connected -->
        <div class="form-line your-contribution">
          Your contribution: {{ displayedSale.yourContribution }} {{ presaleCurrency }}
        </div>

        <!-------------------------------------------->
        <!-- Import farm and redirect to DPLP farms -->
        <!-------------------------------------------->
        <div v-if="presaleIsCompleted">
          <v-divider style="margin-bottom: 10px;"></v-divider>
          <p>After claiming your {{ displayedSale.tokenSymbol }}, use the button below to import its DPLP farm and start farming!</p>
          <div class="form-line">
            <v-btn
            large
            color="blue"
            @click="goToFarm">
              <template>
                Go to farms
              </template>
            </v-btn>

            <p style="color: gray; margin-top: 25px;">Or share the link below to let other users import the farm:</p>
            <div class="referral-link-container">
            <v-text-field
            :value="farmLink"
            readonly>
            
            <template v-slot:append>
              <v-tooltip
              :open-on-hover="false"
              right
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                  style="min-width: 0;"
                  @click="on.click"
                  v-on:click="copyText(farmLink)"
                  icon
                  retain-focus-on-click
                  v-bind="attrs"
                  v-on="on"
                  >
                  <v-icon small>mdi-clipboard-multiple</v-icon>
                  </v-btn>
                </template>
                <span>Copied!</span>
              </v-tooltip>
            </template>
            </v-text-field>
            </div>
          </div>
        </div>

        <!-------------------------------------------->
        <!-- Your referral link                     -->
        <!-- Displayed while the presale is active  -->
        <!-------------------------------------------->
        <div v-if="referralsEnabled && presaleIsActive == true && web3">
          <v-divider></v-divider>
          <div class="form-line">
            <p style="color: gray; margin-top: 25px;">You can share the referral link below and earn a percentage of the raised funds for every user that uses your link.</p>
            <div class="referral-link-container">
            <v-text-field
            :value="getReferralLink()"
            readonly>
            
            <template v-slot:append>
              <v-tooltip
              :open-on-hover="false"
              right
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                  style="min-width: 0;"
                  @click="on.click"
                  v-on:click="copyText(getReferralLink())"
                  icon
                  retain-focus-on-click
                  v-bind="attrs"
                  v-on="on"
                  >
                  <v-icon small>mdi-clipboard-multiple</v-icon>
                  </v-btn>
                </template>
                <span>Copied!</span>
              </v-tooltip>
            </template>
            </v-text-field>
            </div>
            <p style="color: gray; margin-top: 10px;">
              The referral rewards are covered by PadSwap, so the users won't lose anything by using your referral link.
            </p>
            <p><span style="color: gray;">Your referral earnings:</span> <span style="color: green;">{{ displayedSale.referralEarned }} {{ presaleCurrency }}</span></p>
          </div>
        </div>

        <!--------------------------------------->
        <!-- Claiming referral rewards, if any -->
        <!-- Appears when the presale is over  -->
        <!--------------------------------------->
        <div v-if="referralsEnabled && referralEarned && referralEarned.gt(0) && presaleIsCompleted">
          <v-divider></v-divider>
          <div class="form-line">
            <p>Some participants have used your referral link!</p>
            <p>Use the button below to claim your referral rewards.</p>
            <v-btn
            medium
            color="green"
            @click="claimReferralEarnings">
              <template>
                Claim {{ displayedSale.referralEarned }} {{ presaleCurrency }}
              </template>
            </v-btn>
          </div>
        </div>

      </div>
    </div>

    <!------------------------>
    <!-- Presale owner area -->
    <!------------------------>
    <div v-if="isPresaleOwner && presaleIsActive && !presaleIsAborted" class="presale-form-container">
      <div class="presale-form-box">
        <h3>Manage your presale</h3>
        <br>

        <v-expansion-panels class="manage-presale"
        inset>
          <v-expansion-panel class="rounded-expansion-panel" style="border: 1px solid #7e7e04;">
            <v-expansion-panel-header style="text-align: center !important; display: block;" expand-icon="">
              Edit token info
            </v-expansion-panel-header>
            <v-expansion-panel-content>
            <div class="form-line">
              <v-text-field
              v-model="editLogoUrl"
              label="Token logo URL (leave empty if you don't have one)"
              required
              :rules="logoUrlRules"
              >
                <template v-slot:append>
                  <img
                  style="width: 30px"
                  :src="editLogoUrl">
                </template>

              </v-text-field>
            </div>

            <div class="form-line">
              <v-text-field
              v-model="editWebsiteUrl"
              label="Website (leave empty if you don't have one)"
              required
              :rules="websiteUrlRules"
              ></v-text-field>
            </div>

            <div class="form-line">
              <v-text-field
              v-model="editTelegramUrl"
              label="Telegram link (leave empty if you don't have one)"
              required
              :rules="telegramUrlRules"
              ></v-text-field>
            </div>

            <div class="form-line">
              <v-text-field
              v-model="editDiscordUrl"
              label="Discord link (leave empty if you don't have one)"
              required
              :rules="discordUrlRules"
              ></v-text-field>
            </div>

            <div class="form-line">
              <v-checkbox
              v-model="editPublic"
              hide-details
              >
                <template v-slot:label>
                  Make public
                </template>
              </v-checkbox>
            </div>
            <br>

            <v-btn
            large
            color="primary"
            @click="updateTokenInfo">
              Update
            </v-btn>

            </v-expansion-panel-content>
          </v-expansion-panel>

          <br>

          <v-expansion-panel class="rounded-expansion-panel" style="border: 1px solid #860303;">
            <v-expansion-panel-header style="text-align: center !important; display: block;" expand-icon="">
              Cancel presale
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <p>This will immediately abort your presale.</p>
              <p>The raised funds will be refunded to the users, and your deposited {{ displayedSale.tokenSymbol }} will be sent back to you.</p>

              <p>To cancel the presale, type CANCEL and press the button below.</p>

              <v-form
              ref="form"
              v-model="cancelFormValid"
              >
              <v-text-field
              label="Type CANCEL to confirm"
              :rules="cancelPresaleRules">
              </v-text-field>

              <v-btn
                :disabled="!cancelFormValid"
                type="button"
                name="button"
                color="red"
                @click="cancelPresale">CANCEL PRESALE
              </v-btn>
              </v-form>

            </v-expansion-panel-content>
          </v-expansion-panel>

        </v-expansion-panels>
      </div>
    </div>

    <v-overlay
      v-model="isPresaleLoading"
      absolute
    >
      <v-progress-circular indeterminate />
    </v-overlay>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { mapActions } from 'vuex'
  import { ethers } from 'ethers' 
  import { EcosystemId, IEcosystem } from '@/ecosystem'

  // @ts-ignore:disable-next-line
  import VueCryptojs from 'vue-cryptojs';
  Vue.use(VueCryptojs)

  import { ERC20_ABI, LAUNCHPAD_FACTORY_ABI, LAUNCHPAD_PRESALE_ABI, ZERO_ADDRESS } from '@/constants'
  import { ChainId } from '@/ecosystem'
  import { delay, equalsInsensitive } from '@/utils'
  import { PresaleData } from '@/types'


  export default Vue.extend ({
    data: () => ({

      valid: true,
      depositFormValid: <boolean> false,
      presaleAddress: <string> '',
      isPresaleValid: <boolean> false,
      hostname: <string> '',

      // Data pulled from the contract
      tokenName: null,
      tokenSymbol: null,
      tokenAddress: <string> '',
      tokenSupply: <ethers.BigNumber | null> null,
      tokenDecimals: <number | null> null,
      presaleHardCap: <ethers.BigNumber | null> null,
      presaleSoftCap: <ethers.BigNumber | null> null,
      presaleTokensPerEth: <ethers.BigNumber | null> null,
      presaleEndTime: <number> 0, // Stored as a UNIX timestamp in miliseconds
      maxContribution: <ethers.BigNumber | null> null,

      yourContribution: <ethers.BigNumber | null> null, // Amount already contributed by this wallet
      boughtTokens: <ethers.BigNumber | null> null, // Amount of tokens to be received for contribution
      referralsEnabled: <boolean | null> null,
      referralEarned: <ethers.BigNumber | null> null, // Amount of money earned from your referral link
      referrerAddress: <string | null> null,

      presaleIsActive: <boolean | null> null,
      presaleIsAborted: <boolean | null> null,
      dplpFarm: <string | null> ZERO_ADDRESS,

      // Checking if any warnings should be displayed
      customTokenWarning: <boolean> false,

      // User-entered data (from the .json string in the contract)
      presaleInfo: <string | null> null,
      // Updated in real time
      presaleRaised: 43,
      timeLeft: 0,

      // User-entered data
      amountToDeposit: '0',
      tokensGiven: 0,
      active: true,

      // Admin area
      isPresaleOwner: <boolean | null> null,
      cancelFormValid: <boolean> false,
      cancelPresaleRules: [
        (v: any) => (v == 'CANCEL') || 'Please type CANCEL to confirm'
      ],

      // Editing token info
      editLogoUrl: <string | null> null,
      editWebsiteUrl: <string | null> null,
      editTelegramUrl: <string | null> null,
      editDiscordUrl: <string | null> null,
      editPublic: <boolean> true,
      websiteUrlRules: [
          (v: any) => (!v || /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(v)) || 'Enter a valid website URL, or leave empty if you don\'t have one'
        ],
      logoUrlRules: [
          (v: any) => (!v || /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(v)) || 'Enter a valid link to your logo, or leave empty if you don\'t have one'
        ],
      telegramUrlRules: [
          (v: any) => (!v || /(https?:\/\/)?(www[.])?(telegram|t)\.me\/([a-zA-Z0-9_-]*)\/?$/.test(v)) || 'Enter a valid Telegram invite link, or leave empty if you don\'t have one'
        ],
      discordUrlRules: [
          (v: any) => (!v || /(https?:\/\/)?(www[.])?discord\.(com\/invite|gg)\/([a-zA-Z0-9_-]*)\/?$/.test(v)) || 'Enter a valid Discord invite link, or leave empty if you don\'t have one'
      ],


      ZERO_ADDRESS
    }),
    created() {
      window.onstorage = () => {
        this.$store.commit('setUserProfile')
      };
      this.presaleAddress = this.$route.params.address
      this.referrerAddress = this.decrypt(this.$route.query.r?.toString())
      this.hostname = window.location.host
    },
    async mounted() {
      setInterval(() => {
        this.timeLeft = this.presaleEndTime - Date.now()
      }, 1000)

      while (this.active) {
        try {
          await this.sync()
        } catch (e) {
          console.error(e)
        }

        await delay(5000)
      }
    },
    beforeDestroy() {
      this.active = false
    },
    beforeRouteLeave(to, from, next) {
      this.active = false
      next()
    },
    computed: {
      suppliedTokenStyle(): string {
        let style = "font-weight: bold;"
        let tokenPercentage = ((parseFloat(this.displayedSale.presaleTokenAmount) * 1.72) / this.displayedSale.tokenSupply) * 100
        if (tokenPercentage > 80) {
          style += "color: #00f3ff;"
        }
        else if (tokenPercentage >= 50) {
          style += "color: #85ff00;"
        }
        else if (tokenPercentage >= 15) {
          style += "color: #ffbc00;"
        }
        else {
          style += "color: #ff5e00;"
        }
        return style
      },
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
      timeLeftInSeconds: function (): number {
        return Math.trunc(this.timeLeft / 1000)
      },
      secondsLeft: function (): number {
        return this.timeLeftInSeconds % 60
      },
      minutesLeft: function (): number {
        return Math.trunc(this.timeLeftInSeconds / 60) % 60
      },
      hoursLeft: function (): number {
        return (Math.trunc((this.timeLeftInSeconds / 60) / 60))
      },
      tokenLogo: function(): string {
          return '@/assets/icons/LaunchPAD Icon.svg'
      },
      presaleContract(): ethers.Contract | null {
        if (!ethers.utils.isAddress(this.presaleAddress)) {
          return null
        }

        return new ethers.Contract(this.presaleAddress, LAUNCHPAD_PRESALE_ABI, this.multicall)
      },
      presaleContractSigner(): ethers.Contract | null {
        if (!this.presaleContract || !this.web3) {
          return null
        }
        return this.presaleContract.connect(this.web3)
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
      multicall(): ethers.providers.Provider {
        return this.$store.getters.multicall
      },
      presaleTokenAmount(): ethers.BigNumber {
        if (!this.presaleTokensPerEth || !this.presaleHardCap) {
          return ethers.BigNumber.from(0)
        }

        const presaleTokenAmountEther = this.presaleTokensPerEth.mul(this.presaleHardCap)
        return presaleTokenAmountEther
      },
      displayedSale(): any {
        return {
          tokenName: this.tokenName,
          tokenSymbol: this.tokenSymbol,
          tokenSupply: this.tokenSupply ? ethers.utils.formatUnits(this.tokenSupply, this.tokenDecimals!) : null,
          presaleHardCap: this.presaleHardCap ? ethers.utils.formatEther(this.presaleHardCap) : null,
          presaleSoftCap: this.presaleSoftCap ? ethers.utils.formatEther(this.presaleSoftCap) : null,
          presaleTokensPerEth: this.presaleTokensPerEth?.toNumber(),
          presaleEndTime: this.presaleEndTime * 1000,
          maxContribution: this.maxContribution ? ethers.utils.formatEther(this.maxContribution) : null,
          presaleTokenAmount: this.presaleTokensPerEth ? this.presaleTokensPerEth.toNumber() * parseFloat(ethers.utils.formatEther(this.presaleHardCap!)) : null,
          presaleRaised: this.presaleRaised ? ethers.utils.formatEther(this.presaleRaised) : null,
          yourContribution: this.yourContribution ? ethers.utils.formatEther(this.yourContribution) : null,
          boughtTokens: this.boughtTokens ? ethers.utils.formatUnits(this.boughtTokens, this.tokenDecimals!) : null,
          referralEarned: this.referralEarned ? ethers.utils.formatEther(this.referralEarned) : null,
          presaleInfo: this.presaleInfo ?  this.stringToObject(this.presaleInfo) : {
            tokenLogoUrl: '',
            telegramUrl: '',
            discordUrl: '',
            websiteUrl: '',
            isPublic: true
          },
        }
      },
      presaleCurrency(): string {
        return this.$store.getters.ecosystem.ethName
      },
      presaleIsCompleted(): boolean {
        return this.presaleIsActive === false && this.presaleIsAborted === false
      },
      farmLink(): string | null {
        if (!this.dplpFarm) {
          return null
        }

        return `http://${this.hostname}/${this.$store.getters.ecosystem.routeName}/farms?import=${this.dplpFarm}`
      },
      isPresaleLoading(): boolean {
        return this.tokenName === null
      },
      web3(): ethers.Signer | null {
        return this.$store.state.web3
      },
      address(): string | null {
        return this.$store.state.address
      },
      chainId(): ChainId {
        return this.$store.getters.ecosystem.chainId
      }
    },
    methods: {
      tokenContractLink() {
        let chainExplorerLinks = {
          'bsc': 'https://bscscan.com/token/',
          'moonriver': 'https://moonriver.moonscan.io/token/',
          'moonbeam': 'https://moonbeam.moonscan.io/token/'
        }
        let chainExplorerNames = {
          'bsc': 'BSCscan',
          'moonriver': 'Moonscan',
          'moonbeam': 'Moonscan'
        }
        let chain = this.$store.getters.ecosystem.routeName
        let explorerLink = chainExplorerLinks[chain]
        let explorerName = chainExplorerNames[chain]
        return '<a href="' + explorerLink + this.tokenAddress + '" target="_blank">View on ' + explorerName +'</a>'
      },
      presaleImported() {
        const importedPresales = this.$store.state.userProfile.importedPresales[this.ecosystemId]

        const existingEntry = importedPresales.find((f: PresaleData) => equalsInsensitive(f.presaleLink, this.$route.path))
        if (existingEntry) {
          return true
        }
        return false
      },
      importPresale() {
        if (!this.displayedSale.tokenName || !this.displayedSale.tokenName) {
          return
        }

        const userProfileSerialized = localStorage.getItem(this.$store.state.USER_PROFILE_KEY)
        if (userProfileSerialized) {
          const savedUserProfile = JSON.parse(userProfileSerialized)
          Object.assign(this.$store.state.userProfile, this.$store.state.savedUserProfile)
        }

        const presaleConfig = {
          logo: this.displayedSale.presaleInfo.tokenLogoUrl,
          name: this.displayedSale.tokenName,
          ticker: this.displayedSale.tokenSymbol,
          presaleLink: this.$route.path
        }

        const importedPresales = this.$store.state.userProfile.importedPresales[this.ecosystemId]

        const existingEntry = importedPresales.find((f: PresaleData) => equalsInsensitive(f.presaleLink, presaleConfig.presaleLink))
        if (existingEntry) {
          const id = importedPresales.indexOf(existingEntry)
          if (id > -1) {
            importedPresales.splice(id, 1);
           }
        }

        this.$store.state.userProfile.importedPresales[this.ecosystemId].push(presaleConfig)

        setTimeout(() => this.sync())
      },
      removePresale() {
        const importedPresales = this.$store.state.userProfile.importedPresales[this.ecosystemId]

        const existingEntry = importedPresales.find((f: PresaleData) => equalsInsensitive(f.presaleLink, this.$route.path))
        if (existingEntry) {
          const id = importedPresales.indexOf(existingEntry)
          if (id > -1) {
            importedPresales.splice(id, 1);
           }
        }

        setTimeout(() => this.sync())
      },
      formatNumberWithCommas(nbr : any) {
        if (!nbr) {
          return '0.0'
        }
        return nbr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      },
      getReferralLink() {
        return 'http://' + this.hostname + this.$route.path + '?r=' + this.encrypt(this.$store.state.address)
      },
      encrypt(text : string) : string {
        if (!text) {
          return ''
        }

        const iv = (Vue as any).CryptoJS.enc.Utf8.parse('586E3272357538782F413F4428472B4B')
        const key = (Vue as any).CryptoJS.enc.Utf8.parse('7336763979244226452948' + this.presaleAddress.slice(10, 20).toString())

        var encrypted = (Vue as any).CryptoJS.AES.encrypt(text, key, { iv: iv });
        var encryptedText = encrypted.toString()

        return this.toUrlSafe(encryptedText)
      },
      decrypt(text : string) : string {
        if (!text) {
          return ''
        }

        text = this.fromUrlSafe(text)

        const iv = (Vue as any).CryptoJS.enc.Utf8.parse('586E3272357538782F413F4428472B4B')
        const key = (Vue as any).CryptoJS.enc.Utf8.parse('7336763979244226452948' + this.presaleAddress.slice(10, 20).toString())

        var cipherParams = (Vue as any).CryptoJS.lib.CipherParams.create({
          ciphertext: (Vue as any).CryptoJS.enc.Base64.parse(text)
        });

        var decrypted = (Vue as any).CryptoJS.AES.decrypt(cipherParams, key, { iv: iv});
        var decryptedText = decrypted.toString((Vue as any).CryptoJS.enc.Utf8)
        decryptedText = decryptedText.slice(0, 42)

        return decryptedText
      },
      toUrlSafe(base64text : string) {
        base64text = base64text.replaceAll('+', '-')
        base64text = base64text.replaceAll('/', '_')
        base64text = base64text.replaceAll('=', '~')
        return base64text
      },
      fromUrlSafe(base64text : string) {
        base64text = base64text.replaceAll('-', '+')
        base64text = base64text.replaceAll('_', '/')
        base64text = base64text.replaceAll('~', '=')
        return base64text
      },
      validDepositAmount() {
        if (parseFloat(this.amountToDeposit) <= 0 || this.amountToDeposit == '') {
          return ['Please enter the amount you wish to deposit']
        }
        return [true]
      },
      async goToFarm() {
        if (!this.dplpFarm) {
          return
        }
        this.$router.push({
          path: `/${this.$store.getters.ecosystem.routeName}/farms`,
          query: { import: this.dplpFarm}
        })
      },
      async cancelPresale() {
        const tx = await this.factoryContractSigner!.populateTransaction.abortPresale(this.presaleAddress)
        await this.safeSendTransaction({ tx, targetChainId: this.chainId })
      },
      async updateTokenInfo() {
        const presaleInfo = JSON.stringify({
          tokenLogoUrl: this.editLogoUrl,
          websiteUrl: this.editWebsiteUrl,
          telegramUrl: this.editTelegramUrl,
          discordUrl: this.editDiscordUrl,
          isPublic: this.editPublic
        })
        const tx = await this.factoryContractSigner!.populateTransaction.changePresaleInfo(this.presaleAddress, presaleInfo)
        await this.safeSendTransaction({ tx, targetChainId: this.chainId })
      },
      async refund () {
        if (!this.web3) {
          await this.requestConnect()
          return
        }

        const tx = await this.presaleContractSigner!.populateTransaction.claimRefund()
        await this.safeSendTransaction({ tx, targetChainId: this.chainId })
      },
      async claimTokens () {
        if (!this.web3) {
          await this.requestConnect()
          return
        }

        const tx = await this.presaleContractSigner!.populateTransaction.claimTokens()
        await this.safeSendTransaction({ tx, targetChainId: this.chainId })
      },
      async claimReferralEarnings () {
        if (!this.web3) {
          await this.requestConnect()
          return
        }

        const tx = await this.presaleContractSigner!.populateTransaction.claimReferralBonus()
        await this.safeSendTransaction({ tx, targetChainId: this.chainId })
      },
      async deposit () {
        if (!this.presaleContract) {
          return
        }
        if (!this.web3) {
          await this.requestConnect()
          return
        }
        const amountWei = ethers.utils.parseEther(this.amountToDeposit)
        let referrerAddress = this.referrerAddress
        if (!referrerAddress ||
            !ethers.utils.isAddress(referrerAddress) ||
            equalsInsensitive(referrerAddress, this.address!)) {
          referrerAddress = ZERO_ADDRESS
        }

        const tx = await this.presaleContractSigner!.populateTransaction.buy(referrerAddress)
        tx.value = amountWei
        this.importPresale()
        await this.safeSendTransaction({ tx, targetChainId: this.chainId })
      },
      trimNumber (nbr: number) {
        let str_nbr = nbr.toString();
        return Number(str_nbr.slice(0, 3))
      },
      sanitizer(str: string) {
        let element = document.createElement('div');
        element.innerText = str;
        return element.innerHTML;
      },
      fixUrl(str: string) {
        if (!str.includes('http://') && !str.includes('https://') && str.length > 0) {
          str = 'https://' + str
        }
        return str
      },
      stringToObject (str: string) {
        const obj = {
          tokenLogoUrl: "",
          telegramUrl: "",
          discordUrl: "",
          websiteUrl: "",
          isPublic: true
        }
        try {
            const parsed = JSON.parse(str)
            obj.tokenLogoUrl = this.sanitizer(parsed.tokenLogoUrl)
            obj.telegramUrl = this.sanitizer(parsed.telegramUrl)
            obj.discordUrl = this.sanitizer(parsed.discordUrl)
            obj.websiteUrl = this.sanitizer(parsed.websiteUrl)
            obj.telegramUrl = this.fixUrl(obj.telegramUrl)
            obj.discordUrl = this.fixUrl(obj.discordUrl)
            obj.websiteUrl = this.fixUrl(obj.websiteUrl)
            if (parsed.isPublic != undefined) {
              obj.isPublic = parsed.isPublic
            }
        } catch (e) {
            return obj
        }
        return obj
      },
      async sync() {
        if (!this.presaleContract) {
          return
        }

        if (this.tokenName === null) {
          this.isPresaleValid = true
          const tokenAddress = <string> await this.presaleContract.token()
          this.tokenAddress = tokenAddress
          const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.multicall)

          const firstLoadData = {
            tokenName: <string | null> null,
            tokenSymbol: <string | null> null,
            tokenSupply: <ethers.BigNumber | null> null,
            tokenDecimals: <number | null> null,
            presaleSoftCap: <ethers.BigNumber | null> null,
            presaleHardCap: <ethers.BigNumber | null> null,
            presaleTokensPerEth: <ethers.BigNumber | null> null,
            presaleEndTime: <number | null> null,
            presaleInfo: <string | null> null,
            maxContribution: <ethers.BigNumber | null> null,
            referralsEnabled: <boolean | null> null,
            isPresaleOwner: <boolean | null> null
          }

          const promises = [
            tokenContract.name().then((n: string) => firstLoadData.tokenName = n),
            tokenContract.symbol().then((s: string) => firstLoadData.tokenSymbol = s),
            tokenContract.totalSupply().then((s: ethers.BigNumber) => firstLoadData.tokenSupply = s),
            tokenContract.decimals().then((d: number) => firstLoadData.tokenDecimals = d),
            this.presaleContract.softCap().then((s: ethers.BigNumber) => firstLoadData.presaleSoftCap = s),
            this.presaleContract.hardCap().then((h: ethers.BigNumber) => firstLoadData.presaleHardCap = h),
            this.presaleContract.tokensPerEth().then((t: ethers.BigNumber) => firstLoadData.presaleTokensPerEth = t),
            this.presaleContract.endsAt().then((e: ethers.BigNumber) => firstLoadData.presaleEndTime = e.toNumber() * 1000),
            this.presaleContract.presaleInfo().then((p: string) => firstLoadData.presaleInfo = p),
            this.presaleContract.buyLimit().then((b: ethers.BigNumber) => firstLoadData.maxContribution = b),
            this.presaleContract.referrals().then((b: boolean) => firstLoadData.referralsEnabled = b)
          ]
          await Promise.all(promises)
          Object.assign(this, firstLoadData)

          this.editLogoUrl = this.displayedSale.presaleInfo.tokenLogoUrl,
          this.editWebsiteUrl = this.displayedSale.presaleInfo.websiteUrl,
          this.editTelegramUrl = this.displayedSale.presaleInfo.telegramUrl,
          this.editDiscordUrl = this.displayedSale.presaleInfo.discordUrl,
          this.editPublic = this.displayedSale.presaleInfo.isPublic
        }

        let canBuy: boolean = false
        let canEnd: boolean = false
        const data: any = {
          presaleIsActive: <boolean | null> null,
          presaleIsAborted: <boolean | null> null,
          presaleRaised: <ethers.BigNumber | null> null,
          presaleInfo: <string | null> null,
          yourContribution: <ethers.BigNumber | null> null,
          boughtTokens: <ethers.BigNumber | null> null,
          referralEarned: <ethers.BigNumber | null> null,
          dplpFarm: <string | null> null,
        }

        const promises = [
          this.presaleContract.canBuy().then((c: boolean) => canBuy = c),
          this.presaleContract.canEnd().then((c: boolean) => canEnd = c),
          this.presaleContract.isAborted().then((a: boolean) => data.presaleIsAborted = a),
          this.presaleContract.presaleInfo().then((p: string) => data.presaleInfo = p),
          this.presaleContract.dplpFarm().then((d: string) => data.dplpFarm = d),
          this.multicall.getBalance(this.presaleContract.address).then((b: ethers.BigNumber) => data.presaleRaised = b)
        ]
        if (this.address) {
          promises.push(
            this.presaleContract.paidAmount(this.address).then((a: ethers.BigNumber) => data.yourContribution = a),
            this.presaleContract.boughtTokensOf(this.address).then((t: ethers.BigNumber) => data.boughtTokens = t),
            this.presaleContract.referralBonuses(this.address).then((b: ethers.BigNumber) => data.referralEarned = b),
            this.factoryContract.getPresaleOwner(this.presaleContract.address).then((o: string) => this.isPresaleOwner = equalsInsensitive(o, this.address!))
          )
        }
        await Promise.all(promises)

        data.presaleIsActive = canBuy && !canEnd
        if (data.dplpFarm && data.dplpFarm != ZERO_ADDRESS) {
          // workaround for contract returning isAborted = true after donating to dplp
          data.presaleIsAborted = false
        }
        Object.assign(this, data)
      },
      ...mapActions(['requestConnect', 'safeSendTransaction']),
      copyText (text : string) {
        let textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.top = "0"
        textArea.style.left = "0"
        textArea.style.position = "fixed"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        let successful = document.execCommand('copy')

        document.body.removeChild(textArea)
      },
    },
    watch: {
      amountToDeposit () {
        this.tokensGiven = (parseFloat(this.displayedSale.presaleTokenAmount) / parseFloat(this.displayedSale.presaleHardCap)) * parseFloat(this.amountToDeposit)
      }
    }
  })
</script>
<style>
/* Token warning */
.token-warning {
  background: #ac762269 !important;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 15px;
}

/* Title bar */
.launchpad-title-bar {
  text-align: center;
  padding: 20px;
  background: rgba(24, 29, 38, 0.7) !important;
  border-radius: 20px;
}
.launchpad-title-bar h1 {
  margin-bottom: 25px;
}

.launchpad-title-bar-section {
  text-align: center;
  font-size: 0.7rem;
  padding: 20px;
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

/**************/
/* Token info */
/**************/

.data-bar {
  background: rgba(24, 29, 38, 0.7);
  border-radius: 20px;
}

.data-card {
  padding: 20px;
}

.data-card h3 {
  text-align: center;
  margin-bottom: 10px;
}

.data-table {
  background-color: none !important;
  background: none !important;
}

.data-table tbody tr:hover {
  background: #ffffff0c !important;
}

/****************/
/* Presale form */
/****************/

/* General */
.presale-form-container {
  display: block;
  width: 100%;
  text-align: center;
  margin-top: 40px;
}

.presale-form-box {
  display: inline-block;
  margin: 20px;
  padding: 20px;
  background: rgba(24, 29, 38, 0.7);
  border-radius: 20px;
  max-width: 700px;
}

.form-line {
  display: block !important;
  margin-top: 10px;
  margin-bottom: 10px;
}

/* Countdown timer */
.time-left-box {
  margin-bottom: 40px;
}

.time-left-title {
  font-size: 1.3rem;
}

.time-left-counter {
  margin-top: 20px;
}

.time-number {
  font-size: 2rem;
}

.time-description {
  font-size: 1rem;
}

.time-left-description {
  margin-top: 10px;
  color: #a1a1a1;
}

/* Titles */

.presale-aborted-title {
  background-color: #f48036 !important;
  border-radius: 5px;
}

.presale-success-title {
  background-color: green !important;
  border-radius: 5px;
}

/* Progress bar */
.presale-progress-title {
  margin-top: 30px;
}

.presale-progress {
  margin-top: 15px;
  margin-bottom: 30px;
  border-radius: 25px;
  overflow: hidden;
}

.your-contribution {
  color: gray;
}

.referral-link-container {
  display: block;
  text-align: center;
}

.referral-link-box {
  display: inline-block;
  border: 1px solid gray;
  border-radius: 10px;
  padding-left: 10px;
  max-height: 30px;
}

/*************************/
/* Managing your presale */
/*************************/

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

.rounded-expansion-panel {
  overflow: hidden;
  border-radius: 5px;
  margin-bottom: 15px;
}
.launchpad-image {
  border-radius:50px;
  height:100px;
}
</style>
