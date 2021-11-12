import { ABI_SKYBRIDGE, ABI_SKYPOOLS, ABI_TOKEN } from './abis';

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
        address: '0x6ce6ea7D58EB83a270DD05d7383EDF919CEc3101',
        abi: ABI_TOKEN,
      },
      production: {
        address: '0x22883a3dB06737eCe21F479A8009B8B9f22b6cC9',
        abi: ABI_TOKEN,
      },
    },
    WBTC: {
      test: {
        address: '0x442be68395613bdcd19778e761f03261ec46c06d',
        abi: ABI_TOKEN,
      },
      production: {
        address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        abi: ABI_TOKEN,
      },
    },
    'sbBTC.BEP20': {
      test: {
        address: '0x89B16adb7A48a3A7b69f3C741baFCe7D00f98794',
        abi: ABI_TOKEN,
      },
      production: {
        address: '0xdBa68BeF9b541999Fd9650FF72C19d5E1ceeCd10',
        abi: ABI_TOKEN,
      },
    },
    'BTCB.BEP20': {
      test: {
        address: '0xa88921dc290f888b5ee574cf2cd1599f412f1534',
        abi: ABI_TOKEN,
      },
      production: {
        address: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
        abi: ABI_TOKEN,
      },
    },
  },
  bridges: {
    btc_erc: {
      test: {
        address: '0x42da142C8FAfA8C31701973607990B6d5e92118f',
        abi: ABI_SKYPOOLS,
      },
      production: {
        address: '0xbe83f11d3900F3a13d8D12fB62F5e85646cDA45e',
        abi: ABI_SKYBRIDGE,
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
