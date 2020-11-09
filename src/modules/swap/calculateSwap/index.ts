import { BigNumber } from 'bignumber.js';
import hexToBinary from 'hex-to-binary';
import crypto from 'isomorphic-webcrypto';

import { getEthBlock } from '../getEthBlock';
import { Coin } from '../../coins';

const difficultyZeroBits = 10;

export const calculateSwap = async ({
  destAddr,
  currencyFrom,
  currencyTo,
  amount,
}: {
  destAddr: string;
  currencyTo: Coin;
  currencyFrom: Coin;
  amount: BigNumber.Value;
}): Promise<{ sendAmount: string; nonce: number }> => {
  let startSecs = new Date().getSeconds();

  let nonce = 0;
  let hash: any;
  let latestRound = await getRound({ currencyFrom, currencyTo });
  let strHashArg = '';
  const flooredAmount = floorAmount(amount);

  do {
    nonce += 1;

    strHashArg =
      String(nonce) +
      ';' +
      latestRound +
      ';' +
      destAddr.toLowerCase() +
      ';' +
      currencyFrom +
      ';' +
      flooredAmount +
      ';';

    hash = await generateHash(strHashArg);
    const finishSecs = new Date().getSeconds();
    if (startSecs > finishSecs) {
      nonce = 0;
      startSecs = new Date().getSeconds();
      latestRound = await getRound({ currencyTo, currencyFrom });
    }
  } while (!verifyHashPrefix(hash));

  const rejectionSample = new BigNumber(`0x${hash}`).mod(1024);
  const BigNumberFloorAmount = toSatoshi(flooredAmount);
  const toSendBI = BigNumberFloorAmount.minus(rejectionSample);
  const numSendAmount = toBTC(toSendBI.toString());
  const sendAmount = numSendAmount.toFixed();

  return { sendAmount, nonce };
};

export const getRound = async ({
  currencyTo,
  currencyFrom,
}: {
  currencyFrom: Coin;
  currencyTo: Coin;
}): Promise<string> => {
  let round: number;
  if (currencyFrom === 'BTCE' || currencyTo === 'BTCE') {
    const blockHeight = await getEthBlock();
    round = Math.floor(blockHeight / 3);
  } else {
    const timestamp = Math.floor(Date.now() / 1000);
    round = Math.floor(timestamp / 60);
  }
  return String(round + 1);
};

export const floorAmount = (amount: BigNumber.Value): string => {
  const numAmount = Number(amount);
  const decimals = countDecimals(numAmount);
  if (decimals === 0) {
    return String(numAmount) + '.0';
  } else if (5 > decimals) {
    return String(numAmount);
  } else {
    const fixedAmount = numAmount.toFixed(8);
    const floorAmount = fixedAmount.slice(0, -3);
    return floorAmount;
  }
};

const countDecimals = (value: number): number => {
  if (value % 1 !== 0) return value.toString().split('.')[1].length;
  return 0;
};

const verifyHashPrefix = (hash: string) => {
  // binaryHash => e.g.: 001100010110000000000101....
  const binaryHash = hexToBinary(hash);
  const reversedBinaryHash = binaryHash.split('').reverse().join('');
  try {
    for (let i = 0; i < difficultyZeroBits; i++) {
      if (reversedBinaryHash[11 + i] !== '0') {
        throw 'invalid nonce';
      }
    }
    return true;
  } catch (e) {
    return false;
  }
};

const toBTC = (satoshiValue: BigNumber.Value): BigNumber => {
  return new BigNumber(satoshiValue).div(100000000, 10);
};

const toSatoshi = (btcValue: BigNumber.Value): BigNumber => {
  return new BigNumber(btcValue).times(100000000, 10);
};

const generateHash = async (
  data: string | ArrayBuffer,
  format: BufferEncoding = 'hex',
  name = 'SHA-512',
) => {
  const digest = await crypto.subtle.digest(
    {
      name,
    },
    typeof data === 'string' ? Buffer.from(data) : data,
  );
  return Buffer.from(digest).toString(format);
};
