<template>
	<div class="main-container">
		<div class="content-container">

			<!------------------->
			<!-- PadSwap logo --->
			<!------------------->

			<div class="header-box">
				<div class="header-img-container">
					<v-img
					:src="$padswapTheme.theme.headerLogoSrc"
					contain
					height="150px"
					width="500px"
					/>
				</div>
			</div>



			<!-------------------------------->
			<!-- Get started with farming ---->
			<!-------------------------------->

			<v-row style="padding-top: 20px; padding-bottom: 20px;">

				<v-col
				cols="12">
					<div class="rounded-box">
						<p class="text-center">Get started with farming</p>
						<div class="inner-rounded-box">
							<v-row class="text-center"
							align="center"
							justify="center">
								<div class="tutorial-item-container">
									<a
									class="tutorial-item"
									href="/onramp"
									target="_blank"
									>
										<v-icon class="rounded-icon">mdi-cash-multiple</v-icon>
										<p>Buy BNB tokens<br>with fiat</p>
									</a>
								</div>

								<v-icon>mdi-arrow-right</v-icon>

								<div class="tutorial-item-container">
									<a
									class="tutorial-item"
									href="https://padswap.exchange/#/swap"
									target="_blank"
									>
									<v-icon class="rounded-icon">mdi-swap-horizontal</v-icon>
									<p>Swap BNB for tokens<br>of your choice</p>
								</a>
								</div>

								<v-icon>mdi-arrow-right</v-icon>

								<div class="tutorial-item-container">
									<a
									class="tutorial-item"
									href="https://padswap.exchange/#/pool"
									target="_blank"
									>
										<v-icon class="rounded-icon">mdi-vector-link</v-icon>
										<p>Create a<br>liquidity pair</p>
									</a>
								</div>

								<v-icon>mdi-arrow-right</v-icon>

								<div class="tutorial-item-container">
									<a
									class="tutorial-item"
									href="https://dapps.padswap.exchange/"
									target="_blank"
									>
										<v-icon class="rounded-icon">mdi-sprout-outline</v-icon>
										<p>Stake LP tokens<br> in a farm</p>
									</a>
								</div>

							</v-row>
						</div>

						<div class="info-link">
							Don't have a BNB wallet? Here's <a href="https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain" target="_blank">Binance's official guide for setting up Metamask </a>
							<v-icon small>mdi-open-in-new</v-icon>
						</div>

					</div>
				</v-col>

			</v-row>

			<!--------------------->
			<!-- Stats sections --->
			<!--------------------->

			<v-row
			style="padding-top: 20px; padding-bottom: 20px;"
			align="center"
			justify="center">

				<v-col
				cols="5">
					<div class="rounded-box">
						<p class="text-center">PAD backing</p>
						<div class="inner-rounded-box">
							<h1 class="text-center">20.43%</h1>
						</div>
						<div class="info-link">
							<a href="https://dapps.padswap.exchange/vault/" target="_blank">View vault details </a>
							<v-icon small>mdi-open-in-new</v-icon>
						</div>
					</div>
				</v-col>

				<v-col
				cols="2">
					<v-img
					:src="$padswapTheme.theme.toadPadImageSrc"
					contain
					height="105"
					width="100%"
					/>
				</v-col>

				<v-col
				cols="5">
					<div class="rounded-box">
						<p class="text-center">24H volume</p>
						<div class="inner-rounded-box">
							<h1 class="text-center">$420.69B</h1>
						</div>
						<div class="info-link">
							<a href="https://info.padswap.exchange/" target="_blank">View PadSwap stats </a>
							<v-icon small>mdi-open-in-new</v-icon>
						</div>
					</div>
				</v-col>
			
			</v-row>

			<!------------------->
			<!-- Product list --->
			<!------------------->

			<!-- Products for users -->
			<v-row style="padding-top: 20px; padding-bottom: 20px;">

				<v-col
				cols="6">
				<div class="rounded-box">
					<p class="text-center">For users</p>
						<v-list class="inner-rounded-box">
							<v-list-item
							v-for="item in productsForUsers"
							:href="item.href"
							:target="item.target"
							>
								<v-list-item-content>
									<div class="product-title">
										<v-icon style="margin-right: 10px">{{ item.icon }}</v-icon>
										{{ item.title }}
									</div>
									<div class="product-description">{{ item.description }}</div>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</div>
				</v-col>

				<!-- Products for projects -->
				<v-col
				cols="6">
					<div class="rounded-box">
						<p class="text-center">For projects</p>
						<v-list class="inner-rounded-box">
							<v-list-item
							v-for="item in productsForProjects"
							:href="item.href"
							:target="item.target"
							>
								<v-list-item-content>
									<div class="product-title">
										<v-icon style="margin-right: 10px">{{ item.icon }}</v-icon>
										{{ item.title }}
									</div>
									<div class="product-description">{{ item.description }}</div>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</div>
				</v-col>

			</v-row>

		</div>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				productsForUsers: [
				{
					title: 'Swap',
					icon: 'mdi-swap-horizontal',
					active: true,
					description: 'Buy or sell any token instantly',
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
				{
					title: 'LaunchPad presales',
					icon: 'mdi-rocket-launch',
					description: 'Buy upcoming tokens before they are launched',
					href: 'https://dapps.padswap.exchange/launchpad',
					target: '_blank'
				},
				{
					title: 'Bridge',
					icon: 'mdi-bridge',
					description: 'Move tokens between chains',
					href: 'https://dapps.padswap.exchange/bridge',
					target: '_blank'
				},
				{
					title: 'Auctions',
					icon: 'mdi-hand-coin-outline',
					description: 'Get auctioned tokens at better prices',
					href: '',
					target: '_blank'
				}
				],
				productsForProjects: [
				{
					title: 'Provide liquidity',
					icon: 'mdi-swap-horizontal',
					active: true,
					description: 'Make your token trade-able on PadSwap, earn some of the highest LP rewards among DEXes',
					href: 'https://padswap.exchange/#/pool',
					target: '_blank'
				},
				{
					title: 'LaunchPad',
					icon: 'mdi-rocket-launch',
					description: 'Launch your own token in a few clicks, no coding knowledge required',
					href: 'https://dapps.padswap.exchange/launchpad',
					target: '_blank'
				},
				{
					title: 'Auctions',
					icon: 'mdi-hand-coin-outline',
					description: 'Continuously raise liquidity for your project',
					href: '',
					target: '_blank'
				}
				]
			}
		}
	}
</script>

<style scoped>

* {
	font-family: roboto;
}

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
	padding: 20px;
	border-radius: 50%;
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

.product-title {

}

.product-description {
	color: gray;
}

</style>
