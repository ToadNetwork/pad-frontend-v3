<template>
  <v-tabs v-model="tabIndex">
    <v-tabs-slider></v-tabs-slider>
    <slot></slot>
  </v-tabs>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'SliderTabs',
  props: ['value'],
  data() {
    return {
      tabIndex: this.value
    }
  },
  watch: {
    tabIndex(val) {
      this.$emit('input', val)
    }
  }
})
</script>

<style scoped>
.v-tabs {
  width: auto;
}
.v-tabs /deep/ .v-tabs-slider-wrapper {
  height: 100% !important;
  z-index: 1;
  color: transparent;
  border-radius: 100px;
  background: #FFFFFF;
}
.v-tabs /deep/ .v-tabs-bar {
  border-radius: 100px;
  z-index: 2;
  height: auto;
}
.v-tabs /deep/ .v-tab::before {
  display: none;
}
.v-tabs /deep/ .v-tab {
  font-size: 14px;
  letter-spacing: 0.25px;
  text-transform: none;
  border-radius: 100px;
  z-index: 3;
  padding: 9.5px 15px;
}
.v-tabs /deep/ .v-tab--active {
  font-weight: bold;
  letter-spacing: 0.24px; /* prevent width from wiggling TODO: fix with javascript */
}
</style>