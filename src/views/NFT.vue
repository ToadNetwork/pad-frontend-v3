<template>

  <div>

    <div class="info-section">
      <div class="info-bar">
        <v-row
        align="stretch"
        justify="stretch">

          <v-col
          cols="12"
          sm="4">
            <v-card
            elevation="4"
            color="#ed00ff3b"
            height="100%">
              <v-card-title>
                ERC-1155
              </v-card-title>
              <v-card-subtitle>
                Token standard
              </v-card-subtitle>
              <v-card-text>
                Relatively new standard with lower gas fees and faster transactions
              </v-card-text>
            </v-card>
          </v-col>

          <v-col
          cols="12"
          sm="4">
            <v-card
            elevation="4"
            color="#ed00ff3b"
            height="100%">
              <v-card-title>
                Support TOAD
              </v-card-title>
              <v-card-subtitle>
                By purchasing NFTs
              </v-card-subtitle>
              <v-card-text>
                All raised funds will go to the publicly available <a href="https://padswap.exchange/donate" target="_blank" style="color: rgb(7, 255, 110)">marketing wallet</a>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col
          cols="12"
          sm="4">
            <v-card
            elevation="4"
            color="#ed00ff3b"
            height="100%">
              <v-card-title>
                Already usable
              </v-card-title>
              <v-card-subtitle>
                In our rogue-lite RPG
              </v-card-subtitle>
              <v-card-text>
                No empty promises, no presales - you can already use these NFTs in our game, <a href="/meme-guardians" target="_blank" style="color: rgb(7, 255, 110)">playable here</a>
              </v-card-text>
            </v-card>
          </v-col>

        </v-row>
      </div>
    </div>
  
    <br>
    <v-divider>
    </v-divider>
    <br>

    <div
    v-if="!this.address">
        <v-alert :value="true" color="gray" outlined rounded>
          <div class="text-center">
          Please connect your wallet to view the NFT store.
          </div>
        </v-alert>
    </div>

    <div class="nft-list-container">
      <v-row>
        <div
        class="nft-card"
        v-for="nft in nfts">
          <div class="nft-card-image">
            <img :src="nft['image']">
          </div>


          <div class="nft-card-text">


          <span
            class="nft-card-collected"
            v-if="nft['userBalance'] > 0">
              You already own this item
            </span>
            <span
            class="nft-card-not-collected"
            v-else
            >
              Not collected
            </span>

            <h2>{{ nft["name"] }}</h2>
            <v-divider></v-divider>
            <p>{{ nft["description"] }}</p>
          </div>

          <v-btn
          large
          flat
          color="#35933926"
          class="mint-btn"
          @click="mint(nft['id'])">
            MINT <span class="nft-card-cost">({{ nft["price"] }} GLMR)</span>
          </v-btn>
        </div>
      </v-row>
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
  import { ERC20_ABI } from '../constants'

  import {
    nftMinterAddress,
    NFT_MINTER_ABI_V1 as NFT_MINTER_ABI,
    MASTER_CONTRACT_ABI,
    SUPPORTED_NFTS
   } from '../nft_config.json'

  export default Vue.extend({
    components: {
      SliderTabs
    },
    data () {
      return {
        nfts: <any> [],
        active: <boolean> true,
        syncLock: new AwaitLock(),
      }
    },
    created () {
      // Setting ecosystem to glmr
      this.$store.commit('setEcosystemId', 2)
      setInterval(async () => {
        this.updateNftList()
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
      }
    },
    beforeRouteLeave (to, from, next) {
      next()
    },
    methods: {
      async sync() {
          await this.syncLock.acquireAsync()
          try {
            await this.syncInternal()
          } finally {
            this.syncLock.release()
          }
      },
      async syncInternal() {
      },
      async getMetadata(nft_id : number) {
        const id_str = nft_id.toString()
        const fileName = id_str.padStart(64, '0')
        const response = await fetch("https://meme-guardians.com/api/metadata/" + fileName + ".json")
        const item_data = await response.json()
        return item_data
      },

      async updateNftList() {
        let list : any = []

        let minterContract = new ethers.Contract(nftMinterAddress, NFT_MINTER_ABI, this.multicall)

        for (var i = 0; i < SUPPORTED_NFTS.length; i++) {
          const nft_id = SUPPORTED_NFTS[i]

          const nftPrice_p = minterContract.itemMintPrice(nft_id)
          const userBalance_p = minterContract.balanceOf(this.address, nft_id)

          const nftPrice = await nftPrice_p
          const userBalance = await userBalance_p
          const metadata = await this.getMetadata(nft_id)

          list.push({
            "id": nft_id,
            "name": metadata["name"],
            "description": metadata["description"],
            "image": metadata["image"],
            "userBalance": ethers.utils.formatUnits(userBalance, 0),
            "price": toFloat(nftPrice)
          })
        }

        this.nfts = list
      },
      async mint(nft_id : number) {
        let minterContract = new ethers.Contract(nftMinterAddress, NFT_MINTER_ABI, this.multicall)

        console.log(minterContract)

        const mintPrice = await minterContract.itemMintPrice(nft_id)

        let tx = await minterContract.populateTransaction.mint(nft_id, 1)
        tx!.value = mintPrice
        const succeeded = await this.safeSendTransaction({tx, targetChainId : this.chainId})
      },
      ...mapActions(['requestConnect', 'safeSendTransaction'])
    },
  })
</script>

<style scoped>

/****************/
/* Info section */
/****************/

.info-section {
  margin: 20px 0;
  display: block;
  width: 100%;
  font-family: roboto;
}

.info-bar {
  padding: 0 15px;
  margin-left: 2%;
  margin-right: 2%;
  min-height: 100px;
  border-radius: 20px;
  background-color: #000000;
  background-image: linear-gradient(147deg, #000000 0%, #2c3e50 74%);
}


/****************/
/* List of NFTs */
/****************/

.nft-list-container {
  margin-left: 4%;

}


.nft-card {
  display: inline-block;
  position: relative;
  height: 400px;
  width: 250px;
  border-radius: 18px;
  background: #1d1d1d;
  color:white;
  box-shadow: 5px 5px 15px rgba(0,0,0,0.9);
  font-family: roboto;
  text-align: justify;
  margin:30px;
  transform-style: preserve-3d;

  background-color: #424b54;
  background-image: linear-gradient(315deg, #424b54 0%, #1d242b 74%);

}
.nft-card::after {
  content:"";
  background: linear-gradient(45deg,
  #ff0000 0%, 
  #ff9a00 10%,
  #d0de21 20%,
  #4fdc4a 30%, 
  #3fdad8 40%,
  #2fc9e2 50%, 
  #1c7fee 60%, 
  #5f15f2 70%, 
  #ba0cf8 80%, 
  #fb07d9 90%, 
  #ff0000 100%  )
  repeat 0% 0% / 300% 100%;
  position: absolute;
  inset: -3px;
  border-radius: 16px;
  filter: blur(8px);
  transform: translateZ(-1px); /*or z-index */
  animation: rgb 6s linear infinite;
}
@keyframes rgb {
  0% {background-position: 0% 50%;}
  50% {background-position: 100% 50%;}
  100% {background-position: 0% 50%;}
}

/**********************/
/*     Item image     */
/**********************/

.nft-card-image {
  display: block;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  background-size: cover;
  text-align: center;
}

.nft-card-image img {
  display: inline-block;
  width: 180px;
  height: 180px;
}

.nft-card-text {
  margin: 25px;
  transform: translateZ(30px);
}
.nft-card-not-collected {
  color: rgb(255, 7, 110);
  font-size:13px;
}
.nft-card-collected {
  color: rgb(7, 255, 110);
  font-size:13px;
}


.nft-card-text p {
  color: #979797;
  font-size:14px;
  font-weight: 300;
}

.nft-card-text h2 {
  margin-top:0px;
  font-size:18px;
}

.nft-card-text .v-divider {
  margin-bottom: 5px;
}



.nft-card-cost {
  color: rgb(255, 255, 55);
  font-weight: bold;
}

.mint-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  width: 100%;
}

</style>