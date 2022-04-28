<template>
  <v-container>

    <div class="main-container">
      <div class="iframe-container">
        <iframe :src="iframeSrc" ref="gameIframe" class="game-iframe" scrolling="no">
        </iframe>
      </div>
    </div>

  </v-container>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { ethers } from 'ethers'
  import { providers } from '@0xsequence/multicall'
  import { delay, toFloat } from '@/utils'
  import { IEcosystem, EcosystemId, ChainId } from '@/ecosystem'
  import {
    PADSWAP_PAIR_ABI,
    ERC20_ABI,
    PADSWAP_FARM_ABI
  } from '../constants'

  import {
    nftMinterAddress,
    NFT_MINTER_ABI_V1 as NFT_MINTER_ABI,
    MASTER_CONTRACT_ABI,
    SUPPORTED_NFTS
   } from '../nft_config.json'

  // @ts-ignore:disable-next-line
  import VueCryptojs from 'vue-cryptojs';
  Vue.use(VueCryptojs)

  const nft_addresses = {
    "wemove_alkebulan": "0xED1F51dA731B4E760C63B3B8f89d6eEE2AD36941"
  }

  const token_addresses = {
    "TOAD": "0xf480f38c366daac4305dc484b2ad7a496ff00cea",
    "PAD": "0x59193512877e2ec3bb27c178a8888cfac62fb32d"
  }

  const farms = {
    "bsc": {
      "toad_hoge": "0xA9F4eaA4e55Be6EB54018BAE0698b644BB36B47C"
    }
  }

  export default Vue.extend({
    data () {
      return {
        active: <boolean> true,
        toadMarketCap: <number> 0,
        padMarketCap: <number> 0,

        client: <any> null,
        session: <any> null,
        account: <any> null,

        gameSrc: <string> "./memeguardians-executable/index.html",
        iframeSrc: <string> "./memeguardians-executable/index.html"
      }
    },
    created () {
      this.$store.commit('setEcosystemId', 2)
      setInterval(async () => {
        await this.updateWalletData()
      }, 1000)
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
      },
    },
    beforeRouteLeave (to, from, next) {
      next()
    },
    methods: {
      // Fetches all supported NFTs/tokens from the user's wallet
      // This is a mediocre solution as it's possible to make the game think that you own all the NFTs when you really don't
      // But it works for now as a proof of concept
      async updateWalletData() {
        const userBalance : any = {}
        const promises : any = []

        // ERC-721 NFTs
        for (const [key, value] of Object.entries(nft_addresses)) {
          const nftContract = new ethers.Contract(value, ERC20_ABI, this.multicall)
          const promise = nftContract.balanceOf(this.address).then((res : any) => userBalance[key] = ethers.utils.formatUnits(res, 0))
          promises.push(promise)
        }
        await Promise.all(promises)

        // ERC-20 tokens
        for (const [key, value] of Object.entries(token_addresses)) {
          const tokenContract = new ethers.Contract(value, ERC20_ABI, this.multicall)
          const promise = tokenContract.balanceOf(this.address).then((res : any) => userBalance[key] = ethers.utils.formatEther(res))
          promises.push(promise)
        }
        await Promise.all(promises)

        // Special items available to farm stakers
        const dataseedBsc = new ethers.providers.StaticJsonRpcProvider('https://bsc-dataseed1.defibit.io/')
        const multicallAddress = "0x92F07bC24d6EA171581895121E65E23a91afa9c5"

        const multicallBsc = new providers.MulticallProvider(dataseedBsc, {
             batchSize: 300,
            timeWindow: 0,
            contract: multicallAddress
         })

        const farmContract = new ethers.Contract("0xA9F4eaA4e55Be6EB54018BAE0698b644BB36B47C", PADSWAP_FARM_ABI, multicallBsc)

        const farmShares = await farmContract.sharesOf(this.address)
        if (farmShares > 0) {
          userBalance["hoge_farm"] = 1
        }

        // Our ERC-1155 tokens
        let erc1155Balance : any = {}
        let minterContract = new ethers.Contract(nftMinterAddress, NFT_MINTER_ABI, this.multicall)

        for (var i = 0; i < SUPPORTED_NFTS.length; i++) {
          const nft_id = SUPPORTED_NFTS[i]

          const balance_p = minterContract.balanceOf(this.address, nft_id)

          const balance = await balance_p

          const item_balance = ethers.utils.formatUnits(balance, 0)

          if (parseFloat(item_balance) > 0) {
            erc1155Balance[nft_id.toString()] = item_balance
          }
        }


        // Passing the data to the game
        var data : any = {
          "walletAddress": this.address
        }

        data["tokens"] = userBalance
        data["erc1155_tokens"] = erc1155Balance


        this.iframeSrc = this.gameSrc + "#" + JSON.stringify(data)
      },
      async getMetadata(nft_id : number) {
        const id_str = nft_id.toString()
        const fileName = id_str.padStart(64, '0')
        const response = await fetch("https://meme-guardians.com/api/metadata/" + fileName + ".json")
        const item_data = await response.json()
        return item_data
      }
    },
  })
</script>

<style scoped>

.main-container {
  width: 100vw;
  height: calc(100vh - 50px);
  text-align: center;
}

.iframe-container {
  display: inline-block;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  left: 0;
  height: 90%;
  width: 100%;
  border-radius: 25px;
  overflow: hidden;
}

.game-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

</style>
