<template>
  <v-container>
    <v-sheet class="launchpad-title-bar">
    <div class="launchpad-title">
      <img class="launchpad-image" :src=logoUrl>
      <h1 style="padding-bottom: 0">${{tokenSymbol}} ({{tokenName}}) presale</h1>
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
              <td>{{ tokenName }}</td>
            </tr>
            <tr>
              <td>Token symbol</td>
              <td>{{ tokenSymbol }}</td>
            </tr>
            <tr>
              <td>Max supply</td>
              <td>{{ tokenSupply }} {{ tokenSymbol }}</td>
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
              <td>{{displayedPresaleTokenAmount}} {{tokenSymbol}}
                ({{
                  trimNumber(
                    (displayedPresaleTokenAmount / tokenSupply) * 100
                  ) 
                }}% of supply)</td>
            </tr>
            <tr>
              <td>Hard cap</td>
              <td>{{presaleHardCap}} {{presaleCurrency}}</td>
            </tr>
            <tr>
              <td>Soft cap</td>
              <td>{{presaleSoftCap}} {{presaleCurrency}}</td>
            </tr>
            <tr>
              <td>Price</td>
              <td>{{trimNumber(displayedPresaleTokenAmount/presaleHardCap)}} {{tokenSymbol}} per {{presaleCurrency}}</td>
            </tr>
            <tr>
              <td>Maximum contribution</td>
              <td>{{maxContribution}} {{presaleCurrency}}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
      
      </v-row>
    </v-sheet>

    <div class="presale-form-container">
      <div class="presale-form-box">

        <div class="form-line">
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

        <v-divider></v-divider>

        <div class="presale-progress-title">Presale progress:</div>
        <div class="presale-progress">
          <v-progress-linear
          :value="(presaleRaised / presaleHardCap) * 100"
          color="#12a362"
          height="25"
          >{{presaleRaised}} {{presaleCurrency}} / {{presaleHardCap}} {{presaleCurrency}}</v-progress-linear>
        </div>

          <div class="form-line">
            <v-text-field
            v-model="amountToDeposit"
            label="Amount to deposit"
            suffix="GLMR"
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
            @click="submit">
              <template>
                Deposit GLMR
              </template>
            </v-btn>
          </div>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { ethers } from 'ethers'

  import { ERC20_ABI, LAUNCHPAD_PRESALE_ABI } from '@/constants'
  import { delay } from '@/utils'

  export default Vue.extend ({
    data: () => ({
      valid: true,
      presaleAddress: <string> '',

      // Data pulled from the contract
      tokenName: 'GLMR Pad',
      tokenSymbol: 'PAD',
      tokenSupply: 100000,
      tokenDecimals: <number | null> null,
      presaleHardCap: 100,
      presaleSoftCap: 25,
      presaleTokensPerEth: <ethers.BigNumber | null> null,
      presaleCurrency: 'GLMR',
      presaleEndTime: 1642780658504, // Stored as a UNIX timestamp in miliseconds
      maxContribution: <ethers.BigNumber | null> ethers.BigNumber.from(2),

      presaleIsActive: <boolean | null> null,
      presaleIsAborted: <boolean | null> null,
      totalBoughtTokens: <ethers.BigNumber | null> null,

      // User-entered data (from the .json string in the contract)
      logoUrl: 'https://padswap.exchange/glmr/images/pad/pad-moonbeam.png',
      telegramUrl: 'https://t.me/toadnetwork',
      websiteUrl: 'https://toad.network',

      // Updated in real time
      presaleRaised: 43,
      timeLeft: 0,

      // User-entered data
      amountToDeposit: 0,
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
      displayedPresaleTokenAmount(): string {
        if (!this.presaleTokensPerEth || !this.presaleHardCap) {
          return '0'
        }

        const presaleTokenAmount = this.presaleTokensPerEth.toNumber() * this.presaleHardCap
        return presaleTokenAmount.toString()
      }
    },
    methods: {
      submit () {
        const form = this.$refs.form as any
        form.validate()
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
          Object.assign(firstLoadData, this)
        }

        const data: any = {
          presaleIsActive: <boolean | null> null,
          presaleIsAborted: <boolean | null> null,
          totalBoughtTokens: <ethers.BigNumber | null> null
        }

        const promises = [
          this.presaleContract.isActive().then((a: boolean) => data.presaleIsActive = a),
          this.presaleContract.isAborted().then((a: boolean) => data.presaleIsAborted = a),
          // this.presaleContract.totalBoughtTokens().then((t: ethers.BigNumber) => data.totalBoughtTokens = t)
        ]
        await Promise.all(promises)
        Object.assign(data, this)
      }
    },
    watch: {
      amountToDeposit: function(newAmount) {
        const presaleTokenAmountEther = parseFloat(ethers.utils.formatUnits(this.presaleTokenAmount, this.tokenDecimals!))
        let tokensPerCurrency = (presaleTokenAmountEther / this.presaleHardCap)
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

</style>
