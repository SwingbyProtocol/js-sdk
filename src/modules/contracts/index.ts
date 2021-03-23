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
      address: '0x9f8ff0acc3a9aded2a06d80aa12c34941268da87',
      abi: ABI_TOKEN,
    },
    production: {
      address: '0x22883a3dB06737eCe21F479A8009B8B9f22b6cC9',
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
      address: '0x898b357381a2a6f56e21218763d12eee92cb69ed',
      abi: ABI_SKYBRIDGE,
    },
    production: {
      address: '0xbe83f11d3900F3a13d8D12fB62F5e85646cDA45e',
      abi: ABI_SKYBRIDGE,
    },
  },
} as const;
