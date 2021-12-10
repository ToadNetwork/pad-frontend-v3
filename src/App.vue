<template>
  <v-app>
    <v-app-bar
      app
      dark
      flat
    >
      <div>
        <v-img
          src="./assets/logo-white.png"
          width="162.42px"
        />
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex padswap-navbar">
        <div>Toad<v-icon>mdi-chevron-down</v-icon></div>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <div
              v-bind="attrs"
              v-on="on"
            >
              <span>Padswap</span>
              <v-icon>mdi-chevron-down</v-icon>
            </div>
          </template>
          <v-list class="padswap-nav-menu">
            <!-- TODO: separate component -->
            <v-list-item>
              <v-list-item-icon>
                <v-img src="./assets/icons/Icon-Swap.svg" />
              </v-list-item-icon>
              <v-list-item-content>
                <div>Swap</div>
                <v-subheader>Buy or sell tokens on PadSwap</v-subheader>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-img src="./assets/icons/Icon-Pad.svg" />
              </v-list-item-icon>
              <v-list-item-content>
                <div>Pad Farms</div>
                <v-subheader>Earn tokens by providing liquidity</v-subheader>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-img src="./assets/icons/Icon-Pad.svg" />
              </v-list-item-icon>
              <v-list-item-content>
                <div>Add Liquidity</div>
                <v-subheader>Create LP tokens to add to farms</v-subheader>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-img src="./assets/icons/Vault.svg" />
              </v-list-item-icon>
              <v-list-item-content>
                <div>Vault</div>
                <v-subheader>PAD's backing reserves</v-subheader>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-img src="./assets/icons/Icon-Chart.svg" />
              </v-list-item-icon>
              <v-list-item-content>
                <div>Stats</div>
                <v-subheader>Analyze token prices and volume</v-subheader>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
        <div>Shop<v-icon>mdi-chevron-down</v-icon></div>
        <div>Games<v-icon></v-icon></div>
        <div>About<v-icon>mdi-chevron-down</v-icon></div>
      </div>
      <div class="d-flex padswap-navbar ml-4">
        <!-- TODO: pad icon -->
        <div style="color: #00FC4C;">
          $0.000013
        </div>
        <div>EN<v-icon>mdi-chevron-down</v-icon></div>
        <div class="padswap-address-box">0x1...289</div>
      </div>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  data: () => ({
    //
  }),
});
</script>

<style scoped>
@font-face {
  font-family: Roboto Mono;
  src: url(assets/font/RobotoMono-VariableFont_wght.ttf);
}

.v-application {
  font-family: Roboto Mono;
  letter-spacing: 0.25px;
  background-image: url(assets/BG.png) !important;
  background-color: #000000 !important;
  background-repeat: no-repeat !important;
  padding: 0px 35px;
}
.v-sheet.v-toolbar.v-app-bar {
  padding-left: 120px;
  padding-right: 120px;
  background-color: transparent !important;
}

.padswap-navbar div {
  padding-right: 25px;
}
.padswap-address-box {
  border: 1.5px solid #00FC4C;
  box-sizing: border-box;
  border-radius: 100px;
  line-height: 20px;
  padding: 0px 20px;
  /* TODO: bigger font and vertical height */
}

.padswap-nav-menu {
  border-radius: 8px !important;
  background-color: #000000 !important;
}
.padswap-nav-menu .v-list-item {
  padding: 11px 25px;
  font-family: Roboto;
}
.padswap-nav-menu .v-list-item > div {
  margin-bottom: 0px;
}
.padswap-nav-menu .v-list-item .v-subheader {
  padding: 0px;
  margin-top: 2px;
  height: auto;
  font-size: 12px;
}
</style>