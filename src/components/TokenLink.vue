<template>
  <v-tooltip
  :open-on-hover="false"
  top
  nudge-right
  :color="color"
  >
    <template #activator="{ on, attrs }">
      <span
      class="token-link"
      :class='linkClass'
      @click="on.click"
      retain-focus-on-click
      v-bind="attrs"
      v-on="on">
      {{ linkText }}
      </span>
    </template>

    <h3>{{ symbol }}</h3>
    <span>
      <v-img
      class="gold-image"
      src="@/assets/icons/Icon_Farm.svg"
      height="20px"
      width="20px"/>
     ({{ name }})
    </span>
    <v-divider
    color="gray"></v-divider>
    <br>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'TokenLink',
  props: {
    tokenData : Object,
    symbol : String,
    address : String,
    ecosystem : String,
  },
  data() {
    return {
      name : <string> 'aaaa',
      color : <string> '#ffffff',
      showTooltip : <boolean> false,

    }
  },
  computed: {
    linkText(): string {
      if (this.tokenData.type == 'normalToken') {
        return this.tokenData.data.symbol
      }
      else if (this.tokenData.type == 'liquidityPair') {
        return this.tokenData.data.token0.symbol + '-' + this.tokenData.data.token1.symbol + ' LP'
      }
      else {
        return "[invalid token]"
      }
    },
    linkClass(): string {
      if (this.tokenData.type == 'normalToken') {
        return 'normal-token-link'
      }
      else if (this.tokenData.type == 'liquidityPair') {
        return 'liquidity-pair-link'
      }
      else {
        return "error-link"
      }
    }
  },
  methods: {
    getExtraInfo() {

    },
    toggleTooltip() {
      this.showTooltip = true
    }
  }
})
</script>

<style scoped>
  .token-link {
    margin-left: 2px;
    margin-right: 2px;
    border-bottom: 1px dashed rgb(243, 177, 94);
    color: rgb(243, 177, 94);
    cursor: help;
  }

  .liquidity-pair-link {
    color: #ffd400 !important;
    border-bottom: 1px dashed #ffd400 !important;
  }

  .normal-token-link {
    color: rgb(243, 177, 94) !important;
    border-bottom: 1px dashed rgb(243, 177, 94) !important;
  }

  .error-link {
    color: red !important;
    border-bottom: 1px dashed red !important;
  }


  .v-tooltip__content {
    background-color: #ffffd7 !important;
    opacity: 1.0 !important;
    color: black !important;
    border: 1px dashed gray !important;
    z-index: 999 !important;
  }

  .gold-image {
  filter: invert(38%) sepia(91%) saturate(281%) hue-rotate(350deg) brightness(105%) contrast(91%);
  }
</style>