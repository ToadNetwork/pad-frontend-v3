<template>
  <div>
  <v-expansion-panels>
    <v-expansion-panel
    style="border-radius: 20px; overflow: hidden; margin: 10px 0;"
    background-color="#28233ab3"
    >
      <v-expansion-panel-header>
        <v-row>
          <v-col
          cols="12">
            <v-chip
            outlined>
              {{ pairData.token0.symbol }}
            </v-chip>
            &nbsp;-&nbsp;
            <v-chip
            outlined>
              {{ pairData.token1.symbol }}
            </v-chip>
          </v-col>
          <v-col>              
            <div style="display: block; margin-left: 5px; margin-top: 10px; margin-bottom: 10px;">
              Staked value: <b>${{ biOrMiOrK(pairData.token0.userBalanceInUSD + pairData.token1.userBalanceInUSD) }}</b>
            </div>
          </v-col
          cols="12">
        </v-row>
      </v-expansion-panel-header>

      <v-expansion-panel-content>


        <v-divider></v-divider>

        <div>
        </div>



        <v-simple-table>
          <tbody>
            <tr>
              <td>LP tokens owned</td>
              <td><b>{{ biOrMiOrK(pairData.userBalance) }}</b> {{ pairData.token0.symbol }}-{{ pairData.token1.symbol }} LP tokens</td>
            </tr>
            <tr>
              <td>{{ pairData.token0.symbol }} amount</td>
              <td><b>{{ biOrMiOrK(pairData.token0.userBalance) }}</b> {{ pairData.token0.symbol }}</td>
            </tr>
            <tr>
              <td>{{ pairData.token1.symbol }} amount</td>
              <td><b>{{ biOrMiOrK(pairData.token1.userBalance) }}</b> {{ pairData.token1.symbol }}</td>
            </tr>

          </tbody>
        </v-simple-table>

        <v-divider></v-divider>

        <div
        class="text-center"
        style="margin-top: 30px;">
          <div
          style="display: inline-block;">

            <v-text-field
            width="100%"
            style="margin: 0"
            v-model="removeAmount"
            :disabled="pairData.userBalance == 0"
            type="number"
            min="0.0"
            solo
            outlined
            rounded
            dense
            color="#00FC4c"
            background-color="#71767F"
            hide-spin-buttons
            :hide-details="validationStatus.message == null"
            :error-messages="validationStatus.message"
            append-icon
            height="40px"
            label="Amount to withdraw"
            >
              <template v-slot:append>
                <v-btn
                  @click="setMax"
                  x-small
                  color="#595E67"
                  class="padswap-max-btn mr-n3">
                  Max
                </v-btn>
              </template>
            </v-text-field>
            <v-btn
            v-if="!isSpendingApproved"
            @click="approve()">
              APPROVE
            </v-btn>
            <v-btn
            v-else
            @click="withdraw()"
            width="100%">
              Withdraw
            </v-btn>

          </div>
        </div>        


      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapState } from 'vuex'
import { ethers } from 'ethers'

import {
  ERC20_ABI,
  SWAP_ROUTER_ABI,
  SWAP_FACTORY_ABI,
  PADSWAP_PAIR_ABI,
  PADSWAP_FARM_ABI,
  FARM_REQUIRED_ALLOWANCE,
  PADSWAP_SINGLE_STAKE_FARM_ABI,
  PADSWAP_LP_FARM_ABI,
  APPROVE_AMOUNT } from '@/constants'
import { IEcosystem, EcosystemId, ECOSYSTEMS } from '@/ecosystem'
import { formatMixin } from '@/format'
import { FarmData } from '@/types'
import { delay, equalsInsensitive, toFloat } from '@/utils'

type ValidationStatus = {
  status: boolean,
  message?: string
}


const routerAddresses = {
  56: '0x76437234D29f84D9A12820A137c6c6A719138C24', // BSC
  1284: '0x40F1fEF0Fe68Fd10ff904070ee00a7769EE7fe34', // Moonbeam
  1285: '0x790d4b443edB9ce9A8d1aEC585edd89E51132D2c' // Moonriver
}

