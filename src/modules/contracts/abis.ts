import type { AbiItem } from 'web3-utils';

export const ABI_TOKEN: AbiItem[] = [
  {
    constant: false,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    type: 'function',
  },
];

export const ABI_SKYBRIDGE: AbiItem[] = [
  {
    inputs: [],
    name: 'getCurrentPriceLP',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    type: 'function',
    constant: false,
    payable: false,
  },
  {
    inputs: [
      {
        name: '_token',
        type: 'address',
      },
      {
        name: '_user',
        type: 'address',
      },
    ],
    name: 'getFloatBalanceOf',
    outputs: [
      {
        name: 'floatBalanceOf',
        type: 'uint256',
      },
    ],
    type: 'function',
    constant: false,
    payable: false,
  },
  {
    inputs: [
      {
        name: '_token',
        type: 'address',
      },
      {
        // Memo: Satoshi
        name: '_amountOfFloat',
        type: 'uint256',
      },
    ],
    name: 'getDepositFeeRate',
    outputs: [
      {
        name: 'depositFeeRate',
        type: 'uint256',
      },
    ],
    type: 'function',
    constant: false,
    payable: false,
  },
  {
    inputs: [],
    name: 'withdrawalFeeBPS',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    type: 'function',
    constant: false,
    payable: false,
  },
  {
    inputs: [
      {
        // Memo: Satoshi
        name: '_minerFees',
        type: 'uint256',
      },
    ],
    name: 'getMinimumAmountOfLPTokens',
    outputs: [
      {
        name: 'amountOfLPTokens',
        type: 'uint256',
      },
      {
        name: 'nowPrice',
        type: 'uint256',
      },
    ],
    type: 'function',
    constant: false,
    payable: false,
  },
];
