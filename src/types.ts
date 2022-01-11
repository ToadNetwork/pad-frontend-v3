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
    rewardToken: string | undefined,
    type: FarmType | undefined,
    poolSize: number | undefined,
    poolValue: number | undefined,
    tvl: number | undefined,
    farmTotalSupply: number | undefined,
    pairTotalSupply: number | undefined,
    mintShare: number | undefined,
    lpPrice: number | undefined, // token price for single-stake farms
    rewardTokenPrice: number | undefined,
    roi: number | undefined,
    apy: number | undefined,
    userLpBalance: ethers.BigNumber | undefined,
    userStakedBalance: ethers.BigNumber | undefined,
    userRewardsBalance: number | undefined,
    userAllowance: number | undefined
  }

export type FarmSet = {
    regularFarms: { farms: FarmData[], retiredFarms: FarmData[] },
    lpFarms: { farms: FarmData[] },
    partnerFarms: { farms: FarmData[] }
}