export default Vue.extend({
  name: 'LiquidityPairWidget',
  mixins: [formatMixin],
  props: {
    pairData : Object,
    pairChainId : Number,
  },
  data() {
    return {
      removeAmount: <string | null> null
    }
  },
  computed: {
    ecosystem(): IEcosystem {
      return ECOSYSTEMS[this.ecosystemId as EcosystemId]
    },
    userAddress(): string {
      return this.$store.state.address
    },
    userLpBalanceNum(): number {
      return parseFloat(ethers.utils.formatEther(this.userLpBalance ?? 0))
    },
    userStakedBalanceNum(): number {
      return parseFloat(ethers.utils.formatEther(this.userStakedBalance ?? 0))
    },
    removeAmountBn: {
      get(): ethers.BigNumber {
        return ethers.utils.parseEther(this.removeAmount || '0')
      },
      set(val: ethers.BigNumber) {
        this.removeAmount = ethers.utils.formatEther(val)
      }
    },
    validationStatus(): ValidationStatus {
      if (this.removeAmount == null) {
        return { status: false }
      }

      return { status: true }
    },
    farmDataMinWidths(): string[] {
      if (this.$vuetify.breakpoint.xl) {
        return ['200px', '200px', '200px']
      } else if (this.$vuetify.breakpoint.lg) {
        return ['130px', '130px', '200px']
      } else if (this.$vuetify.breakpoint.md) {
        return ['100px', '100px', '200px']
      } else {
        return ['initial', 'initial', 'initial']
      }
    },
    chainId(): ChainId {
      return this.$store.getters.ecosystem.chainId
    },
    routerContractAddress() : string {
      return routerAddresses[this.chainId]
    },
    isSpendingApproved() : boolean {
      if (!(parseFloat(this.removeAmount) > 0)) {
        return true
      }
      else {
        return parseFloat(this.removeAmount) <= parseFloat(this.pairData.allowance)
      }
    },
    ...mapState(['web3'])
  },
  methods: {
    round(num : any, dec : any) {
      num = Number(num).toFixed(20)
      if(!Number.isFinite(Number(num))) num = '0.0'
      num = Number(num).toFixed(20)
      const regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${dec}})?`)
      let [int, decimals] = num.toString().replace(',', '.').split('.')
      if(dec == 0) return int
      const rounded = num.toString().match(regex)[0]
      return rounded
    },
    biOrMiOrK(num : number) : string {
      if(num>=1e9) return this.round(num/1e9, 2) + 'BI'
      else if(num>=1e6) return this.round(num/1e6, 2) + 'M'
      else if (num>=1e3) return this.round(num/1e3, 2) + 'K'
      else if (num>= 1e2) return this.round(num, 2)
      else if (num >= 1) return this.round(num, 4)
      else return this.round(num, 6)
    },
    setMax() {
      this.removeAmount = this.pairData.userBalance
    },
    async deposit() {
      
    },
    async withdraw() {
      // if (!this.validationStatus.status) {
      //   this.shakeButton('dwButton')
      //   return
      // }

      if (this.pairData.token0.address == 'eth' || this.pairData.token1.address == 'eth') {
        this.removeLiquidityETH()
      }
      else {
        this.removeLiquidityTokens()
      }
    },    


    // Removes TokenA-TokenB liquidity
    async removeLiquidityTokens() {
        const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)

        const amountAMin = ethers.utils.parseEther('0')
        const amountBMin = ethers.utils.parseEther('0')

        const tx = await routerContract.populateTransaction.removeLiquidity(
          this.pairData.token0.address,
          this.pairData.token1.address,
          ethers.utils.parseEther(this.removeAmount),
          amountAMin,
          amountBMin,
          this.userAddress,
          Date.now() + 1000 * 60 * 10)

        const txReceipt: ethers.providers.TransactionReceipt | false = await this.safeSendTransaction({ tx, targetChainId: this.chainId })
    },

    async approve() {
      const pairContract = new ethers.Contract(this.pairData.address, PADSWAP_PAIR_ABI, this.multicall)

      const tx = await pairContract.populateTransaction.approve(this.routerContractAddress, APPROVE_AMOUNT)
      const succeeded = await this.safeSendTransaction({ tx, targetChainId: this.chainId })
    },


    // Removes Token-ETH liquidity
    async removeLiquidityETH() {
      let token

      if (this.pairData.token0.address != 'eth') {
        token = this.pairData.token0
      }
      else {
        token = this.pairData.token1
      }

      const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)

      const amountETHMin = ethers.utils.parseEther('0')
      const amountTokenMin = ethers.utils.parseEther('0')

      const tx = await routerContract.populateTransaction.removeLiquidityETH(
        token.address,
        ethers.utils.parseEther(this.removeAmount),
        amountTokenMin,
        amountETHMin,
        this.userAddress,
        Date.now() + 1000 * 60 * 10)

      const txReceipt: ethers.providers.TransactionReceipt | false = await this.safeSendTransaction({ tx, targetChainId: this.chainId })
    },
    ...mapActions(['safeSendTransaction'])
  }
})
</script>

<style scoped>
.padswap-farm {
  background: #181D26 !important;
  border-radius: 15px !important;
  width: 100%;
  color: #B3B8C1 !important;
  padding: 39px 40px !important;
  font-family: Roboto;
}
@media all and (max-width: 700px) {
  .padswap-farm {
    padding: 39px 20px !important;
  }
}
.padswap-farm-expanded {
  border-top-left-radius: 15px !important;
  border-top-right-radius: 15px !important;
  border-bottom-left-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
}
.padswap-farm-details {
  background: #292D38 !important;
  border-top-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
  border-bottom-left-radius: 15px !important;
  border-bottom-right-radius: 15px !important;
  width: 100%;
  padding: 45px;
  font-size: 14px;
  font-family: Roboto;
}
.padswap-farm-data .col:first-child {
  color: #979CA5;
}
.padswap-farm-data .col:last-child {
  color: #FFFFFF;
}
.padswap-farm-data .col.padswap-pink, .padswap-farm-data .col.padswap-pink .v-icon {
  color: #FB53EF;
}
.col {
  padding: 3px;
}
.padswap-farm-title {
  font-family: Roboto Mono;
  color: #FB53EF;
  font-size: 16px;
  white-space: nowrap;
}
.padswap-farm-btn {
  border-radius: 100px;
  background: linear-gradient(180deg, #00FC4c 0%, #00D741 100%);
  color: #00310F;
  width: 120px;
  text-transform: none;
  font-size: 16px;
  font-weight: bold;
  font-family: Roboto Mono;
}
@media all and (max-width: 970px) {
  .padswap-farm-btn.padswap-dw-btn {
    width: 100px;
    font-size: 15px;
  }
}
.padswap-farm-data-title {
  font-size: 12px;
  color: #71767F;
}
.padswap-farm-data-item {
  font-size: 24px;
  color: #FFFFFF;
  white-space: nowrap;
}
.padswap-farm-note {
  font-size: 12px;
  color: #979CA5;
}
.padswap-farm-note-value {
  color: #FB53EF;
}
.v-card.padswap-deposit-withdraw-box {
  border: 1px solid #595E67;
  border-radius: 15px;
  padding: 10px 20px;
  background: none;
}
.v-card.padswap-deposit-withdraw-box-disabled {
  filter: opacity(0.8) brightness(0.8);
}
.padswap-action {
  color: #979CA5;
  font-size: 16px;
  cursor: pointer;
}
.padswap-action.padswap-selected-action {
  color: #FB53EF;
  text-decoration: underline;
  cursor: unset;
}
.v-text-field {
  border-radius: 8px;
}
.padswap-dw-balance {
  font-size: 12px;
  color: #979CA5;
}
.padswap-dw-balance-amount {
  font-size: 14px;
  color: #FFFFFF;
}
.v-subheader, .v-subheader .v-icon {
  color: #B3B8C1 !important;
}
.padswap-max-btn {
  border-radius: 8px;
  text-transform: none;
  font-size: 12px;
  font-weight: bold;
}
.padswap-disabled-control {
  filter: blur(0.6px) opacity(0.2);
}

.padswap-shake {
  animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
}
@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>