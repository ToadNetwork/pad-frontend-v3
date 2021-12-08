<template>
  <v-app>
    <v-app-bar
      app
      dark
      outlined="false"
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
        <div>Padswap<v-icon>mdi-chevron-down</v-icon></div>
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
  box-shadow: none;
  border: none;
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
</style>