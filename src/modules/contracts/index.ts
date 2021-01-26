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
      address: '0x1DF6c00941Cb0898bc77F423DACBD23ABB77F8A5',
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
      address: '0xFba4a3612C0dF10b9bF694B2133aD4f038462191',
      abi: ABI_SKYBRIDGE,
    },
    production: {
      address: '0x0fc2c6513ffc15d92a7593cede8b44cec3d85122',
      abi: ABI_SKYBRIDGE,
    },
  },
} as const;
