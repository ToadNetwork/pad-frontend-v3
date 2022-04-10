<template>
  <div>
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


  <!------------------------------------------------------>
  <!-- Title bar with product description and wiki link -->
  <!------------------------------------------------------>

    <v-sheet class="product-title-bar">
    <img class="product-title-bar-background" :src="$padswapTheme.theme.backgroundTextureSrc">
    <div class="product-title">
      <img style="width:80px; height: 80px;" src="@/assets/icons/Vault Icon.svg">
      <h1 style="margin-bottom: 0">Vault</h1>
    </div>

    <div class="launchpad-intro">
      <p class="please-read">
        Collects backing for PAD from PadSwap fees.<br>
        Backing can be redeemed by users at any time.
      </p>
    </div>

    <a href="https://docs.toad.network/fundamentals/the-vault" target="_blank">Learn more about the Vault on TOAD Wiki</a>

    </v-sheet> 

  <br><br><br>

  <!-------------------------------------------->
  <!--             Loading screen             -->
  <!-------------------------------------------->

  <div class="text-center" v-if="vaultProcessed == false || mcap == 0">
    Loading vault data, please wait...
  </div>


  <!---------------------------------------------------------->
  <!--  General container for vault stuff,                  -->
  <!--  shown only after the vault data has been loaded     -->
  <!---------------------------------------------------------->

  <div :style="getVaultContainerStyle()">

  <!-------------------------------------------->
  <!--                                        -->
  <!--       Backing ratio & PAD stats        -->
  <!--                                        -->
  <!-------------------------------------------->

  <div class="fullwidth panel">
    <h1 class="title">PAD stats</h1>
    <br>
    <v-divider></v-divider>
    <br><br>

    <v-row
    align="center"
    justify="center">

    <!-- Vault backing percentage -->
    <v-col
    cols="12"
    md="6">      <div class="vault-backing-section">
        <div class="vault-backing-container">
        <div class="backing-hint-column">
          <div class="backing-hint" style="bottom: 95%">
            <span class="backing-hint-text">
              PAD market cap <br>
              {{biOrMiOrK(mcap)}} USD
            </span>
            <div class="backing-hint-mark"></div>
          </div>
          <div class="backing-hint" :style="'bottom:' + backingPercentage + '%'">
            <span class="backing-hint-text">
              Backing reserves<br>
              {{biOrMiOrK(totalBacking)}} USD
            </span>
            <div class="backing-hint-mark"></div>
          </div>
        </div>
        <div class="vault-backing-outer">
          <div class="vault-backing-inner">
            <div class="vault-backing-liquid-container">
              <div class="vault-backing-liquid" :style="'height:' + backingPercentage + '%'">
              </div>
            </div>
            <div class="backing-ratio-container">
              <div class="backing-ratio-title">{{backingPercentage}}%</div>
              <div class="backing-ratio-subtitle">Backing ratio</div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </v-col>

    <!-- PAD stats -->
    <v-col
    cols="12"
    md="6">
      <p>
        Vault contract: <span v-html="getBlockExplorerLink()"></span>
      </p>

      <div class="pad-stats-card">
        <h1>${{ padPrice.toFixed(8) }}</h1>
        <p>Current PAD price</p>
      </div>

      <div class="pad-stats-card">
        <h1>${{ (padPrice * (backingPercentage / 100.0)).toFixed(8) }}</h1>
        <p>Minimum possible PAD price* <br>
        ({{ backingPercentage }}% of current price)</p>
      </div>

      <div class="pad-stats-card">
        <h1>${{ biOrMiOrK(mcap) }}</h1>
        <p>PAD market cap</p>
      </div>

      <div class="pad-stats-card">
        <h1>${{ biOrMiOrK(totalBacking) }}</h1>
        <p>Backing reserves</p>
      </div>

    </v-col>
  </v-row>
  </div>


  <!-------------------------------------------->
  <!--                                        -->
  <!--  Reserves breakdown & redeem backing   -->
  <!--                                        -->
  <!-------------------------------------------->

  <v-row
  align-content="stretch"
  justify="center">

  <v-col
  cols="12"
  md="6">
    <div class="fullwidth panel" style="max-height: 500px; max-width: 800px;">
      <h1 class="title">Vault Holdings</h1>
      <br>
      <v-divider></v-divider>

          <apexchart
          ref="holdings"
          type="donut"
          height="90%"
          :options="options"
          :series="series">
          </apexchart>

    </div>
  </v-col>

  <v-col
  cols="12"
  md="6">
    <div class="fullwidth panel">
      <h1 class="title">Redeem backing</h1>
      <br>
      <v-divider></v-divider>
        <v-row
        justify="center"
        style="margin-top:10px">
          <v-col
          cols="12">
            <v-text-field
              v-model="amount"
              type="number"
              min="0.0"
              outlined
              rounded
              dense
              color="#00FC4c"
              background-color="black"
              hide-spin-buttons
              append-icon
              class="mr-3"
              height="50px"
              label="Amount of PAD to burn"
              style="padding-top:5px"
              >
              <template v-slot:append>
                <v-btn
                  @click="setMax"
                  small
                  color="dark-grey"
                  class="padswap-max-btn mr-n3">
                  Max
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col
          cols="12">
            <v-text-field
              v-model="expected"
              outlined
              disabled
              rounded
              dense
              background-color="dark-grey"
              class="mr-3"
              height="50px"
              label="You will receive"
              >
            </v-text-field>
          </v-col>
          <v-col
          cols="12">
            <div class="text-center">
              <v-btn
              v-if="!address"
              x-large
              outlined
              width="300"
              @click="requestConnect"
              >
                Connect Wallet
              </v-btn>
              <v-btn
              v-else-if="!isApproveComplete"
              x-large
              outlined
              width="300"
              @click="approve"
              >
                Approve
              </v-btn>
              <v-btn
              v-else="!isApproveComplete"
              x-large
              outlined
              color="light-green"
              width="300"
              @click="redeem"
              >
                Redeem
              </v-btn>
            </div>
          </v-col>
        </v-row>
    </div>
  </v-col>
  </v-row>


