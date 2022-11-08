export const WHITELIST = {

	// BSC whitelist
	56: [
		{
			address: 'eth',
			symbol: 'BNB',
			name: 'Binance Token',
			description: 'Native token of Binance Smart Chain'
		},
		{
			address: '0x463E737D8F740395ABf44f7aac2D9531D8D539E9',
			symbol: 'TOAD',
			name: 'TOAD Network',
			description: 'PadSwap governance token'
		},
		{
			address: '0xC0888d80EE0AbF84563168b3182650c0AdDEb6d5',
			symbol: 'PAD',
			name: 'Lily PAD',
			description: 'PadSwap farm reward token'
		}
	],


	// Moonbeam whitelist
	1284: [
		{
			address: 'eth',
			symbol: 'GLMR',
			name: 'Glimmer Token',
			description: 'Native token of Moonbeam Chain'
		},
		{
			address: '0xF480f38C366dAaC4305dC484b2Ad7a496FF00CeA',
			symbol: 'TOAD',
			name: 'TOAD Network',
			description: 'PadSwap governance token'
		},
		{
			address: '0x59193512877E2EC3bB27C178A8888Cfac62FB32D',
			symbol: 'PAD',
			name: 'Lily PAD',
			description: 'PadSwap farm reward token'
		}
	],


	// Moonriver whitelist
	1285: [
		{
			address: 'eth',
			symbol: 'MOVR',
			name: 'Moonriver Token',
			description: 'Native token of Moonriver Chain'
		},
		{
			address: '0x165DBb08de0476271714952C3C1F068693bd60D7',
			symbol: 'TOAD',
			name: 'TOAD Network',
			description: 'PadSwap governance token'
		},
		{
			address: '0x45488C50184Ce2092756ba7CdF85731fD17e6f3d',
			symbol: 'PAD',
			name: 'Lily PAD',
			description: 'PadSwap farm reward token'
		},
		{
			address: '0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D',
			symbol: 'USDC',
			name: 'Multichain USDC',
			description: 'USDC stablecoin, bridged through Multichain bridge'
		}
	]

}



// Default trades that will initially show up on the swap page
export const DEFAULT_SWAP_ROUTES = {
	// BSC
	56: {
		inputToken: {
			address: 'eth',
			symbol: 'BNB',
			name: 'Binance Token',
			description: 'Native token of Binance Smart Chain'
		},
		outputToken: {
			address: '0x463E737D8F740395ABf44f7aac2D9531D8D539E9',
			symbol: 'TOAD',
			name: 'TOAD Network',
			description: 'PadSwap governance token'
		}
	},


	// Moonbeam
	1284: {
		inputToken: {
			address: 'eth',
			symbol: 'GLMR',
			name: 'Glimmer Token',
			description: 'Native token of Moonbeam Chain'
		},
		outputToken: {
			address: '0xF480f38C366dAaC4305dC484b2Ad7a496FF00CeA',
			symbol: 'TOAD',
			name: 'TOAD Network',
			description: 'PadSwap governance token'
		}
	},


	// Moonriver
	1285: {
		inputToken: {
			address: 'eth',
			symbol: 'MOVR',
			name: 'Moonriver Token',
			description: 'Native token of Moonriver Chain'
		},
		outputToken: {
			address: '0x165DBb08de0476271714952C3C1F068693bd60D7',
			symbol: 'TOAD',
			name: 'TOAD Network',
			description: 'PadSwap governance token'
		}
	}
}
