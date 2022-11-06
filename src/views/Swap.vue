<template>
    <v-container>

        <v-text-field
        v-model="inputTokenAddress"
        label="Input token">
        </v-text-field>

        <v-text-field
        v-model="outputTokenAddress"
        label="Output token">
        </v-text-field>

        <v-btn
        @click="swap()">
            SWAP
        </v-btn>

    </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'

import { ethers } from 'ethers'
import { EcosystemId, ECOSYSTEMS, ChainId } from '@/ecosystem'

import {
    ERC20_ABI,
    SWAP_ROUTER_ABI
} from '@/constants'

import { ChainId } from '@/ecosystem'

export default Vue.extend({
    components: {
    },
    data() {
        return {
            routerContractAddress: <string> '0x40F1fEF0Fe68Fd10ff904070ee00a7769EE7fe34',

            inputTokenAddress: <string> '0x59193512877E2EC3bB27C178A8888Cfac62FB32D',
            outputTokenAddress: <string> '0xF480f38C366dAaC4305dC484b2Ad7a496FF00CeA'
        }
    },
    computed: {
        userAddress(): string {
          return this.$store.state.address
        },
        multicall(): ethers.providers.Provider {
          return this.$store.getters.multicall
        },
        ecosystem(): IEcosystem {
          return this.$store.getters.ecosystem
        },
        web3(): ethers.Signer | null {
          return this.$store.state.web3
        },
        chainId(): ChainId {
          return this.$store.getters.ecosystem.chainId
        },
    },
    methods: {
        swap() {
            this.swapTokensForTokens()
        },
        async swapTokensForTokens() {
            const routerContract = new ethers.Contract(this.routerContractAddress, SWAP_ROUTER_ABI, this.multicall)

            console.log(routerContract)

            const amountInBn = ethers.utils.parseEther('100')
            const minimumAmountOutBn = ethers.utils.parseEther('0')

            const tx = await routerContract.populateTransaction.swapExactTokensForTokens(amountInBn, minimumAmountOutBn, [this.inputTokenAddress, this.outputTokenAddress], this.userAddress, Date.now() + 1000 * 60 * 10)

            const txReceipt: ethers.providers.TransactionReceipt | false = await this.safeSendTransaction({ tx, targetChainId: this.chainId })
        },
        ...mapActions(['requestConnect', 'safeSendTransaction'])
    }
})

</script>

<style scoped>

</style>