</v-container>
</div>
</div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import SliderTabs from '@/components/SliderTabs.vue'
  import { ethers } from 'ethers'
  import { providers } from '@0xsequence/multicall'
  import { delay, equalsInsensitive, toFloat } from '@/utils'
  import { IEcosystem, EcosystemId, ChainId } from '@/ecosystem'
  import { mapActions } from 'vuex'
  import AwaitLock from 'await-lock'
  import {
    BSC_MINTER_ADDRESS,
    MOVR_MINTER_ADDRESS,
    MINTER_ABI,
    PADSWAP_PAIR_ABI,
    ERC20_ABI,
  } from '../constants'
  import VueApexCharts from 'vue-apexcharts'

  import { padAddress as padAddressBSC, vault as vaultBSC } from '../farms_config_bsc.json'
  import { padAddress as padAddressMOVR, vault as vaultMOVR } from '../farms_config_movr.json'
  import { padAddress as padAddressGLMR, vault as vaultGLMR } from '../farms_config_glmr.json'

  export default Vue.extend({
    components: {
      SliderTabs, 
      apexchart: VueApexCharts
    },
    data () {
      return {
        active: <boolean> true,
        syncLock: new AwaitLock(),
        options: <any> {
          tooltip: <any> {
            enabled: true,
              y: {
                formatter: (value : any, { series, seriesIndex, dataPointIndex, w } : any ) => {
                  // @ts-ignore
                  return '$' + this.biOrMiOrK(value)
                }
              },
              x: {
                format: 'dd MMM yyyy',
              },
          },
          legend: {
            position: 'right',
              formatter: (seriesName : string) => {
                // @ts-ignore
                return seriesName
              }
          },
          chart: {
            toolbar: {
              show: false
            },
          },
          plotOptions: {
            treemap: {
              distributed: true,
              useFillColorAsStroke: true
            }
          },
        },
        series: [],
        totalBacking: 0,

        // PAD stats
        mcap: 0,
        padSupply: <number> 0,
        padPrice: <number> 0,
        backingPercentage: '0.000000',
        userPadBalance: <number> 0,

        amount: <number> 0,
        expected: <any> '',

        contractAddress: <string> '',
        contractABI: <any> {},

        tokens: <any> [],
        pairs: <any> [],

        userTokenAllowance: <number> 0,

        vaultProcessed: <boolean> false
      }
    },
    created () {
      // Setting ecosystem to bsc
      this.$store.commit('setEcosystemId', 0)

      setTimeout(async () => {
        await this.loadVaultData()
        setTimeout(async () => {
          await this.getVaultLpValue()
        }, 1000)
      }, 1000)
    },
    async mounted () {
      while (this.active) {
        try {
          await this.sync()
        } catch (e) {
          console.error(e)
        }

        await delay(3000)
      }
    },
    watch: {
      amount() {
        const expectedUSD : number = this.amount * this.padPrice
        this.expected = '~' + expectedUSD.toString() + ' USD worth of tokens'
      }
    },
    computed: {
      vault(): any {
        if (this.chainName == 'bsc') {
          return vaultBSC
        }
        else if (this.chainName == 'moonriver') {
          return vaultMOVR
        }
        else {
          return vaultGLMR
        }
      },
      padAddress() : string {
        if (this.chainName == 'bsc') {
          return padAddressBSC
        }
        else if (this.chainName == 'moonriver') {
          return padAddressMOVR
        }
        else {
          return padAddressGLMR
        }
      },
      ecosystemId: {
        get(): EcosystemId {
          return this.$store.state.ecosystemId
        },
        set(val: EcosystemId) {
          this.$store.commit('setEcosystemId', val)
          this.totalBacking = 0
          this.mcap = 0
          this.vaultProcessed = false
          setTimeout(async () => {
              await this.loadVaultData()
              setTimeout(async () => {
              await this.getVaultLpValue()
            }, 1000)
          }, 1000)
        }
      },
      address(): string {
        return this.$store.state.address
      },
      multicall(): ethers.providers.Provider {
        return this.$store.getters.multicall
      },
      ecosystem(): IEcosystem {
        return this.$store.getters.ecosystem
      },
      priceModel() : any {
        return this. $store.getters.ecosystem.priceModel
      },
      web3(): ethers.Signer | null {
        return this.$store.state.web3
      },
      chainId(): ChainId {
        return this.$store.getters.ecosystem.chainId
      },
      chainName(): string {
        return this.$store.getters.ecosystem.routeName
      },
      isApproveComplete(): boolean {
        if (this.userTokenAllowance == 0) {
          return false
        }

        return (this.userTokenAllowance >= this.amount)
      },
    },
    beforeRouteLeave (to, from, next) {
      next()
    },
    methods: {
      setMax() {
        this.amount = Math.floor(this.userPadBalance)
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
        const vault = this.contractAddress
          if (!vault) {
            return
          }
      },
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
      getVaultContainerStyle() : string {
        if (this.mcap == 0 || this.vaultProcessed == false) {
          return "visibility: hidden"
        }
        else {
          return ""
        }
      },
      getBlockExplorerLink() : string {
        let chainExplorerLinks : any = {
          'bsc': 'https://bscscan.com/address/',
          'moonriver': 'https://moonriver.moonscan.io/address/',
          'moonbeam': 'https://moonbeam.moonscan.io/address/'
        }
        let chainExplorerNames : any = {
          'bsc': 'BSCscan',
          'moonriver': 'Moonscan',
          'moonbeam': 'Moonscan'
        }
        let chain = this.$store.getters.ecosystem.routeName
        let explorerLink = chainExplorerLinks[chain]
        let explorerName = chainExplorerNames[chain]
        return '<a href="' + explorerLink + this.contractAddress + '" target="_blank">View on ' + explorerName +'</a>'
      },
      loadVaultData () {
        this.contractAddress = this.vault.address
        this.contractABI = this.vault.abi
        this.tokens = this.vault.tokens
        this.pairs = this.vault.pairs
      },
      async getVaultLpValue() {

        // TODO: split this abomination into multiple smaller functions

        let totalBackingUSD : number = 0.0
        let vaultData : any = {}

        const blockNumber = await this.multicall.getBlockNumber()

        // Dict for all retrieved data
        let pairs : any = {}
        for (const pairAddress of this.pairs) {
          pairs[pairAddress] = {
            token0Address: "",
            token1Address: "",
            pairReserves: 0,
            token0Name: "",
            token1Name: "",
            token0Decimals: 18,
            token1Decimals: 18,
            pairTotalSupply: 0,
            pairInVault: 0
          }
        }

        // Data from the pair contracts
        let promises = [this.priceModel.syncWithin(blockNumber, 12)]
        for (const pairAddress of this.pairs) {

          const pairContract = new ethers.Contract(pairAddress, PADSWAP_PAIR_ABI, this.multicall)

          const p1 = pairContract.token0().then((res : any) => pairs[pairAddress].token0Address = res)
          const p2 = pairContract.token1().then((res : any) => pairs[pairAddress].token1Address = res)
          const p3 = pairContract.getReserves().then((res : any) => pairs[pairAddress].pairReserves = res)
          const p4 = pairContract.totalSupply().then((res : any) => pairs[pairAddress].pairTotalSupply = res)
          const p5 = pairContract.balanceOf(this.contractAddress).then((res : any) => pairs[pairAddress].pairInVault = res)

          promises.push(p1, p2, p3, p4, p5)
        }
        await Promise.all(promises)

        // Data from individual token contracts
        promises = [this.priceModel.syncWithin(blockNumber, 12)]
        for (const pairAddress of this.pairs) {

          const token0Contract = new ethers.Contract(pairs[pairAddress].token0Address, ERC20_ABI, this.multicall)
          const token1Contract = new ethers.Contract(pairs[pairAddress].token1Address, ERC20_ABI, this.multicall)

          const p1 = token0Contract.name().then((res : any) => pairs[pairAddress].token0Name = res)
          const p2 = token1Contract.name().then((res : any) => pairs[pairAddress].token1Name = res)
          const p3 = token0Contract.decimals().then((res : any) => pairs[pairAddress].token0Decimals = res)
          const p4 = token1Contract.decimals().then((res : any) => pairs[pairAddress].token1Decimals = res)

          promises.push(p1, p2, p3, p4)
        }
        await Promise.all(promises)

        // Calculating the token reserves within liquidity pairs
        for (const pairAddress of this.pairs) {

          // Total reserves of tokens in the liquidity pool
          const reserve0 = parseFloat(ethers.utils.formatEther(pairs[pairAddress].pairReserves._reserve0))
          const reserve1 = parseFloat(ethers.utils.formatEther(pairs[pairAddress].pairReserves._reserve1))

          // Token prices
          const token0Price = this.priceModel.getPriceUsd(pairs[pairAddress].token0Address)
          const token1Price = this.priceModel.getPriceUsd(pairs[pairAddress].token1Address)

          // Percentage of LP tokens that are held by the vault
          const vaultTokenShare : number = toFloat(pairs[pairAddress].pairInVault) / toFloat(pairs[pairAddress].pairTotalSupply)

          // Number of individual tokens in the vault
          const token0InVault : number = reserve0 * vaultTokenShare
          const token1InVault : number = reserve1 * vaultTokenShare

          // USD value of tokens in the vault
          const token0USD = token0Price * token0InVault
          const token1USD = token1Price * token1InVault

          totalBackingUSD += token0USD
          totalBackingUSD += token1USD

          if (pairs[pairAddress].token0Name in vaultData) {
            vaultData[pairs[pairAddress].token0Name] += token0USD
          }
          else {
            vaultData[pairs[pairAddress].token0Name] = token0USD
          }

          if (pairs[pairAddress].token1Name in vaultData) {
            vaultData[pairs[pairAddress].token1Name] += token1USD
          }
          else {
            vaultData[pairs[pairAddress].token1Name] = token1USD
          }
        }

        // Balances of individual tokens
        // TODO: call all promises simultaneously
        for (const token of this.vault.tokens) {
          const tokenContract = new ethers.Contract(token, ERC20_ABI, this.multicall)

          const tokenName = await tokenContract.name()
          const tokenBalance = await tokenContract.balanceOf(this.contractAddress)
          const tokenPrice = this.priceModel.getPriceUsd(token)

          const tokenUSD = tokenPrice * toFloat(tokenBalance)

          totalBackingUSD += tokenUSD

          if (tokenName in vaultData) {
            vaultData[tokenName] += tokenUSD
          }
          else {
            vaultData[tokenName] = tokenUSD
          }

        }

        this.totalBacking = totalBackingUSD

        // Updating the pie chart
        let tokenLabels = []
        let tokenValues = []
        let smallBalances : number = 0
        let total : number = 0
        for (const [key, value]  of Object.entries(vaultData)) {
          if (value as number >= 1000) {
            tokenLabels.push(key)
            tokenValues.push(value)
          }
          else {
            smallBalances += value as number
          }
        }
        tokenLabels.push('Other')
        tokenValues.push(smallBalances)
        
        const backingChart : any = this.$refs!.holdings!
        backingChart.updateOptions({
          labels: tokenLabels
        })
        backingChart.updateSeries(tokenValues)

        window.setInterval(() => this.getPadInfo(), 2000)

        this.vaultProcessed = true
      },
      async getPadInfo() {
        // Getting PAD stats
        const padContract = new ethers.Contract(this.padAddress, ERC20_ABI, this.multicall)
        this.padSupply = await padContract.totalSupply()
        this.padPrice = this.priceModel.getPriceUsd(this.padAddress)
        this.mcap = toFloat(this.padSupply as any) * this.padPrice


        const percentage = (this.totalBacking / this.mcap) * 100.0
        this.backingPercentage = percentage.toFixed(1)

        const allowance : ethers.BigNumber = await padContract.allowance(this.address, this.contractAddress)
        this.userTokenAllowance = toFloat(allowance)

        let userBalance = await padContract.balanceOf(this.address)
        this.userPadBalance = toFloat(userBalance)

        // const minterContract = new ethers.Contract(BSC_MINTER_ADDRESS, MINTER_ABI, this.multicall)
        // console.log(minterContract)

      },
      async approve() {
        let padContract = new ethers.Contract(this.padAddress, ERC20_ABI, this.multicall)
        padContract = padContract!.connect(this.web3!)
        let amount = ethers.utils.parseEther( this.amount.toString().replace(',','.') )
        const tx = await padContract.populateTransaction.approve(this.contractAddress, amount)
        await this.safeSendTransaction({ tx, targetChainId: this.chainId })
      },
      async redeem() {
        const vaultContract = new ethers.Contract(this.contractAddress, this.contractABI, this.multicall)
        let amount = ethers.utils.parseEther( this.amount.toString().replace(',','.') )
        const tx = await vaultContract.populateTransaction.redeemBacking(amount)
        const succeeded = await this.safeSendTransaction({ tx, targetChainId: this.chainId })
      },
      ...mapActions(['requestConnect', 'safeSendTransaction'])
    },
  })
