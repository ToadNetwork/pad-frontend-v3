<template>
  <div style="text-align: center; padding-bottom: 200px;">

  <!-------------------------------------------->
  <!-- The vault currently defaults to BSC,   -->
  <!-- ecosystem slider is commented out      -->
  <!-------------------------------------------->

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
    <br><br>


  <!-------------------------------------------->
  <!--             Loading screen             -->
  <!-------------------------------------------->

  <div class="text-center" v-if="vaultProcessed == false">
    <v-card
    outlined>
      <v-card-text>
        Loading vault data, please wait...
      </v-card-text>
    </v-card>
  </div>


  <!---------------------------------------------------------->
  <!--  General container for vault stuff,                  -->
  <!--  shown only after the vault data has been loaded     -->
  <!---------------------------------------------------------->

  <div
  :style="vaultProcessed ? 'visibility: visible;' : 'visibility: hidden;'"
  style="display: inline-block; max-width: 1200px;">


  <!-------------------------------------------->
  <!--                                        -->
  <!--       Backing ratio & PAD stats        -->
  <!--                                        -->
  <!-------------------------------------------->

  <div class="fullwidth panel main-panel" style="margin-bottom: 15px !important;">

    <img style="width: 50px; height: 50px;" src="@/assets/icons/Vault Icon.svg">
    <h1 class="title">The Vault</h1>
    <br>
    <div class="launchpad-intro">
      <p class="please-read">
        Collects backing for PAD. Redeem anytime.
      </p>
    </div>

    <v-btn
    href="https://docs.toad.network/fundamentals/the-vault"
    outlined
    target="_blank"
    >Learn More</v-btn>
    <br><br>
    <v-divider></v-divider>
    <br><br>

    <!--------------------------------------------->
    <!-- Fancy container with backing percentage -->
    <!--------------------------------------------->
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" style="display: none;">
      <symbol id="wave">
        <path d="M420,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C514,6.5,518,4.7,528.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H420z"></path>
        <path d="M420,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C326,6.5,322,4.7,311.5,2.7C304.3,1.4,293.6-0.1,280,0c0,0,0,0,0,0v20H420z"></path>
        <path d="M140,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C234,6.5,238,4.7,248.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H140z"></path>
        <path d="M140,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C46,6.5,42,4.7,31.5,2.7C24.3,1.4,13.6-0.1,0,0c0,0,0,0,0,0l0,20H140z"></path>
      </symbol>
    </svg>

    <div style="display: inline-block;">
      <div class="vault-backing-section">
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
              <div class="box" id="backing-animation">
              <div class="percent">
                <div class="percentNum" id="count">0%</div>
                <div class="percentCaption">BACKED</div>
              </div>
              <div id="water" class="water">
                <svg viewBox="0 0 560 20" class="water_wave water_wave_back">
                  <use xlink:href="#wave"></use>
                </svg>
                <svg viewBox="0 0 560 20" class="water_wave water_wave_front">
                  <use xlink:href="#wave"></use>
                </svg>
              </div>
            </div>
            </div>
           
          </div>
        </div>
        </div>
      </div>
    </div>

    <!-------------------->
    <!-- Redeem backing -->
    <!-------------------->
    <div class="redeem-section" style="position: relative; display: inline-block; top: 0; vertical-align: top;">
      <div
      width="100%"
      >
        <div
        style="display: inline-block; border: 1px solid #bb8000; color: #bb8000; border-radius: 15px; text-align: left; padding: 15px; margin: 20px 0; max-width: 400px; vertical-align: top;">
          <span style="font-size:  0.8em;">
            PAD is {{backingPercentage}}% backed.<br>
            By redeeming PAD's backing tokens,<br>
            you will receive ~{{backingPercentage}}% of its value.
          </span>
        </div>
        <br>
        <v-text-field
          v-model="amount"
          type="number"
          min="0.0"
          outlined
          dense
          color="#00FC4c"
          background-color="black"
          hide-spin-buttons
          append-icon
          class="mr-3"
          height="50px"
          label="Amount of PAD to burn"
          style="padding-top:5px; border-radius: 10px;"
          width="100%"
          >
          <template v-slot:append>
            <v-btn
              @click="setMax"
              small
              color="transparent"
              class="padswap-max-btn mr-n3">
              Max
            </v-btn>
          </template>
        </v-text-field>

        <v-text-field
          v-model="expected"
          outlined
          disabled
          dense
          background-color="dark-grey"
          class="mr-3"
          height="50px"
          label="You will receive"
          style="border-radius: 10px;"
          width="100%"
          >
        </v-text-field>

        <div class="text-center">
          <v-btn
          v-if="!address"
          x-large
          outlined
          width="100%"
          @click="requestConnect"
          >
            Connect Wallet
          </v-btn>
          <v-btn
          v-else-if="!isApproveComplete"
          x-large
          outlined
          width="100%"
          @click="approve"
          >
            Approve
          </v-btn>
          <v-btn
          v-else="!isApproveComplete"
          x-large
          outlined
          color="light-green"
          width="100%"
          @click="redeem"
          >
            Redeem
          </v-btn>
        </div>
      </div>
    </div>
  </div>

  <!------------------------------------------>
  <!--                                      -->
  <!--  Reserves breakdown & burn counter   -->
  <!--                                      -->
  <!------------------------------------------>
  <div class="text-center">
    <div>
      <v-row
      style="margin-bottom: 10px;"
      justify="center">
        <v-col
        class="no-padding"
        cols="12"
        md="6">
          <div class="fullwidth panel" style="max-width: 800px; height: 100%;">
            <h1 class="title">Vault Holdings</h1>
            <br>
            <v-divider style="margin-bottom: 10px;"></v-divider>
            <div class="apexchart-container">
              <apexchart
                ref="holdings"
                type="donut"
                width="100%"
                :options="options"
                :series="series">
              </apexchart>
            </div>
          </div>
        </v-col>

        <v-col
        class="no-padding"
        cols="12"
        md="6">
          <div class="fullwidth panel" style="max-width: 800px; height: 100%;">
            <h1 class="title">PAD Burned</h1>
            <br>
            <v-divider style="margin-bottom: 80px;"></v-divider>
            <div style="height:200px;">
              <div class="burn-counter-left">
                <i aria-hidden="true" class="v-icon notranslate mdi mdi-fire theme--dark orange--text"></i>
                <h1 class="title" style="margin-top: -7px;">{{round((padBurned/200000000000)*100, 2)}}%</h1>
                <div style="line-height: 15px;font-size: 10px;">OF THE <br>TOTAL SUPPLY</div>
              </div>
              <div class="burn-counter-center"><i aria-hidden="true" class="v-icon notranslate mdi mdi-fire theme--dark orange--text" style="font-size: 36px; margin-bottom: 10px; margin-top: 39px;"></i><h1 data-v-193be130="" class="title"> 1.93BI<br data-v-193be130="">PAD </h1></div>
              <div class="burn-counter-right">
                <i aria-hidden="true" class="v-icon notranslate mdi mdi-fire theme--dark orange--text"></i>
                <h1 class="title" style="margin-top: -7px;">{{round((padBurned/(padSupply/1e18))*100, 2)}}%</h1>
                <div style="line-height: 15px;font-size: 10px;">OF THE <br>CIRC. SUPPLY</div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <div>
      <v-row
      justify="center">
        <v-col
        class="no-padding"
        cols="12"
        md="6">
          <div class="fullwidth panel" style="max-width: 800px; height: 400px;">
            <h1 class="title">Inflation Rate</h1>
            <br>
            <v-divider style="margin-bottom: 20px;"></v-divider>
            <div class="apexchart-container">
              <apexchart
              ref="inflation"
              width="99%"
              height="265px"
              type="line"
              :options="inflationOptions"
              :series="inflation">
              </apexchart>
            </div>
          </div>
        </v-col>

        <v-col
        class="no-padding"
        cols="12"
        md="6">
          <div class="fullwidth panel" style="max-width: 800px; height: 400px;">
            <h1 class="title">PAD Supply</h1>
            <br>
            <v-divider style="margin-bottom: 20px;"></v-divider>
            <div class="apexchart-container">
              <apexchart
              ref="supply"
              width="99%"
              height="265px"
              type="line"
              :options="circulatingOptions"
              :series="supply">
              </apexchart>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>

