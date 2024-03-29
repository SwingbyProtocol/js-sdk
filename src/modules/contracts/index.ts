import type { AbiItem } from 'web3-utils';

import WBTC_ABI from './wbtc-abi.json';
import SBBTC_ABI from './sbbtc-abi.json';
import BTC_ERC_ABI from './btc_erc-abi.json';
import BTC_SKYPOOL_ABI from './btc_skypool-abi.json';
import SWINGBY_SWAP_REWARDS_ABI from './swingby-swap-rewards-abi.json';

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
        address: '0x679199877E56b8E68Fdb1dDaE122E843EcAcA268',
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
        address: '0x92c95b6227a9f0B4602649BD83F83aDC48dae903',
        abi: BTC_SKYPOOL_ABI as AbiItem[],
      },
    },
  },
  swap: {
    rewards: {
      test: {
        address: '', // TODO: need change
        abi: SWINGBY_SWAP_REWARDS_ABI as AbiItem[],
      },
      production: {
        address: '0x2a3040d8b2a4ea8d3c36c04ae2affb9c5a8e856d',
        abi: SWINGBY_SWAP_REWARDS_ABI as AbiItem[],
      },
    },
  },
} as const;
