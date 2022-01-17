<template>
  <v-container>
    <v-row class="data-bar">
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
              <td>{{ tokenSupply }}</td>
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
              <td>{{presaleTokenAmount}} {{tokenSymbol}} 
                ({{
                  trimNumber(
                    (presaleTokenAmount / tokenSupply) * 100
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
              <td>{{trimNumber(presaleTokenAmount/presaleHardCap)}} {{tokenSymbol}} per {{presaleCurrency}}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>

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

        <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        >

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
        </v-form>
      </div>
    </div>
  </v-container>
</template>

<script>
  import Vue from 'vue'
  export default Vue.extend ({
    data: () => ({
      valid: true,

      // All of this will be pulled from the presale database, I guess?
      tokenName: 'GLMR Pad',
      tokenSymbol: 'PAD',
      tokenSupply: 100000,
      presaleHardCap: 100,
      presaleSoftCap: 25,
      presaleTokenAmount: 9523,
      presaleCurrency: 'GLMR',
      presaleEndTime: 1642780658504, // Stored as a UNIX timestamp in miliseconds

      // Updated in real time
      presaleRaised: 43,
      timeLeft: 0,

      // User-entered data
      amountToDeposit: 0,
      tokensGiven: 0,

    }),
    mounted: function () {
      var self = this
      setInterval( function () {
          self.timeLeft = self.presaleEndTime - Date.now()
        }, 1000)
      },
    computed: {
      timeLeftInSeconds: function () {
        return Math.trunc(this.timeLeft / 1000)
      },
      secondsLeft: function () {
        return this.timeLeftInSeconds % 60
      },
      minutesLeft: function () {
        return Math.trunc(this.timeLeftInSeconds / 60) % 60
      },
      hoursLeft: function () {
        return (Math.trunc((this.timeLeftInSeconds / 60) / 60))
      }
    },
    methods: {
      submit () {
        this.$refs.form.validate()
      },
      trimNumber (nbr) {
        let str_nbr = nbr.toString();
        return Number(str_nbr.slice(0, 3))
      }
    },
    watch: {
      amountToDeposit: function(newAmount) {
        let tokensPerCurrency = (this.presaleTokenAmount / this.presaleHardCap)
        this.tokensGiven = parseFloat(tokensPerCurrency) * parseFloat(this.amountToDeposit)
      }
    }
  })
</script>
<style>

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
