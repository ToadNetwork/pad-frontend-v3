<template>
  <v-menu
    offset-y
    open-on-hover
    nudge-right="12.5px"
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
  padding: 12.5px;
  white-space: nowrap;
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
.padswap-navbar-item:hover,
.padswap-nav-menu /deep/ .v-list-item:hover .v-image,
.padswap-nav-menu /deep/ .v-list-item:hover .v-icon,
.padswap-nav-menu /deep/ .v-list-item:hover .v-list-item__content > div:first-child {
  filter: invert(11%) sepia(18%) saturate(5908%) hue-rotate(75deg) brightness(90%) contrast(123%);
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