</script>

<style src="../styles/style.css" />
<style scoped>

* {
  font-family: "Roboto mono", monospace;
}

/********************/
/* Ecosystem slider */
/********************/
    
  .padswap-header-box {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
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


  /******************************************/
  /*                                        */
  /* The fancy way to display vault backing */
  /*                                        */
  /******************************************/

  .vault-backing-section {
    display: block;
    min-height: 500px;
    text-align: center;
  }

  .vault-backing-container {
    display: inline-block;
    text-align: center;
    max-width: 700px;
  }

  .vault-backing-outer {
    display: inline-block;
    min-width: 300px;
    min-height: 500px;
    width: 300px;
    height: 500px;
    border: 3px solid gray;
    border-radius: 5px;
    border-top: none;
    background: linear-gradient(to bottom, #0925003b, #041e02c4);
  }

  .vault-backing-inner {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .vault-backing-liquid-container {
    position: relative;
    transform: rotate(180deg);
    width: 100%;
    height: 100%;
  }

  .vault-backing-liquid {
    position: relative;
    display: block;
    margin: 0;
    padding: 0;
    width: 100%;
    background-color: #00ff6aa8;
  }

  .backing-hint-column {
    display: inline-block;
    position: relative;
    width: 200px;
    height: 500px;
  }

  .backing-hint {
    z-index: 10;
    position: absolute;
    display: inline-block;
    left: 0;
    width: 190px;
    text-align: right;
    padding-bottom: 10px;
  }

  .backing-hint-text {
    width: 100%;
    color: #a8a8a8;
  }

  .backing-hint-mark {
    position: absolute;
    right: -20px;
    top: 95%;
    width: 140px;
    height: 2px;
    background-color: #a8a8a8;
  }

  .backing-hint:hover {
    cursor: pointer;
  }
  .backing-hint:hover .backing-hint-text {
    color: white;
  }
  .backing-hint:hover .backing-hint-mark {
    background-color: white;
  }

  /* Backing ratio text */
  .backing-ratio-container {
    position: absolute;
    bottom: 50%;
    width: 100%;
  }
  .backing-ratio-title {
    font-size: 30px;
    text-shadow: #000 2px 2px 2px;
    -webkit-font-smoothing: antialiased;
  }
  .backing-ratio-subtitle {
    text-shadow: #000 2px 2px 2px;
    -webkit-font-smoothing: antialiased;
  }

  /* Adjusting the vault visual for smaller screen sizes */
  @media screen and (max-width: 550px) {
    .backing-hint-column {
      display: none;
    }
  }


  /******************************************/
  /*                                        */
  /*           General PAD stats            */
  /*                                        */
  /******************************************/


  .pad-stats-card {
    display: inline-block;
    width: 300px;
    height: 150px;
    max-height: 150px;
    background-color: #232530;
    margin: 5px;
    overflow: hidden;
    border-radius: 20px;
    -webkit-box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.59); 
  box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.59);
  }

  .pad-stats-card h1 {
    font-size: 1.5em;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .pad-stats-card p {
    font-size: 0.9em;
  }

</style>