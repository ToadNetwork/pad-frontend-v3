<template>
  <v-menu
    offset-y
    :disabled="nonExpandable"
  >
    <template v-slot:activator="{ on, attrs }">
      <div
        v-bind="attrs"
        v-on="on"
        class="padswap-navbar-item"
      >
        <span>{{ title }}</span>
        <v-icon class="padswap-chevron-down" v-show="!nonExpandable">mdi-chevron-down</v-icon>
      </div>
    </template>
    <v-list class="padswap-nav-menu">
      <slot></slot>
    </v-list>
  </v-menu>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'NavMenu',
  props: {
    title: String,
    nonExpandable: Boolean
  }
})
</script>

<style scoped>
.padswap-navbar-item {
  padding-right: 25px;
}
.padswap-nav-menu {
  border-radius: 8px !important;
  background-color: #000000 !important;
}
.padswap-nav-menu /deep/ .v-list-item {
  padding: 11px 18px;
  font-family: Roboto;
  margin: 0px 7px;
}
.padswap-nav-menu /deep/ .v-list-item:hover .v-image,
.padswap-nav-menu /deep/ .v-list-item:hover .v-list-item__content > div:first-child {
  filter: invert(68%) sepia(70%) saturate(3531%) hue-rotate(94deg) brightness(108%) contrast(117%);
}
.padswap-nav-menu /deep/ .v-list-item:hover .v-subheader {
  color: #EBEDEF;
}
.padswap-nav-menu /deep/ .v-list-item:hover {
  cursor: pointer;
  background: #181D26;
  border-radius: 6px;
}
.padswap-nav-menu /deep/ .v-list-item > div {
  margin-bottom: 0px;
}
.padswap-nav-menu /deep/ .v-list-item__content {
  flex-direction: column;
  align-items: flex-start;
}
.padswap-nav-menu /deep/ .v-list-item__content > div {
  display: flex;
}
.padswap-nav-menu /deep/ .v-list-item .v-subheader {
  padding: 0px;
  margin-top: 2px;
  height: auto;
  font-size: 12px;
}
</style>