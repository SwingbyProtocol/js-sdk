import type { AbiItem } from 'web3-utils';

import WBTC_ABI from './wbtc-abi.json';
import SBBTC_ABI from './sbbtc-abi.json';
import BTC_ERC_ABI from './btc_erc-abi.json';
import BTC_SKYPOOL_ABI from './btc_skypool-abi.json';
import ABI_SKYBRIDGE from './btc_skybridge-abi.json';

const WBTC = {
  test: {
    address: '0x7cb2eac36b4bb7c36640f32e806d33e474d1d427',
    abi: WBTC_ABI as AbiItem[],
  },
  production: {
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    abi: WBTC_ABI as AbiItem[],
  },
};

export const CONTRACTS = {
  coins: {
    BTC: {
      test: {
        address: '0x0000000000000000000000000000000000000000',
        abi: [] as AbiItem[],
      },
      production: {
        address: '0x0000000000000000000000000000000000000000',
        abi: [] as AbiItem[],
      },
    },
    sbBTC: {
      test: {
        address: '0x179d9a39841cf3ad6a69648b6e45b11158fde79d',
        abi: SBBTC_ABI as AbiItem[],
      },
      production: {
        address: '0x22883a3dB06737eCe21F479A8009B8B9f22b6cC9',
        abi: SBBTC_ABI as AbiItem[],
      },
    },
    'sbBTC.SKYPOOL': {
      test: {
        address: '',
        abi: SBBTC_ABI as AbiItem[],
      },
      production: {
        address: '0x44a62c7121a64691b61aef669f21c628258e7d52',
        abi: SBBTC_ABI as AbiItem[],
      },
    },
    WBTC,
    'WBTC.SKYPOOL': WBTC,
  },
  bridges: {
    btc_erc: {
      test: {
        address: '0x7dfbf7E38F188Da1BD337A128ce7A5D758957621',
        abi: BTC_ERC_ABI as AbiItem[],
      },
      production: {
        address: '0xbe83f11d3900F3a13d8D12fB62F5e85646cDA45e',
        abi: BTC_ERC_ABI as AbiItem[],
      },
    },
    btc_skypool: {
      test: {
        address: '',
        abi: BTC_SKYPOOL_ABI as AbiItem[],
      },
      production: {
        address: '0x4A084C0D1f89793Bb57f49b97c4e3a24cA539aAA',
        abi: BTC_SKYPOOL_ABI as AbiItem[],
      },
    },
    btc_bep20: {
      test: {
        address: '0xC217994720062d2E8340852c58DfFcDbB66bbfA3',
        abi: ABI_SKYBRIDGE,
      },
      production: {
        address: '0xad22900062e4cd766102a1f33e530f5303fe1adf',
        abi: ABI_SKYBRIDGE,
      },
    },
  },
} as const;
