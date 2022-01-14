<template>
  <div class="whiteboard-container">
    <div id="whiteboard-frame">
      <div id="whiteboard">
        <h1 style="transform: rotate(-2deg); font-size: 3em; opacity: 0.8;"><span style="color: #275216; text-decoration: underline;">Operation ZapMoon</span> <span style="color: #6a5838; font-size: 0.5em;">(probably)</span></h1>
        <v-row
        align="center"
        justify="center"
        style="margin-top: 50px;">
        <v-col
        cols="12"
        sm="6">
          <h2 style="text-align: center; transform: rotate(-8deg); color: #71a54a; font-size: 2.5em;">The plan:</h2>
          <ul style="transform: rotate(-5deg); color: black; font-size: 2em; list-style-type:none; text-align: left;">
            <li>1. Deposit stablecoins to mint ZAP</li>
            <li>2. ZAP is now 100% backed</li>
            <li>3. A 1% fee when ZAP is minted</li>
            <li>4. ZAP is now 101% backed</li>
            <li>5. ?????</li>
            <li>6. Price only goes up</li>
          </ul>
        </v-col>
        <v-col
        cols="12"
        sm="6">
          <img style="transform: rotate(-5deg); width: 80%;" src="../assets/images/crayon-drawing-toad.png"/>
          <img style="transform: rotate(20deg); width: 80%; position: relative; top: 0;" src="../assets/images/crayon-drawing-zapmoon.png"/>
        </v-col>

        </v-row>

        <h1 style="transform: rotate(2deg); font-size: 3em; opacity: 0.8;"><span style="color: #275216; text-decoration: underline;">Ape area</span></h1>

        <v-row
        align="center"
        justify="center">
          <v-col
          cols="12"
          sm="6">
          <h2 style="text-align: center; transform: rotate(1deg); color: #71a54a; font-size: 2.5em;">Ape:</h2>
          <div class="ape-details" style="max-width:400px; display:inline-block;">
            <div class="d-flex align-center ml-md-2 mr-md-5 py-2">
            <span style="color: black; font-size: 1.5em;">Select&nbsp;pair:&nbsp;</span>
           
            <v-select
              solo
              hide-details="true"
              class="ml-2"
              background-color="#292D38"
              style="max-width: 200px"
              rounded
              :items="['BUSD-USDC', 'USDT-USDC', 'USDC-DAI', 'USDT-DAI']"
              v-model="sortBy"
            />
            </div>
            <div class="d-flex align-center ml-md-2 mr-md-5 py-2">
            <span style="color: black; font-size: 1.5em;">LP amount: &nbsp;</span>
              <v-text-field
                      type="number"
                      min="0.0"
                      solo
                      outlined
                      rounded
                      dense
                      color="#00FC4c"
                      background-color="#71767F"
                      hide-spin-buttons
                      append-icon
                      class="mr-3"
                      :class="{ 'padswap-disabled-control': dwAction == 'reinvest' }"
                      height="40px"
                      hide-details
                    >
                      <template v-slot:append>
                        <v-btn
                          @click="setMax"
                          x-small
                          color="#595E67"
                          class="padswap-max-btn mr-n3">
                          Max
                        </v-btn>
                      </template>
              </v-text-field>
            </div>
          </div>
          <div class="ape-buttons">
            <button type="button" name="button" class="ape-button">Ape</button>
          </div>
          </v-col>

          <v-col
          cols="12"
          sm="6">
          <h2 style="text-align: center; transform: rotate(1deg); color: #71a54a; font-size: 2.5em;">Un-ape:</h2>
          <div class="ape-details" style="max-width:400px; display:inline-block;">
            <div class="d-flex align-center ml-md-2 mr-md-5 py-2">
            <span style="color: black; font-size: 1.5em;">Select&nbsp;pair:&nbsp;</span>
           
            <v-select
              solo
              hide-details="true"
              class="ml-2"
              background-color="#292D38"
              style="max-width: 200px"
              rounded
              :items="['BUSD-USDC', 'USDT-USDC', 'USDC-DAI', 'USDT-DAI']"
              v-model="sortBy"
            />
            </div>
            <div class="d-flex align-center ml-md-2 mr-md-5 py-2">
            <span style="color: black; font-size: 1.5em;">LP amount: &nbsp;</span>
              <v-text-field
                      type="number"
                      min="0.0"
                      solo
                      outlined
                      rounded
                      dense
                      color="#00FC4c"
                      background-color="#71767F"
                      hide-spin-buttons
                      append-icon
                      class="mr-3"
                      :class="{ 'padswap-disabled-control': dwAction == 'reinvest' }"
                      height="40px"
                      hide-details
                    >
                      <template v-slot:append>
                        <v-btn
                          @click="setMax"
                          x-small
                          color="#595E67"
                          class="padswap-max-btn mr-n3">
                          Max
                        </v-btn>
                      </template>
              </v-text-field>
            </div>
          </div>
          <div class="ape-buttons">
            <button type="button" name="button" class="ape-button" style="font-size: 2em;">Un-ape</button>
          </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<style scoped>
