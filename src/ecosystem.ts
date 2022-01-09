import { ethers } from 'ethers'

import { MULTICALL_ADDRESS, BSC_MINTER_ADDRESS, MOVR_MINTER_ADDRESS } from '@/constants'
import farmsBsc from '@/farms_config_bsc.json'
import farmsMoonriver from '@/farms_config_movr.json'
import { IPadswapTheme, BscPadswapTheme, MoonriverPadswapTheme } from '@/padswap-theme'
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
    farmSet: FarmSet
    padAddress: string,
    minterAddress: string
    theme: IPadswapTheme
    swapUrl: string
    bridgeUrl: string
    infoUrl: string
    tokenIconsFolder: string
}

const BscEcosystem: IEcosystem = {
    ecosystemId: EcosystemId.BSC,
    chainId: 56,
    ethName: 'BNB',
    wethAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    dataseed: new ethers.providers.StaticJsonRpcProvider('https://bsc-dataseed1.defibit.io/'),
    multicallAddress: MULTICALL_ADDRESS,
    farmSet: farmsBsc as any,
    padAddress: '0xC0888d80EE0AbF84563168b3182650c0AdDEb6d5',
    minterAddress: BSC_MINTER_ADDRESS,
    theme: BscPadswapTheme,
    swapUrl: 'https://padswap.exchange/#/swap',
    bridgeUrl: 'https://dapps.padswap.exchange/bridge',
    infoUrl: 'https://info.padswap.exchange/home',
    tokenIconsFolder: 'bsc'
}

const MoonriverEcosystem: IEcosystem = {
    ecosystemId: EcosystemId.Moonriver,
    chainId: 1285,
    ethName: 'MOVR',
    wethAddress: '0x663a07a2648296f1A3C02EE86A126fE1407888E5',
    dataseed: new ethers.providers.StaticJsonRpcProvider('https://rpc.moonriver.moonbeam.network'),
    multicallAddress: MULTICALL_ADDRESS,
    farmSet: farmsMoonriver as any,
    padAddress: '0x45488C50184Ce2092756ba7CdF85731fD17e6f3d',
    minterAddress: MOVR_MINTER_ADDRESS,
    theme: MoonriverPadswapTheme,
    swapUrl: 'https://movr.padswap.exchange/#/swap',
    bridgeUrl: 'https://movr-dapps.padswap.exchange/bridge',
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