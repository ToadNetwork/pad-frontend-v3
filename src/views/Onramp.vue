<template>
	<div style="text-align: center">
	<div style="display: inline-block; text-align: left;">

		<!------------------->
		<!-- PadSwap logo --->
		<!------------------->

		<div class="header-box">
			<div class="header-img-container">
			<v-img
        	:src="$padswapTheme.theme.toadPadImageSrc"
        	contain
        	height="105"
        	width="100%"
      		/>
			</div>
			<h1>Buy BNB/BUSD with fiat</h1>
		</div>

		<!--------------------->
		<!-- Onramper widget -->
		<!--------------------->

		<v-row
		style="padding-top: 20px; padding-bottom: 20px; max-width: 1200px;"
		align="center"
		justify="center">
			<v-col
			cols="12">
				<div class="rounded-box">
					<div class="onramper-container">
						<div class="onramper">
							<iframe
							width="100%"
							height="100%"
							id="onramper-widget"
							title="Onramper widget"
							frameborder="no"
							allow="accelerometer; autoplay; camera; gyroscope; payment;"
							src="https://widget.onramper.com?color=266678
							&apiKey=pk_prod_rZrnwLh6B5Ah9zaKFRS4uKTPFB1MtUcjGXrzNPuDoLE0
							&defaultCrypto=BNB_BEP20
							&defaultFiat=USD
							&defaultAmount=50
							&onlyCryptos=BNB_BEP20,BUSD_BEP20
							&onlyGateways=Moonpay,Wyre">
							</iframe>
						</div>
					</div>
				<div class="info-link">
					Fiat onramping is provided by Onramper.<br>
					In case of any questions, please contact <a href="https://onramper.com/about/" target="_blank">Onramper support </a>
					<v-icon small style="color: #9b9b9b;">mdi-open-in-new</v-icon>
				</div>
				</div>
			</v-col>

		</v-row>

		<BackToDashboard style="padding-bottom: 300px;"/>

	</div>
	</div>
</template>


<script>
	import BackToDashboard from '@/components/BackToDashboard.vue'

	export default {
  	components: { BackToDashboard },
		data () {
			return {
				whatsNext: [
				{
					title: 'Swap',
					icon: 'mdi-swap-horizontal',
					active: true,
					description: 'Exchange any tokens instantly',
					href: 'https://padswap.exchange/#/swap',
					target: '_blank'
				},
				{
					title: 'Farms',
					icon: 'mdi-sprout',
					description: 'Earn passive income by staking liquidity',
					href: 'https://dapps.padswap.exchange/',
					target: '_blank'
				},
				// {
				// 	title: 'LaunchPad presales',
				// 	icon: 'mdi-rocket-launch',
				// 	description: 'Buy upcoming tokens before they are launched',
				// 	href: 'https://dapps.padswap.exchange/launchpad',
				// 	target: '_blank'
				// },
				{
					title: 'Bridge',
					icon: 'mdi-bridge',
					description: 'Move tokens between chains',
					href: 'https://dapps.padswap.exchange/bridge',
					target: '_blank'
				},
				// {
				// 	title: 'Auctions',
				// 	icon: 'mdi-hand-coin-outline',
				// 	description: 'Get auctioned tokens at better prices',
				// 	href: '',
				// 	target: '_blank'
				// }
				],
			}
		}
	}
</script>

<style scoped>

/*****************/
/* Content boxes */
/*****************/

.header-box {
	text-align: center;
	margin-top: 50px;
	margin-bottom: 50px;
}

.header-img-container {
	display: inline-block;
	padding-left: 40px;
	padding-right: 30px;
	/*background-color: #84848466;*/
	/*border-radius: 20px;*/
	/*border: 1px solid #ffffff2e;*/
}

.rounded-box {
	background-color: rgba(20, 20, 20, 0.8);
	padding: 20px;
	border-radius: 20px;
	/*border: 1px solid #ffffff2e;*/
}

.inner-rounded-box {
	background-color: rgb(53 53 53 / 15%);
	padding: 20px;
	border-radius: 10px;
	border: 1px solid #ffffff0f;
}

/*******************/
/* Onramper widget */
/*******************/

.onramper-container {
	display: flex;
	width: 100%;
	height: 700px;
	flex-direction: column;
	overflow: hidden;
	border-radius: 10px;
}
.onramper {
	flex-grow: 1;
	border: none;
	margin: 0;
	padding: 0;
	width: 100%;
}
.onramper iframe {
	display: block;
	height: 100%;
	width: 100%;
	border: none;
}


/***********************/
/* Informational links */
/***********************/

.info-link {
	margin-top: 10px;
	display: inline-block;
	width: 100%;
	padding-top: 7px;
	text-align: center;
	color: #9b9b9b;
}
.info-link a {
	color: #9b9b9b;
}
.info-link a:hover {
	color: orange;
}

/****************/
/* Product list */
/****************/

.product-title {

}

.product-description {
	color: gray;
}

</style>