@font-face {
  font-family: Crayon;
  src: url(../assets/font/Crayon.woff2);
}

.whiteboard-container {
  display: block;
  width: 100%;
  text-align: center;
}

#whiteboard-frame {
  transform: rotate(-1deg);
  display: inline-block;
  background: #431e1e;
  border-radius: 20px;
  margin: 20px auto 0;
  padding: 16px;
  width: 100%;
  max-width: 1000px;
}

#whiteboard {
  background-image: radial-gradient(circle farthest-side at 50% -20%,rgb(255 255 255 / 72%),#d7d7d7 78%);
  border-radius: 8px;
  display: block;
  width: 100%;
  font-family: Crayon;
}

/**************/
/* Ape button */
/**************/

.ape-button {
  position: relative;
  background: #ecd300;
  background: -webkit-radial-gradient( hsl(54, 100%, 50%), hsl(54, 100%, 40%) );
  background: -o-radial-gradient( hsl(54, 100%, 50%), hsl(54, 100%, 40%) );
  background: -moz-radial-gradient( hsl(54, 100%, 50%), hsl(54, 100%, 40%) );
  background: radial-gradient( hsl(54, 100%, 50%), hsl(54, 100%, 40%) );
  font-size: 3rem;
  text-shadow: 0 -1px 0 #c3af07;
  color: #3b5441;
  border: solid 1px hsl(54, 100%, 20%);
  border-radius: 100%;
  height: 120px;
  width: 120px;
  z-index: 4;
  outline: none;
  box-shadow: inset 0 1px 0 hsl(54, 100%, 50%),
    0 2px 0 hsl(54, 100%, 20%),
    0 3px 0 hsl(54, 100%, 18%),
    0 4px 0 hsl(54, 100%, 16%),
    0 5px 0 hsl(54, 100%, 14%),
    0 6px 0 hsl(54, 100%, 12%),
    0 7px 0 hsl(54, 100%, 10%),
    0 8px 0 hsl(54, 100%, 8%),
    0 9px 0 hsl(54, 100%, 6%);
}
  .ape-button:hover {
    background: -webkit-radial-gradient( hsl(54, 100%, 45%), hsl(54, 100%, 35%) );
  background: -o-radial-gradient( hsl(54, 100%, 45%), hsl(54, 100%, 35%) );
  background: -moz-radial-gradient( hsl(54, 100%, 45%), hsl(54, 100%, 35%) );
  background: radial-gradient( hsl(54, 100%, 45%), hsl(54, 100%, 35%) );
  }
  .ape-button:active {
    background: webkit-radial-gradient( hsl(54, 100%, 43%), hsl(54, 100%, 33%) );
  background: -o-radial-gradient( hsl(54, 100%, 43%), hsl(54, 100%, 33%) );
  background: -moz-radial-gradient( hsl(54, 100%, 43%), hsl(54, 100%, 33%) );
  background: radial-gradient( hsl(54, 100%, 43%), hsl(54, 100%, 33%) );
    top: 2px;
    box-shadow: inset 0 1px 0 hsl(54, 100%, 50%),
    0 2px 0 hsl(54, 100%, 20%),
    0 3px 0 hsl(54, 100%, 18%),
    0 4px 0 hsl(54, 100%, 16%),
    0 5px 0 hsl(54, 100%, 14%),
    0 6px 0 hsl(54, 100%, 12%),
    0 7px 0 hsl(54, 100%, 10%);
  }



.v-card {
  background: #181D26;
  border-radius: 15px !important;
  width: 100%;
  color: #B3B8C1 !important;
  padding: 5px 30px;
  font-family: Roboto;
}
.v-select {
  border-radius: 8px;
}
.v-text-field {
  border-radius: 8px;
}
.v-select-list.v-sheet {
  background: #000000;
  font-family: Roboto;
  border-radius: 8px;
}

