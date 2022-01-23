import { ethers } from 'ethers'

export enum FarmType {
    Regular,
    LP,
    Partner
}

// TODO: store all numbers as ethers.BigNumber
export type FarmData = {
    name: string,
    contract: string,
    acceptedToken: string,
    token1: string,
    token2: string,
    rewardToken?: string,
    type?: FarmType,
    isImported?: boolean,
    tokenLogoUrls?: Record<string, string>,
    poolSize?: number,
    poolValue?: number,
    tvl?: number,
    farmTotalSupply?: number,
    pairTotalSupply?: number,
    mintShare?: number,
    lpPrice?: number, // token price for single-stake farms
    rewardTokenPrice?: number,
    roi?: number,
    apy?: number,
    userLpBalance?: ethers.BigNumber,
    userStakedBalance?: ethers.BigNumber,
    userRewardsBalance?: number,
    userAllowance?: number
  }

export type FarmSet = {
    regularFarms: { farms: FarmData[], retiredFarms: FarmData[] },
    lpFarms: { farms: FarmData[] },
    partnerFarms: { farms: FarmData[] }
}