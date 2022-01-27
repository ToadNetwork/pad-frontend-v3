<template>
  <v-container class="main-container">

    <v-sheet class="launchpad-title-bar">
    <img class="background" src="@/assets/images/launchpad-texture-moonriver.jpg">
    <div class="launchpad-title">
      <img class="launchpad-image" src="@/assets/images/launchpad-rocket-moonriver.svg">
      <h1 style="margin-bottom: 0">Whitelist your presale</h1>
      <v-btn
      medium
      color="primary"
      href="/launchpad"
      style="margin-top: 10px;"
      >
        Back
      </v-btn>
    </div>

    <div class="launchpad-intro">
      <p class="please-read">
        Before applying to get your token whitelisted, make sure that it meets the following criteria.
      </p>
    </div>

    <div class="launchpad-faq">
      <v-expansion-panels>
      <v-expansion-panel>
      <v-expansion-panel-header style="text-align:center !important; display: block">
        Click here to read
      </v-expansion-panel-header>
      <v-expansion-panel-content>

        <ul class="perks-list">
          <li>
            Your presale must have a hard cap (maximum total contribution) of <b>at least</b> $150K. While reaching the hard cap is not required, failing to reach the <b>soft cap</b> (25% of hard cap) results in the presale being automatically cancelled.
          </li>
          <li>
            At least 50% of your token's supply must be allocated to the presale, unless there's a good reason to do otherwise or your tokenomics don't allow it. This can be discussed case by case.
          </li>
          <li>
            If your token uses a custom contract, it must be audited. This can be skipped if your token was created via our token factory.
          </li>
        </ul>

      </v-expansion-panel-content>
      </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div class="text-center" style="margin:20px">
      If your presale meets the criteria above, email us at <a href="mailto:snake@toad.network" target="blank" style="color: #00f000">snake@toad.network</a> or message us on <a href="https://t.me/toadnetwork" target="blank" style="color: #00f000">Telegram</a>

    </div>
    </v-sheet> 
    
  </v-container>
</template>

<style scoped>
.main-container {
  text-align: center;
}


.launchpad-title-bar {
  padding-top: 20px;
  z-index: 1;
  position: relative;
  overflow: hidden;
  text-align: center;
  background: rgba(24, 29, 38, 0.7) !important;
  border-radius: 20px;
  margin-bottom: 30px;
}
.launchpad-title-bar h1 {
  margin-bottom: 25px;
}

.launchpad-title-bar-section {
  text-align: center;
  font-size: 0.7rem;
}

.launchpad-title-bar-section {
  text-align: center;
  padding: 20px;
}


/* Title */
.launchpad-title {
  width: 100%;
}
.launchpad-title img {
  max-width: 100px;
}
.launchpad-title h1 {
  color: white;
  text-shadow: #000 2px 2px 2px;
  -webkit-font-smoothing: antialiased;
}

.background {
  pointer-events: none;
  position: absolute;
  min-width: 100%;
  min-height: 100%;
  left: 0;
  top: 0;
  z-index: -1;
  opacity: 0.06;
}


/********/
/* FAQ */
/********/

.launchpad-intro {
  margin-top: 25px;
}

.v-expansion-panels {
  background: none !important;
  border: none !important;
}

.v-expansion-panel {
  background-color: #00000085 !important;
}

.v-expansion-panel-header:hover {
  background-color: #d2f3f21a !important;
}

.launchpad-faq {
  border-radius: 20px;
  overflow: hidden;
  text-align: left;
}

.launchpad-faq h1 {
  background-color: #80808012;
  padding: 10px;
  border-radius: 10px;
  margin-top: 15px;
  font-size: 1rem;
  color: #f7f7f7;
}
.launchpad-faq p, .launchpad-faq li {
  color: #e7e7e7;
}

.perks-list li {
  margin-top: 10px;
}

</style>
