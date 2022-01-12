<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="6" md="8" offset-lg="3" offset-md="2">
      <!-- <div class="text-center text-h3" style="margin-top:35px; margin-bottom:10px">Is Now Retired</div>
      <div class="text-center text-h5" style="margin-top:35px; margin-bottom:10px">We are now on the final stages of development of the beta version.</div> -->
      <!-- <div class="text-center text-h5" style="margin-top:35px; margin-bottom:10px">
      LaunchPad beta will allow anyone to launch their own project without any coding experience. Out of the gate your project will start with: <div style="width: 100%;margin-left: 20px;font-size: 20px;text-align: initial !important;"> <br> AUDITED Presale Contract,<br> AUDITED BEP20 Token,<br> AUDITED Farms (TOKEN-BNB, TOKEN-BUSD, TOKEN-PAD),<br> AUDITED LP FARMS (DECENTRALIZED PERPETUAL LIQUIDITY PROTOCOL),<br> RUG-PROOF PROJECT BATCH </div>
      </div>
      <div class="text-center text-h5" style="margin-top:35px; margin-bottom:10px">
      Take care of building your community and let LaunchPad take care of the rest for you.
      </div> -->
      <v-card
            class="farm-card flip-card-front"
            elevation="8">
            <div class="text-center">
              <img class="launchpad-img" :src="$padswapTheme.theme.padLogoSrc" href="https://grandpa-doge.com/">
              <div class="text-h4 launchpad" style="padding-top:40px; margin-bottom:20px">
              LaunchPad
              </div>
              <br>
              <img height="60px" :src="presale_img" style="border-radius:20px; height: 70px">
              <div class="text-h5">PAD</div>
              <div class="farm-description" style="margin-bottom: 40px; margin-top:10px">Instantly buy PAD, proceeds will be directed to DPLP</div>
              <h5 class="stats-line">
                <img height="20" width="20" :src="$padswapTheme.theme.padLogoSrc" />
                Website
                <span class="stats-line-info"><a href="https://toad.network/" target="_blank" style="color: #59a6ff;border: none;text-transform: uppercase;text-decoration: none;">toad.network</a></span>
              </h5>
              <v-divider style="margin-left: 2%; width: 96%;"></v-divider>
              <h5 class="stats-line">
                <img height="20" width="20" :src="$padswapTheme.theme.padLogoSrc" />
                Ticker:
                <span class="stats-line-info">$PAD</span>
              </h5>
              <v-divider style="margin-left: 2%; width: 96%;"></v-divider>
              <h5 class="stats-line">
                <img height="20" width="20" :src="$padswapTheme.theme.padLogoSrc" />
                Hard Cap:
                <span class="stats-line-info">6000 GLMR</span>
              </h5>
              <v-divider style="margin-left: 2%; width: 96%;"></v-divider>
              <h5 class="stats-line">
                <img height="20" width="20" :src="$padswapTheme.theme.padLogoSrc" />
                Presale Price:
                <span class="stats-line-info">833K per GLMR</span>
              </h5>
              <v-divider style="margin-left: 2%; width: 96%;"></v-divider>
              <h5 class="stats-line">
                <img height="20" width="20" :src="$padswapTheme.theme.padLogoSrc" />
                GLMR Raised:
                <span class="stats-line-info">{{ raisedAmount }} GLMR</span>
              </h5>
              <v-divider style="margin-left: 2%; width: 96%;"></v-divider>
              <h5 class="stats-line">
                <img height="20" width="20" :src="$padswapTheme.theme.padLogoSrc" />
                Remaining Tokens:
                <span class="stats-line-info">{{ remainingTokens }}</span>
              </h5>
              <v-divider style="margin-left: 2%; width: 96%;"></v-divider>
              <v-divider style="margin-left: 2%; width: 96%;"></v-divider>
              <h5 class="stats-line">
                <img height="20" width="20" :src="$padswapTheme.theme.padLogoSrc" />
                Bought Tokens:
                <span class="stats-line-info">{{round(myTokenss, 2)}}</span>
              </h5>
              <v-divider style="margin-left: 2%; width: 96%;"></v-divider>
            </div>
            <v-row
            justify="center"
            style="margin-top:10px; margin-bottom:10px">
              <v-col
              v-if="active"
              class="tt1"
              cols="12"
              md="5">
                <v-text-field
                  style="min-height:36px"
                  class="vault-input"
                  label="GLMR amount"
                  solo
                  v-model="amount"
                ></v-text-field>
              </v-col>
              <v-col
              v-if="active"
              class="tt2"
              cols="12"
              md="5">
                <v-text-field
                  style="min-height:36px"
                  class="vault-input"
                  label="You will receive"
                  disabled
                  solo
                  v-model="expected"
                ></v-text-field>
              </v-col>
              <v-col
              v-if="active"
              class="tt3"
              cols="12"
              md="2">
                <div class="text-center">
                  <v-btn
                  @click="buy()"
                  class="add-remove-btns cool-btn"
                  color="primary"
                  elevation="0">
                    BUY
                  </v-btn>
                </div>
              </v-col>
              <v-col
              v-else
              cols="12"
              md="12">
                <div class="text-center">
                  <v-btn
                  @click="redeem()"
                  class="add-remove-btns cool-btn"
                  color="primary"
                  elevation="0">
                    Redeem Your Tokens
                  </v-btn>
                </div>
              </v-col>
            </v-row>
            <!-- <v-progress-linear
                v-model="percentage"
                color="#876bec"
                height="25"
              >{{percentage}}%</v-progress-linear> -->
          </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { ethers } from 'ethers'
