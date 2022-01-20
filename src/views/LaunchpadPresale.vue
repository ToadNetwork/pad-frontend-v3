<template>
  <v-container>
    <v-sheet class="launchpad-title-bar">
    <div class="launchpad-title">
      <img class="launchpad-image" :src=logoUrl>
      <h1 style="padding-bottom: 0">${{displayedSale.tokenSymbol}} ({{displayedSale.tokenName}}) presale</h1>
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
              <td>Token name</td>
              <td>{{ displayedSale.tokenName }}</td>
            </tr>
            <tr>
              <td>Token symbol</td>
              <td>{{ displayedSale.tokenSymbol }}</td>
            </tr>
            <tr>
              <td>Max supply</td>
              <td>{{ displayedSale.tokenSupply }} {{ displayedSale.tokenSymbol }}</td>
            </tr>
            <tr>
              <td>Website</td>
              <td><a :href="websiteUrl" target="_blank">{{websiteUrl}}</a></td>
            </tr>
            <tr>
              <td>Telegram</td>
              <td><a :href="telegramUrl" target="_blank">{{telegramUrl}}</a></td>
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
              <td>{{ displayedSale.presaleTokenAmount }} {{ displayedSale.tokenSymbol }}
                ({{
                  trimNumber(
                    (displayedSale.presaleTokenAmount / displayedSale.tokenSupply) * 100
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
              <td>{{ trimNumber(displayedSale.presaleTokenAmount/displayedSale.presaleHardCap) }} {{ displayedSale.tokenSymbol }} per {{ presaleCurrency }}</td>
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

    <div class="presale-form-container">
      <div class="presale-form-box">

        <!---------------------------------------->
        <!-- Countdown timer for active presale -->
        <!---------------------------------------->
        <div v-if="presaleIsActive == true" class="form-line">
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
        <div v-if="presaleIsActive == false && presaleIsAborted == false" class="form-line">

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

        <div class="presale-progress-title">Presale progress:</div>
        <div class="presale-progress">
          <v-progress-linear
          :value="(displayedSale.presaleRaised / presaleHardCap) * 100"
          color="#12a362"
          height="25"
          >{{ displayedSale.presaleRaised }} {{ presaleCurrency }} / {{ displayedSale.presaleHardCap }} {{ presaleCurrency }}</v-progress-linear>
        </div>

        <!----------------------------------------->
        <!-- Participating in the active presale -->
        <!----------------------------------------->
        <div v-if="presaleIsActive == true">
          <div class="form-line">
            <v-text-field
            v-model="amountToDeposit"
            label="Amount to deposit"
            :suffix="presaleCurrency"
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
            @click="deposit">
              <template>
                Deposit {{ presaleCurrency }}
              </template>
            </v-btn>
          </div>
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
                Withdraw {{ yourContribution }} {{ presaleCurrency }}
              </template>
            </v-btn>
          </div>
        </div>

        <!---------------------------------------------->
        <!-- Claiming tokens after successful presale -->
        <!---------------------------------------------->
        <div v-if="presaleIsActive == false && presaleIsAborted == false">
          <div class="form-line">
            <v-btn
            x-large
            color="primary"
            @click="claimTokens">
              <template>
                Claim {{ displayedSale.tokenSymbol }}
              </template>
            </v-btn>
          </div>

        </div>

        <!-- Your current contribution will always be displayed, regardless of the state of the presale, as long as your wallet is connected -->
        <div class="form-line your-contribution">
          Your contribution: {{ yourContribution }} {{ presaleCurrency }}
        </div>

        <!-------------------------------------------->
        <!-- Your referral link                     -->
        <!-- Displayed while the presale is active  -->
        <!-------------------------------------------->
        <div v-if="referralsEnabled && presaleIsActive == true">
          <v-divider></v-divider>
          <div class="form-line">
            <p style="color: gray">You can share the referral link below and earn a percentage of the raised funds for every user that uses your link.</p>
            <div class="referral-link-container">
            <div class="referral-link-box">
              <span style="word-break: break-all; word-wrap: break-word;">{{ referralLink }}</span>

              <v-tooltip
              :open-on-hover="false"
              right
              >
                <template #activator="{ on }">
                  <v-btn
                  style="min-width: 0;"
                  @click="on.click"
                  v-on:click="copyLink(referralLink)"
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
            </div>
            </div>
          </div>
        </div>

        <!--------------------------------------->
        <!-- Claiming referral rewards, if any -->
        <!-- Appears when the presale is over  -->
        <!--------------------------------------->
        <div v-if="referralsEnabled && referralEarned > 0 && presaleIsActive == false && presaleIsAborted == false">
          <v-divider></v-divider>
          <div class="form-line">
            <p>Some participants have used your referral link!</p>
            <p>Use the button below to claim your referral rewards.</p>
            <v-btn
            medium
            color="green"
            @click="claimReferralEarnings">
              <template>
                Claim {{ referralEarned }} {{ presaleCurrency }}
              </template>
            </v-btn>
          </div>
        </div>

      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { mapActions } from 'vuex'
  import { ethers } from 'ethers'

  import { ERC20_ABI, LAUNCHPAD_PRESALE_ABI, ZERO_ADDRESS } from '@/constants'
  import { delay } from '@/utils'

  export default Vue.extend ({
    data: () => ({
      valid: true,
      presaleAddress: <string> '',

      // Data pulled from the contract
      tokenName: null,
      tokenSymbol: null,
      tokenSupply: <ethers.BigNumber | null> null,
      tokenDecimals: <number | null> null,
      presaleHardCap: <ethers.BigNumber | null> null,
      presaleSoftCap: <ethers.BigNumber | null> null,
      presaleTokensPerEth: <ethers.BigNumber | null> null,
      presaleEndTime: <number> 0, // Stored as a UNIX timestamp in miliseconds
      maxContribution: <ethers.BigNumber | null> null,

      yourContribution: <ethers.BigNumber | null> null, // Amount already contributed by this wallet
      referralsEnabled: <boolean | null> null,
      referralLink: <string> '', // Referral link generated for your wallet
      referralEarned: <ethers.BigNumber | null> null, // Amount of money earned from your referral link

      presaleIsActive: <boolean | null> null,
      presaleIsAborted: <boolean | null> null,

      // User-entered data (from the .json string in the contract)
      logoUrl: 'https://padswap.exchange/glmr/images/pad/pad-moonbeam.png',
      telegramUrl: 'https://t.me/toadnetwork',
      websiteUrl: 'https://toad.network',

      // Updated in real time
      presaleRaised: 43,
      timeLeft: 0,

      // User-entered data
      amountToDeposit: '0',
      tokensGiven: 0,
      active: true
    }),
    created() {
      this.presaleAddress = this.$route.params.address
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
      displayedSale(): Object {
        return {
          tokenName: this.tokenName,
          tokenSymbol: this.tokenSymbol,
          tokenSupply: this.tokenSupply ? ethers.utils.formatUnits(this.tokenSupply, this.tokenDecimals!) : null,
          presaleHardCap: this.presaleHardCap ? ethers.utils.formatEther(this.presaleHardCap) : null,
          presaleSoftCap: this.presaleSoftCap ? ethers.utils.formatEther(this.presaleSoftCap) : null,
          presaleTokensPerEth: this.presaleTokensPerEth?.toNumber(),
          presaleEndTime: this.presaleEndTime * 1000,
          maxContribution: this.maxContribution ? ethers.utils.formatUnits(this.maxContribution, this.tokenDecimals!) : null,
          presaleTokenAmount: this.presaleTokensPerEth ? this.presaleTokensPerEth.toNumber() * parseFloat(ethers.utils.formatEther(this.presaleHardCap)) : null,
          presaleRaised: this.presaleRaised ? ethers.utils.formatEther(this.presaleRaised) : null
        }
      },
      presaleCurrency(): string {
        return this.$store.getters.ecosystem.ethName
      },
      web3(): ethers.Signer | null {
        return this.$store.state.web3
      }
    },
    methods: {
      async refund () {
        return
      },
      async claimTokens () {
        return
      },
      async claimReferralEarnings () {
        return
      },
      async deposit () {
        if (!this.presaleContract) {
          return
        }
        if (!this.web3) {
          await this.requestConnect()
          return
        }
        const contract = this.presaleContract.connect(this.web3)
        const amountWei = ethers.utils.parseEther(this.amountToDeposit)
        const tx = await contract.populateTransaction.buy(ZERO_ADDRESS) // TODO: referrals
        tx.value = amountWei
        await this.safeSendTransaction({ tx, targetChainId: this.$store.getters.ecosystem.chainId })
      },
      trimNumber (nbr: number) {
        let str_nbr = nbr.toString();
        return Number(str_nbr.slice(0, 3))
      },
      async sync() {
        if (!this.presaleContract) {
          return
        }

        if (this.tokenName === null) {
          const tokenAddress = <string> await this.presaleContract.token()
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
            this.presaleContract.buyLimit().then((b: ethers.BigNumber) => firstLoadData.maxContribution = b)
          ]
          await Promise.all(promises)
          Object.assign(this, firstLoadData)
        }

        const data: any = {
          presaleIsActive: <boolean | null> null,
          presaleIsAborted: <boolean | null> null,
          presaleRaised: <ethers.BigNumber | null> null
        }

        const promises = [
          this.presaleContract.isActive().then((a: boolean) => data.presaleIsActive = a),
          this.presaleContract.isAborted().then((a: boolean) => data.presaleIsAborted = a),
          this.multicall.getBalance(this.presaleContract.address).then((b: ethers.BigNumber) => data.presaleRaised = b)
        ]
        await Promise.all(promises)
        Object.assign(this, data)
      },
      ...mapActions(['requestConnect', 'safeSendTransaction']),
      copyLink (link : string) {
        let textArea = document.createElement("textarea")
        textArea.value = link
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
      amountToDeposit: function(newAmount) {
        const presaleTokenAmountEther = parseFloat(ethers.utils.formatUnits(this.presaleTokenAmount, this.tokenDecimals!))
        let tokensPerCurrency = (presaleTokenAmountEther / parseFloat(ethers.utils.formatEther(this.presaleHardCap!)))
        this.tokensGiven = parseFloat(tokensPerCurrency as any) * parseFloat(this.amountToDeposit as any)
      }
    }
  })
</script>
<style>

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
}

</style>
