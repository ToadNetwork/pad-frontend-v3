//
// Whitelist of tokens that can be used for routing a transaction when swapping tokens.
// Keeping this list relatively small will make computing a route much faster.
//

export const ROUTING_WHITELIST = {

	// BSC whitelist
	56: [
		{
			name: 'TOAD Network',
			symbol: 'TOAD',
			address: '0x463E737D8F740395ABf44f7aac2D9531D8D539E9',
			description: 'PadSwap governance token'
		},
		{
			name: 'Lily PAD',
			symbol: 'PAD',
			address: '0xC0888d80EE0AbF84563168b3182650c0AdDEb6d5',
			description: 'PadSwap farm reward token'
		},
    {
      name: 'BUSD Token',
      symbol: 'BUSD',
      address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      description: 'Binance\'s Stablecoin'
  	},
    {
      name: 'Ethereum Token',
      symbol: 'ETH',
      address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
      description: 'Binance-wrapped Ethereum token'
    },
    {
      name: 'BTCB Token',
      symbol: 'BTCB',
      address: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
      description: 'Binance-wrapped Bitcoin'
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      description: 'Binance-wrapped USDC stablecoin`'
    },
    {
      name: 'Tether USD',
      symbol: 'USDT',
      address: '0x55d398326f99059fF775485246999027B3197955',
      description: ''
    },
	],


	// Moonbeam whitelist
	1284: [
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
		},
    {
      name: "xEther",
      symbol: "xETH",
      address: "0x30D2a9F5FDf90ACe8c17952cbb4eE48a55D916A7",
      description: 'Ethereum token, bridged through Nomad'
    },
    {
      name: "anyEther",
      symbol: "anyETH",
      address: "0xfA9343C3897324496A05fC75abeD6bAC29f8A40f",
      description: 'Ethereum token, bridged through Multichain (aka Anyswap)'
    },
    {
      name: "Dai Stablecoin",
      symbol: "xDAI",
      address: "0xc234A67a4F840E61adE794be47de455361b52413",
      description: 'DAI Stablecoin, bridged through Nomad'
    },
    {
      name: "Tether USD",
      symbol: "xUSDT",
      address: "0x8e70cd5b4ff3f62659049e74b6649c6603a0e594",
      description: 'USDT Stablecoin, bridged through Nomad'
    },
    {
      name: "USD Coin",
      symbol: "xUSDC",
      address: "0x8f552a71EFE5eeFc207Bf75485b356A0b3f01eC9",
      description: 'USDC Stablecoin, bridged through Nomad'
    },
    {
      name: "USD Coin",
      symbol: "anyUSDC",
      address: "0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b",
      description: 'USDC Stablecoin, bridged through Multichain (aka Anyswap)'
    },
    {
      name: "Binance Coin",
      symbol: "anyBNB",
      address: "0xc9BAA8cfdDe8E328787E29b4B078abf2DaDc2055",
      description: 'BNB token, bridged through Multichain (aka Anyswap)'
    },
    {
      name: "BUSD",
      symbol: "anyBUSD",
      address: "0xA649325Aa7C5093d12D6F98EB4378deAe68CE23F",
      description: 'BUSD Stablecoin, bridged through Multichain (aka Anyswap)'
    },
    {
      name: "Avalanche",
      symbol: "anyAVAX",
      address: "0x4792C1EcB969B036eb51330c63bD27899A13D84e",
      description: ''
    }
	],


	// Moonriver whitelist
	1285: [
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
		},
    {
      name: "Binance USD",
      symbol: "BUSD",
      address: "0x5D9ab5522c64E1F6ef5e3627ECCc093f56167818",
      description: 'BUSD Stablecoin, bridged through Multichain bridge'
    },
    {
      name: "Tether USD",
      symbol: "USDT",
      address: "0xB44a9B6905aF7c801311e8F4E76932ee959c663C",
      description: 'USDT Stablecoin, bridged through Multichain bridge'
    },
    {
      name: "DAI Stablecoin",
      symbol: "DAI",
      address: "0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844",
      description: 'DAI token, bridged through Multichain bridge'
    },
    {
      name: "Magic Internet Money",
      symbol: "MIM",
      address: "0x0caE51e1032e8461f4806e26332c030E34De3aDb",
      description: 'MIM token, bridged through Multichain bridge'
    },
    {
      name: "Binance Coin",
      symbol: "BNB",
      address: "0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c",
      description: 'Native token of BSC, bridged through Multichain bridge'
    }
	]
}
