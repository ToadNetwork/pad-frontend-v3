import { ethers } from 'ethers'

import { MULTICALL_ADDRESS, BSC_MINTER_ADDRESS, MOVR_MINTER_ADDRESS } from '@/constants'
import farmsBsc from '@/farms_config_bsc.json'
import farmsMoonriver from '@/farms_config_movr.json'
import { IPadswapTheme, BscPadswapTheme, MoonriverPadswapTheme } from '@/padswap-theme'
import {
    PriceModel,
    BSC_WHITELIST,
    MOVR_WHITELIST,
    WBNB_BUSD_PAIR,
    WMOVR_USDC_PAIR,
    MINIMUM_LIQUIDITY_BNB,
    MINIMUM_LIQUIDITY_MOVR
} from '@/price-model'
import { FarmSet } from '@/types'

type ChainId = 56 | 1285

enum EcosystemId {
    BSC = 0,
    Moonriver = 1
}

interface IEcosystem {
    ecosystemId: EcosystemId
    chainId: ChainId
    ethName: string
    wethAddress: string
    dataseed: ethers.providers.Provider
    multicallAddress: string
    farmSet: FarmSet,
    factoryAddress: string,
    padAddress: string,
    minterAddress: string,
    priceModel: PriceModel,
    theme: IPadswapTheme
    swapUrl: string
    bridgeUrl: string
    infoUrl: string
    tokenIconsFolder: string
}

const bscDataseed = new ethers.providers.StaticJsonRpcProvider('https://bsc-dataseed1.defibit.io/')
const wbnbAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
const bscFactoryAddress = '0xB836017ACf10b8A7c6c6C9e99eFE0f5B0250FC45'
const BscEcosystem: IEcosystem = {
    ecosystemId: EcosystemId.BSC,
    chainId: 56,
    ethName: 'BNB',
    wethAddress: wbnbAddress,
    dataseed: bscDataseed,
    multicallAddress: MULTICALL_ADDRESS,
    farmSet: farmsBsc as any,
    factoryAddress: bscFactoryAddress,
    padAddress: '0xC0888d80EE0AbF84563168b3182650c0AdDEb6d5',
    minterAddress: BSC_MINTER_ADDRESS,
    priceModel: new PriceModel(bscDataseed, BSC_WHITELIST, wbnbAddress, WBNB_BUSD_PAIR, bscFactoryAddress, MINIMUM_LIQUIDITY_BNB, 18),
    theme: BscPadswapTheme,
    swapUrl: 'https://padswap.exchange/#/swap',
    bridgeUrl: 'https://v2.padswap.exchange/bridge',
    infoUrl: 'https://info.padswap.exchange/home',
    tokenIconsFolder: 'bsc'
}

const moonriverDataseed = new ethers.providers.StaticJsonRpcProvider('https://rpc.moonriver.moonbeam.network')
const wmovrAddress = '0x663a07a2648296f1A3C02EE86A126fE1407888E5'
const moonriverFactoryAddress = '0x760d2Bdb232027aB3b1594405077F9a1b91C04c1'
const MoonriverEcosystem: IEcosystem = {
    ecosystemId: EcosystemId.Moonriver,
    chainId: 1285,
    ethName: 'MOVR',
    wethAddress: wmovrAddress,
    dataseed: moonriverDataseed,
    multicallAddress: MULTICALL_ADDRESS,
    farmSet: farmsMoonriver as any,
    factoryAddress: moonriverFactoryAddress,
    padAddress: '0x45488C50184Ce2092756ba7CdF85731fD17e6f3d',
    minterAddress: MOVR_MINTER_ADDRESS,
    priceModel: new PriceModel(moonriverDataseed, MOVR_WHITELIST, wmovrAddress, WMOVR_USDC_PAIR, moonriverFactoryAddress, MINIMUM_LIQUIDITY_MOVR, 6),
    theme: MoonriverPadswapTheme,
    swapUrl: 'https://movr.padswap.exchange/#/swap',
    bridgeUrl: 'https://v2.padswap.exchange/bridge',
    infoUrl: 'https://movr-info.padswap.exchange/home',
    tokenIconsFolder: 'moonriver'
}

const ECOSYSTEMS: Record<EcosystemId, IEcosystem> = {
    [EcosystemId.BSC]: BscEcosystem,
    [EcosystemId.Moonriver]: MoonriverEcosystem
}

export {
    EcosystemId,
    IEcosystem,
    ChainId,
    ECOSYSTEMS
}