import Vue from 'vue'
import { mapActions } from 'vuex'

import { ERC20_ABI } from '@/constants'
import { EcosystemId, ECOSYSTEMS } from '@/ecosystem'
import { delay, toFloat } from '@/utils'

export default Vue.extend({
  data () {
    return {
      tokenABI: [],
      contractABI: [
	{
		"constant": false,
		"inputs": [],
		"name": "buy",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "tokens",
				"type": "uint256"
			}
		],
		"name": "Buy",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "claimTokens",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "endPresale",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_newValue",
				"type": "uint256"
			}
		],
		"name": "setBnbPrice",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdrawFunds",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdrawTokens",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "bnbPrice",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "boughtTokens",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "buyLimit",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "calculateBuy",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "ceoAddress",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getTokenBalance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "isClosed",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "multiplier",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "myTokens",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "presaleSize",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "token",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "tokenPrice",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalBoughtTokens",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
],
      contractAddress: '0xE497d1564eFA546b4B2b65756E0B7CeE46e71646',
      tokenAddress: '0x001Ef4385D199454b76527fd91Af3Da8C0a51537',
      tokenInstance: null,
      contractInstance: null,
      presale_img: ECOSYSTEMS[EcosystemId.Moonbeam].theme.padLogoSrc,
      active: true,
      amount: null,
      expected: null,
      price: 0.0000012,
      raisedAmount: '0.000',
      bnbPrice: 1,
      percentage: 0,
      allTokens: 5000000000,
      remainingTokens: '0.000',
      myTokenss: '0.000',
      hours: '00',
      minutes: '00',
      seconds:'00',
      tokenDecimals: 18,
      componentActive: true
    }
  },
  created () {
    this.$store.commit('setEcosystemId', EcosystemId.Moonbeam)
    this.$padswapTheme.theme = this.ecosystem.theme

    setTimeout(() => {
      this.loadInstances()
      this.startCountDown()
    })
  },
  beforeRouteLeave (to, from, next) {
    this.componentActive = false
    next()
  },
  destroyed () {
    this.componentActive = false
  },
  computed: {
    ecosystem() {
      return this.$store.getters.ecosystem
    },
    dataseed() {
      return this.ecosystem.dataseed
    },
    contractInstance() {
      return new ethers.Contract(this.tokenAddress, ERC20_ABI, this.dataseed)
    },
    tokenInstance() {
      return new ethers.Contract(this.contractAddress, this.contractABI, this.dataseed)
    },
    myAddress() {
      return this.$store.state.address
    },
    myContract() {
      if (!this.$store.state.web3) {
        return null
      }

      return new ethers.Contract(this.contractAddress, this.contractABI, this.$store.state.web3)
    }
  },
  methods: {
    startCountDown() {
      setInterval(()=>{
        const now = new Date().getTime()
        let total = 1637355655500 - now
        if (total <= 0) total = 0
        let seconds = Math.floor( (total/1000) %60 )
        let minutes = Math.floor( (total/1000 /60) % 60 )
        let hours = Math.floor( (total/1000/60/60) )
        if((hours).toString().length == 1) hours = '0' + hours
        if((minutes).toString().length == 1) minutes = '0' + minutes
        if((seconds).toString().length == 1) seconds = '0' + seconds
        this.hours = hours
        this.minutes = minutes
        this.seconds = seconds
      }, 1000)
    },
    round(num, dec) {
      num = Number(num).toFixed(20)
      if(!Number.isFinite(Number(num))) num = '0.0'
      num = Number(num).toFixed(20)
      const regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${dec}})?`)
      let [int, decimals] = num.toString().replace(',', '.').split('.')
      const rounded = num.toString().match(regex)[0]
      return rounded
    },
    biOrMiOrK(num) {
      if(!num || num <= 0) return '0.00'
      else if(num>=1e9) return this.round(num/1e9, 4) + 'BI'
      else if(num>=1e6) return this.round(num/1e6, 2) + 'M'
      else if (num>=1e3) return this.round(num/1e3, 2) + 'K'
      else if (num>= 1e2) return this.round(num, 2)
      else if (num >= 1) return this.round(num, 4)
      else return this.round(num, 6)
    },
    async loadInstances () {
      this.tokenDecimals = await this.tokenInstance.decimals()

      while (this.componentActive) {
        try {
          await Promise.all([
            this.getRaiseAmount(),
            this.getRemainingTokens(),
            this.checkActive(),
            this.myTokens()
          ])
        } catch (e) {
          console.error(e)
        }
        await delay(3000)
      }
    },
    async myTokens() {
      if (!this.myAddress) {
        return
      }
      const res = await this.contractInstance.boughtTokens(this.myAddress)
      this.myTokenss = toFloat(res, this.tokenDecimals)
    },
    async getRaiseAmount() {
      const balance = await this.dataseed.getBalance(this.contractAddress)
      this.raisedAmount = toFloat(balance).toString()
    },

    async getRemainingTokens() {
      const balanceBn = await this.dataseed.getBalance(this.contractAddress)
      const balance = toFloat(balanceBn)
      this.remainingTokens = this.biOrMiOrK(this.allTokens - (333333333*balance))
      const soldTokens = 333333333*balance
      this.percentage = this.round((soldTokens/this.allTokens*100))
    },

    async checkActive() {
      const closed  = await this.contractInstance.isClosed()
      this.active = !closed
    },

    async buy() {
      const amount = ethers.utils.parseEther(this.amount.replace(',','.'))
      const tx = await this.myContract.populateTransaction.buy({ value: amount })
      await this.safeSendTransaction({ tx, targetChainId: this.ecosystem.chainId })
    },
    async redeem() {
      const tx = await this.myContract.populateTransaction.claimTokens()
      await this.safeSendTransaction({ tx, targetChainId: this.ecosystem.chainId })
    },
    ...mapActions(['safeSendTransaction'])
  },
  watch: {
    amount () {
      const l = this.amount
      this[l] = !this[l]
      this.amount = this.amount.replace(',', '.')
      this.expected = this.round(this.amount*this.bnbPrice/this.price, 2)
    },
  }
})
</script>
<style scoped>
  .farm-title {
    font-size: 30px;
    padding-top: 25px;
    margin-bottom:20px;
    font-weight: 500;
    letter-spacing: 2px;
  }
  .farm-card{
    border-radius: 11px;
    font-family: Roboto;
    padding: 5px;
  }
  .farm-rewards{
    font-size: 33px;
    font-weight: 600;
  }
  .farm-rewards-caption{
    margin-top: 5px;
    display: block;
    font-size: 15px;
    font-weight: normal;
    color: rgb(185, 181, 180);
    margin-bottom:30px;
  }
  .stats-line{
    margin: 7px 15px 7px;
    font-size: 17px;
    font-weight: 500;
    display: block;
    text-align: left;
    line-height: 40px;
  }
  .stats-line > img {
    margin-right: 4px;
    line-height: 40px;
    vertical-align: middle;
  }
  .stats-line-info{
    font-weight: bold;
    float: right;
    padding: 0px;
    line-height: 40px;
  }
  .theme--light.v-card > .text-center{
    color: #a3a09f !important;
  }
  @media all and (max-width: 959px) {
    .v-input {
      max-width: 96% !important;
      margin: auto;
    }
    .v-btn-toggle:not(.v-btn-toggle--dense) .v-btn.v-btn.v-size--default {
      height: 48px;
      min-height: 0;
      max-width: 25vw;
    }
    .add-remove-btns{
      width:96%;
      margin: auto;
    }
  }
  .cool-btn{
    width: calc(100% - 20px) !important;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 11px;
    transition: all .5s ease 0s;
    background-position: left center;
    background-image: linear-gradient(51deg,rgb(159 68 228)0,rgb(75 205 255) 51%,rgb(159 68 228));
    background-size: 250%;
  }
  .cool-btn:hover{
    background-position: right center;
  }
  .theme--dark.v-card {
    background-color:rgb(33, 36, 41);
  }
  .theme--dark.v-btn:hover::before {
    opacity: 0;
  }
  .theme--dark.v-btn--active:hover::before, .theme--dark.v-btn--active::before {
    opacity: 0.18;
    border-radius: 12px;
    padding: 9px;
    margin: 3px;
}
.v-btn-toggle {
    border-radius: 16px;
}
.v-btn-toggle > .v-btn.v-btn {border: none}
.theme--dark.v-btn.v-btn--has-bg {
    background-color: #212429;
}
.more-info{
  width: 20px;
  float: right;
  margin-right: 20px;
  margin-top: 20px;
  margin-left: -40px;
  cursor: pointer;
}
.more-info:hover{
  opacity:0.5
}
.v-icon:focus::after {
    opacity: 0
}
.theme--light.farm-card > .text-center > svg { background-color: #f7f7f7 !important}
.v-icon.v-icon.v-icon--link {
    z-index: 2;
}
.launchpad {
  line-height: 100px;
  vertical-align: top;
  display: inline;
}
.launchpad-img {
  height: 50px;
  margin-top: 30px;
  display: inline;
  margin-right: 5px;
}
.tt1 {padding-right:0px; padding-left:20px}
.tt2 {padding-right:10px; padding-left:10px}
.tt3 {padding-right:30px; padding-left:0}
 @media all and (max-width: 959px) {
  .tt1 {padding-right:20px; padding-left:20px}
  .tt2 {padding-right:20px; padding-left:20px}
  .tt3 {padding-right:20px; padding-left:20px}
  .v-item-group > .v-btn.v-size--default {
    font-size: 0.75rem;
  }
}
</style>
