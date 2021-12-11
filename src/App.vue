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
        <nav-menu title="Toad">
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-News.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>News</div>
              <v-subheader>Latest news and announcements</v-subheader>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Toad.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>Toad Farms</div>
              <v-subheader>Earn tokens by providing liquidity</v-subheader>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Church.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>Temple</div>
              <v-subheader>Convert non-believers into hodlers</v-subheader>
            </v-list-item-content>
          </v-list-item>
        </nav-menu>
        <nav-menu title="Padswap">
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
              <v-img src="./assets/icons/Icon-Vault.svg" />
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
        </nav-menu>
        <nav-menu title="Shop">
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Piramyd.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>Piramyd Store</div>
              <v-subheader>Official Toad Merch</v-subheader>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Amazon.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>Amazon Store</div>
              <v-subheader>Official Toad Merch</v-subheader>
            </v-list-item-content>
          </v-list-item>
        </nav-menu>
        <nav-menu title="Games" non-expandable />
        <nav-menu title="About">
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Wiki.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>TOAD Wiki</div>
              <v-subheader>Learn more about TOAD and PAD</v-subheader>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Academy.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>Toad Academy</div>
              <v-subheader>Learn more about crypto</v-subheader>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Audit.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>Toad Network Audit Report</div>
              <v-subheader>Contracts audit report by SpaceAudits</v-subheader>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Audit.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>PadSwap Audit Report</div>
              <v-subheader>Contracts audit report by SpaceAudits</v-subheader>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Paper.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>Toad Network White Paper</div>
              <v-subheader>Toad Network's White Paper</v-subheader>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-img src="./assets/icons/Icon-Paper.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <div>PadSwap White Paper</div>
              <v-subheader>PadSwap's White Paper</v-subheader>
            </v-list-item-content>
          </v-list-item>
        </nav-menu>
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
import Vue from 'vue'
import NavMenu from './components/NavMenu.vue'

export default Vue.extend({
  name: 'App',
  components: { NavMenu },

  data: () => ({
    //
  }),
})
</script>

<style scoped>
@font-face {
  font-family: Roboto Mono;
  src: url(assets/font/RobotoMono-VariableFont_wght.ttf);
}

.v-application {
  font-family: Roboto Mono;
  letter-spacing: 0.25px;
  background-image: url(assets/BG.svg) !important;
  background-size: contain !important;
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
</style>