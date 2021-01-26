import { ABI_SKYBRIDGE, ABI_TOKEN } from './abis';

export const CONTRACTS = {
  BTC: {
    test: {
      address: '0x0000000000000000000000000000000000000000',
      abi: [],
    },
    production: {
      address: '0x0000000000000000000000000000000000000000',
      abi: [],
    },
  },
  sbBTC: {
    test: {
      address: '0xBb927C63B8bf1F05c0ecb2c5B1fBEa740e62FFaC',
      abi: ABI_TOKEN,
    },
    production: {
      address: '0xefcf527fdd2084de2ac9ba34463be4a245b45efa',
      abi: ABI_TOKEN,
    },
  },
  WBTC: {
    test: {
      address: '0xeb47a21c1fc00d1e863019906df1771b80dbe182',
      abi: ABI_TOKEN,
    },
    production: {
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      abi: ABI_TOKEN,
    },
  },
  skybridge: {
    test: {
      address: '0x0FaA2F31BeEb7a95d2Fa61988D76c0D6Bbc66C2f',
      abi: ABI_SKYBRIDGE,
    },
    production: {
      address: '0x0fc2c6513ffc15d92a7593cede8b44cec3d85122',
      abi: ABI_SKYBRIDGE,
    },
  },
} as const;
