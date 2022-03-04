import { ABI_SKYBRIDGE, ABI_SKYBRIDGE_V2, ABI_TOKEN } from './abis';

export const CONTRACTS = {
  coins: {
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
        address: '0x179d9a39841cf3ad6a69648b6e45b11158fde79d',
        abi: ABI_TOKEN,
      },
      production: {
        address: '0x22883a3dB06737eCe21F479A8009B8B9f22b6cC9',
        abi: ABI_TOKEN,
      },
    },
    WBTC: {
      test: {
        address: '0x7cb2eac36b4bb7c36640f32e806d33e474d1d427',
        abi: ABI_TOKEN,
      },
      production: {
        address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        abi: ABI_TOKEN,
      },
    },
  },
  bridges: {
    btc_erc: {
      test: {
        address: '0x7dfbf7E38F188Da1BD337A128ce7A5D758957621',
        abi: ABI_SKYBRIDGE_V2,
      },
      production: {
        address: '0xbe83f11d3900F3a13d8D12fB62F5e85646cDA45e',
        abi: ABI_SKYBRIDGE,
      },
    },
  },
} as const;