</v-container>
</div>
</div>
</template>

<script lang="ts">
  import axios from 'axios'
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
          stroke: {
            show: false,
            colors: ["#181d26b3"]
          },
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
            position: 'bottom',
            formatter: (seriesName : string) => {
              // @ts-ignore
              return seriesName
            }

          },
          chart: {
            toolbar: {
              show: false
            },
                colors: ["green", "blue", "purple", "yellow", "orange", "black", "white"]
          },
          plotOptions: {
            pie: {
              donut: {
                size: '50%'
              }
            },
            treemap: {
              distributed: true,
              useFillColorAsStroke: true
            }
          },
          colors: []
        },
        series: [],

        burnOptions: <any> {
          stroke: {
            show: false,
          },
          tooltip: <any> {
            enabled: true,
              y: {
                formatter: (value : any, { series, seriesIndex, dataPointIndex, w } : any ) => {
                  // @ts-ignore
                  return this.biOrMiOrK(value) + ' PAD'
                }
              },
              x: {
                format: 'dd MMM yyyy',
              },
          },
          legend: {
            position: 'bottom',
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
            pie: {
              donut: {
                size: '60%'
              }
            },
            treemap: {
              distributed: true,
              useFillColorAsStroke: true
            }
          },
        },
        burnSeries: [],

        inflationOptions: {
      zoom: {
        enabled: true,
        type: 'x',  
        autoScaleYaxis: true
      },
      colors: ["#bfbf1f"],
      tooltip: {
        enabled: true,
          y: {
            formatter: function(value: any, { series, seriesIndex, dataPointIndex, w }: { series: any, seriesIndex: any, dataPointIndex: any, w: any }) {
              return value+'%'
            }
          },
          x: {
            format: 'dd MMM yyyy',
          },
        },
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          type: 'datetime',
          tooltip: {
            enabled: false
          },
          labels: {
            show: true,
            style: {
              colors: 'gray',
              fontSize: '12px'
            },
          }
        },
        yaxis: {
          min: 0,
          max: 2.5,
          tickAmount: 5,
          type: 'datetime',
          tooltip: {
            enabled: false
          },
          labels: {
            show: true,
            style: {
              colors: 'gray',
              fontSize: '12px'
            },
          }
        }
      },
      circulatingOptions: {
      colors: ["#77bf1f"],
        tooltip: {
          enabled: true,
            y: {
              formatter: function(value: any, { series, seriesIndex, dataPointIndex, w }: { series: any, seriesIndex: any, dataPointIndex: any, w: any }) {
                return value + 'BI'
              }
            },
            x: {
              format: 'dd MMM yyyy',
            },
        },
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          type: 'datetime',
          tooltip: {
            enabled: false,
            theme:'dark',
            style: {
              backgroundColor: 'black'
            }
          },
          labels: {
            show: true,
            style: {
              colors: 'gray',
              fontSize: '12px'
            },
          }
        },
        yaxis: {
          min: 0,
          max: 200,
          tickAmount: 5,
          type: 'datetime',
          tooltip: {
            enabled: false,
            theme:'dark',
            style: {
              backgroundColor: 'black'
            }
          },
          labels: {
            formatter: function(value : any, timestamp: any, opts: any) {
              return value+'BI'
            },
            show: true,
            style: {
              colors: 'gray',
              fontSize: '12px'
            },
          }
        }
      },
      inflation: [{
        name: 'Inflation Rate',
        data: []
      }],
      supply: [{
        name: 'Circulating Supply',
        data: []
      }],


        inflationCalculated: <boolean> false,

        totalBacking: 0,

        // PAD stats
        mcap: 0,
        padSupply: <number> 0,
        padBurned: <number> 0,
        padPrice: <number> 0,
        backingPercentage: <string> '0',
        userPadBalance: <number> 0,

        amount: <number> 0,
        expected: <string> '~0 USD',

        contractAddress: <string> '',
        contractABI: <any> {},

        tokens: <any> [],
        pairs: <any> [],

        userTokenAllowance: <number> 0,

        vaultProcessed: <boolean> false
      }
    },
    created () {
      setTimeout(async () => {
        await this.loadVaultData()
        setTimeout(async () => {
          await this.getVaultLpValue()
          // await this.scrollTo('backing-animation', 120)
          await this.loadVaultAnimation()
      }, 1000)

      },60);
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
        this.expected = '~' + expectedUSD.toString() + ' USD'
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
          this.backingPercentage = 0
          this.mcap = 0
          this.vaultProcessed = false
          setTimeout(async () => {
              await this.loadVaultData()
              setTimeout(async () => {
              await this.getVaultLpValue()
              // await this.scrollTo('backing-animation', 120)
              await this.loadVaultAnimation()
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
      loadVaultAnimation() {
          var cnt=document.getElementById("count")
          cnt.innerHTML = 0 + '%'

          var water=document.getElementById("water")
          var percent=cnt.innerText.split('%')[0]
          var interval;
          interval=setInterval(()=>{ 
            percent++
            cnt.innerHTML = percent + '%'
            var movementDirection = Math.sign(this.backingPercentage - percent)
            water.style.transform='translate(0'+','+(movementDirection * (100-percent) )+'%)'
            if(percent==Math.floor(this.backingPercentage)){
              clearInterval(interval)
            }
          }, 40)
      },

      scrollTo(el, offset) {
          var element = document.getElementById(el)
          var headerOffset = offset
          var elementPosition = element.getBoundingClientRect().top
          var offsetPosition = elementPosition + window.pageYOffset - headerOffset
          
          window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
          });  
      },
      
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
        // TODO: call everything simultaneously
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

        const tokenColors : any = {
          "Toad Network": "#66b535",
          "Lily Pad": "#bfed79",
          "PARADOX NFT BSC": "#3ebbc2",
          "Wrapped BNB": "#f2d513",
          "BUSD Token": "#d98116",

        }

        // Updating the pie chart
        let tokenLabels = []
        let tokenValues = []
        let labelColors = []
        let smallBalances : number = 0
        let total : number = 0
        for (const [key, value]  of Object.entries(vaultData)) {
          if (value as number >= 1000) {
            tokenLabels.push(key)
            tokenValues.push(value)
            if (key in tokenColors) {
              labelColors.push(tokenColors[key])
            }
            else {
              labelColors.push('A0A0A0')
            }
          }
          else {
            smallBalances += value as number
          }
        }
        tokenLabels.push('Other')
        tokenValues.push(smallBalances)
        labelColors.push('#ac9cba')
        


        const backingChart : any = this.$refs!.holdings!
        backingChart.updateOptions({
          labels: tokenLabels,
          colors: labelColors
        })
        backingChart.updateSeries(tokenValues)

        window.setInterval(() => this.getPadInfo(), 2000)

        const burnStatsResponse = await axios.post('https://api.thegraph.com/subgraphs/name/toadguy/pad-token', {
            query: `
            {
              tokens(address:"` + this.padAddress + `") {
                id
                address
                totalBurned
                totalSupply
              }
            }
            `
        })
        const padStats = JSON.parse(burnStatsResponse.request.response).data.tokens
        // console.log(padStats)
        this.padBurned = parseFloat(padStats[0].totalBurned)

        this.vaultProcessed = true

        if (!this.inflationCalculated) {
          this.calculateCircSupply()
        }
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
        
      },
      calculateCircSupply() {
        let circulating = 10*1e9
        const maxSupply = 200*1e9
        const mintRate = 0.0013
        let remainingSupply = 190*1e9
        const circSupply = []
        const inflationRate = []
        const mintedPerDay = []
        const remainingSupplyPerDay = []
        const arr = []
        for(let i = 0; i<= 3650; i++) {
          const epoch = (1620490010 + i*86400) *1000
          // console.log(epoch)
          // console.log(i)
          arr[i] = i
          const mint = mintRate*remainingSupply
          circulating = circulating + mint
          circSupply[i] = [epoch, this.round(circulating/1e9, 3)]
          mintedPerDay[i] = mint
          inflationRate[i] = [epoch, this.round(mint/circulating*100, 4)]
          remainingSupplyPerDay[i] = remainingSupply
          remainingSupply = remainingSupply - mint

          const inflationChart : any = this.$refs!.inflation!
          const supplyChart : any = this.$refs!.supply!

          if(i == 3650) {
            inflationChart.updateSeries([{
              data: inflationRate
            }]);
            inflationChart.zoomX(new Date(1620490010 *1000).getTime(), new Date((1620490010 + 2*365*86400) *1000).getTime())
            supplyChart.updateSeries([{
              data: circSupply
            }]);
            supplyChart.zoomX(new Date(1620490010 *1000).getTime(), new Date((1620490010 + 1*365*86400) *1000).getTime())
          }
        }
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
<style>
  html {
    scroll-behavior: smooth;
  } 
  /******************************************/
  /*                                        */
  /*           Apexcharts styling           */
  /*                                        */
  /******************************************/

  .apexchart-container {

  }

  .apexcharts-legend-text {
    color: white !important;
  }

  .apexcharts-tooltip {
    background-color: #D0D0D0 !important;
    color: #000000 !important;
  }

  .apexcharts-menu, .apexcharts-menu-item {
    background-color: #D0D0D0 !important;
    color: #000000 !important;
  }

</style>
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
  *, *:before, *:after {
    box-sizing: border-box;
    outline: none;
    }

    body {
    background:#020438;
    font: 14px/1 'Open Sans', helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .box{
    height: 500px;
    width: 294px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #00f2ff33;
    border-radius:1%;
    overflow: hidden; 
  }
  .percentNum {
    font-size: 50px;
  }
  .percentCaption {
    line-height: 14px;
    padding: 0;
    font-size: 26px;
  }
  .percent{
    position: absolute;
    left: 0;
    top: 44%;
    z-index:3;
    width: 100%;
    height: 100%;
    align-items:center;
    justify-content:center; 
    color:#fff;
    font-size:64px;
  }
  .water{
    position: absolute;
    left: 0;
    top: 0;
    z-index:2;
    width: 100%;
    height: 100%;
    transform: translate(0,100%);
    background: #6bb535 !important;
    transition: all .3s;
  }
  .wave{
    width: 200%;
    position: absolute;
    bottom: 100%;
  }

  .water_wave_back {
    width: 200%;
    position: absolute;
    bottom: 100%;
    right: 0;
    fill: #bfed79 !important;
    animation: wave-back 1.6s infinite linear;
  }
  .water_wave_front {
    width: 200%;
    position: absolute;
    bottom: 100%;
    left: 0;
    fill: #6bb535 !important;
    margin-bottom: -1px;
    animation: wave-front .8s infinite linear;
  }
  @keyframes wave-front {
    100% {
      transform: translate(-50%, 0);
    }
  }

  @keyframes wave-back {
    100% {
      transform: translate(50%, 0);
    }
  }
  .vault-backing-section {
    display: inline-block;
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

  /******************************************/
  /*                                        */
  /*           General PAD stats            */
  /*                                        */
  /******************************************/

  .pad-stats-card {
    width: 300px;
    height: 150px;
    max-height: 150px;
    background-color: transparent;
    margin: 5px;
    overflow: hidden;
    border-radius: 20px;
  }

  .pad-stats-card h1 {
    font-size: 1.5em;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .pad-stats-card p {
    font-size: 0.9em;
  }
  
  .burn-counter-left {
    z-index: 3;
    background: #11141b;
    position: absolute;
    display: inline-block;
    border: 2px solid orange;
    height: 160px;
    top: 210px;
    left: 20px;
    width: 160px;
    text-align: center;
    margin-bottom: 25px;
    border-radius: 50%;
  }

  .burn-counter-center {
    left: 143px;
    display: inline-block;
    border: 2px solid orange;
    height: 200px;
    width: 200px;
    text-align: center;
    margin-bottom: 25px;
    border-radius: 50%;
    position: absolute;
  }

  .burn-counter-right {
    background: #11141b;
    position: absolute;
    display: inline-block;
    border: 2px solid orange;
    height: 160px;
    top: 210px;
    left: 310px;
    width: 160px;
    text-align: center;
    margin-bottom: 25px; 
    border-radius: 50%;
  }
  .burn-counter-left > i {
      font-size: 36px; margin-bottom: 11px; margin-top: 23px;
  }
  .burn-counter-right > i {
      font-size: 36px; margin-bottom: 11px; margin-top: 23px;
  }
  /* Adjusting the vault visual for smaller screen sizes */
  @media screen and (max-width: 565px) {
    .backing-hint-column {
      display: none;
    }

    .box{
      min-height: 400px !important;
      height: 400px !important;
      min-width: 240px !important;
      width: 240px !important;
    }

    .vault-backing-outer {
      min-height: 400px !important;
      height: 400px !important;
      min-width: 244px !important;
      width: 244px !important;
    }

    .vault-backing-section {
      min-height: 420px;
    }

    .burn-counter-left {
      width: 130px;
      height: 130px;
    }

    .burn-counter-center {
      left: 102px;
      height: 160px;
      width: 160px;
    }

    .burn-counter-right {
      left: 223px;
      width: 130px;
      height: 130px;
    }

    .burn-counter-left > i, .burn-counter-right > i {
      margin-top: 10px;
    }

    .burn-counter-center > i {
      margin-top: 22px;
    }

    .v-application .justify-center {
      margin: 0px;
      justify-content: center !important;
      max-width: 100%;
    }
    .no-padding {
      padding-left: 0px !important;
      padding-right: 0px !important;
    }
  }

  @media screen and (min-width: 565px) {
    .vault-backing-section {
      min-width: 515px;
    }
    .redeem-section {
      margin: 0 60px;
    }
  }

  @media screen and (min-width: 1262px) {
    .main-panel {
      min-width: 1000px;
    }
  }

</style>