.padswap-content-sheet {
  width: 100%;
  background: transparent;
}
.padswap-ecosystem-subheader {
  font-size: 14px;
  color: #B3B8C1;
  margin-top: 4px;
  margin-bottom: 50px;
  height: auto;
}
.padswap-ecosystem-tabs /deep/ .v-tabs-bar {
  background: rgba(24, 29, 38, 0.7);
}
.padswap-ecosystem-tabs /deep/ .v-tabs-slider-wrapper {
  background: linear-gradient(180deg, #F99DF3 0%, #FA77F1 100%);
}
.padswap-ecosystem-tabs .v-tab {
  padding: 10px 0px;
  font-weight: bold;
  color: #FFFFFF;
  min-width: 110px;
}
.padswap-ecosystem-tabs .v-tab--active {
  color: #66015e !important;
}

.padswap-farm-type-tabs {
  width: 270px;
  max-width: 270px;
}
.padswap-farm-type-tabs /deep/ .v-tabs-bar {
  background: #292D38;
}
.padswap-farm-type-tabs .v-tab {
  color: #879CA5 !important;
  max-width: 90px;
}
.padswap-farm-type-tabs .v-tab--active {
  color: #181D26 !important;
}

.padswap-header-box {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.padswap-farm-title {
  font-family: Roboto Mono;
  color: #FB53EF;
  font-size: 16px;
}
.padswap-farm-title-shadow {
  text-shadow: 0px 0px 4px rgba(250, 64, 237, 0.5);
}
.v-card.padswap-farms {
  background: rgba(255, 255, 255, 0.05);
}

.padswap-data-title {
  font-size: 12px;
  color: #71767F;
}
.padswap-data-item {
  font-size: 24px;
  color: #FFFFFF;
}

.v-text-field /deep/ .v-icon {
  opacity: 0.5;
}


/*******************************/
/* Dashboard content container */
/*******************************/

.main-container {
	text-align: center;
}

.content-container {
	display: inline-block;
	max-width: 1200px;
	text-align: left;
	background-image: radial-gradient(circle farthest-side at 50% -20%,rgb(17 95 13 / 35%),#101722 78%);
	padding: 20px;
	border-radius: 20px;
}

/*****************/
/* Content boxes */
/*****************/

.header-box {
	text-align: center;
	margin-top: 50px;
	margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: center;
}

.header-img-container {
	display: inline-block;
  width: 100%;
  text-align:;
	padding-left: 40px;
	padding-right: 30px;
	/*background-color: #84848466;*/
	/*border-radius: 20px;*/
	/*border: 1px solid #ffffff2e;*/
}

.header-img-container div {
  display: inline-block;
}

.rounded-box {
	background-color: #182326a3;
	padding: 20px;
	border-radius: 20px;
	/*border: 1px solid #ffffff2e;*/
}

.inner-rounded-box {
	background-color: #181d26;
	padding: 20px;
	border-radius: 10px;
	border: 1px solid #ffffff0f;
}

/***********************/
/* Informational links */
/***********************/

.info-link {
	display: inline-block;
	width: 100%;
	padding-top: 7px;
	text-align: center;
	color: white;
}
.info-link a {
	color: white;
}
.info-link a:hover {
	color: orange;
}


/****************************/
/* Get started with farming */
/****************************/

.tutorial-item-container {
	padding-top: 20px;
	padding-left: 20px;
	padding-right: 20px;
}

.tutorial-item {
	text-decoration: none;
	color: white;
}

.tutorial-item p {
	margin-top: 5px;
}

.tutorial-item .rounded-icon {
	padding: 40px;
	border-radius: 20%;
	border: 2px dashed rgba(255, 255, 255, 0.2);
}

/* Hover effect */
.tutorial-item:hover {
	color: orange;
}
.tutorial-item:hover .rounded-icon {
	border: 2px dashed orange;
}
.tutorial-item:hover .rounded-icon {
	border: 2px dashed orange;
	color: orange;
}

/****************/
/* Product list */
/****************/

.product-description {
	color: gray;
}


.padswap-farm-btn {
  border-radius: 100px;
  background: linear-gradient(180deg, #00FC4c 0%, #00D741 100%);
  color: #00310F;
  width: 220px;
  text-transform: none;
  font-size: 16px;
  font-weight: bold;
  font-family: Roboto Mono;
}
.padswap-farm-btn:hover {
  background: linear-gradient(180deg, #76ae88 0%, #1e843d 100%);
}

</style>
