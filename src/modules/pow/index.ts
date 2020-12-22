import { Big, BigSource } from 'big.js';
import hexToBinary from 'hex-to-binary';
import crypto from 'isomorphic-webcrypto';

import type { SkybridgeParams } from '../common-params';
import type { SkybridgeMode } from '../modes';
import type { SkybridgeResource } from '../resources';
import { getBridgeFor } from '../context';
import { getChainFor } from '../chains';

import { getBlockHeight } from './getBlockHeight';

const difficultyZeroBits = 10;

type Params<M extends SkybridgeMode> = Pick<
  SkybridgeParams<SkybridgeResource, M>,
  'context' | 'addressReceiving' | 'currencyDeposit' | 'currencyReceiving' | 'amountDesired'
>;

type Result<M extends SkybridgeMode> = Pick<
  SkybridgeParams<SkybridgeResource, M>,
  'amountDeposit' | 'nonce'
>;

export const runProofOfWork = async <M extends SkybridgeMode>({
  context,
  addressReceiving: addressReceivingParam,
  currencyDeposit,
  currencyReceiving,
  amountDesired,
}: Params<M>): Promise<Result<M>> => {
  let nonce = 0;
  let hash: any;
  let latestRound = await getRound({ context, currencyDeposit, currencyReceiving });
  let strHashArg = '';
  const flooredAmount = floorAmount(amountDesired);
  const addressReceiving =
    getChainFor({ coin: currencyReceiving }) === 'ethereum'
      ? addressReceivingParam.toLowerCase()
      : addressReceivingParam;

  do {
    nonce += 1;

    strHashArg =
      String(nonce) +
      ';' +
      latestRound +
      ';' +
      addressReceiving +
      ';' +
      currencyDeposit +
      ';' +
      flooredAmount +
      ';';

    hash = await generateHash(strHashArg);
  } while (!verifyHashPrefix(hash));

  const rejectionSample = new Big(BigInt(`0x${hash}`).toString()).mod(1024);
  const BigNumberFloorAmount = toSatoshi(flooredAmount);
  const toSendBI = BigNumberFloorAmount.minus(rejectionSample);
  const numSendAmount = toBTC(toSendBI.toString());
  const amountDeposit = numSendAmount.toFixed();

  return { amountDeposit, nonce };
};

export const getRound = async <M extends SkybridgeMode>({
  context,
  currencyReceiving,
  currencyDeposit,
}: Pick<
  SkybridgeParams<SkybridgeResource, M>,
  'context' | 'currencyDeposit' | 'currencyReceiving'
>): Promise<string> => {
  const round: number = await (async () => {
    const bridge = getBridgeFor({
      context,
      currencyDeposit: currencyDeposit,
      currencyReceiving: currencyReceiving,
    });
    if (bridge === 'btc_erc') {
      const blockHeight = await getBlockHeight({ context, bridge });
      return Math.floor(blockHeight / 3);
    }

    return await getBlockHeight({ context, bridge });
  })();

  return String(round + 1);
};

export const floorAmount = (amount: BigSource): string => {
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
        throw new Error('Invalid nonce');
      }
    }
    return true;
  } catch (e) {
    return false;
  }
};

const toBTC = (satoshiValue: BigSource): Big => {
  return new Big(satoshiValue).div(100000000);
};

const toSatoshi = (btcValue: BigSource): Big => {
  return new Big(btcValue).times(100000000);
};

const generateHash = async (
  data: string | ArrayBuffer,
  format: BufferEncoding = 'hex',
  name = 'SHA-512',
) => {
  const digest = await crypto.subtle.digest(
    { name },
    typeof data === 'string' ? Buffer.from(data) : data,
  );
  return Buffer.from(digest).toString(format);
};
