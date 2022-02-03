import type { SkybridgeResource } from '../resources';
import type { SkybridgeCoin } from '../coins';
import type { SkybridgeContext } from '../context';
import type { SkybridgeMode } from '../modes';

const STATUSES = [
  'WAITING',
  'PENDING',
  'SIGNING',
  'SENDING',
  'COMPLETED',
  'SIGNING_REFUND',
  'SENDING_REFUND',
  'REFUNDED',
  'EXPIRED',
] as const;
export type SkybridgeStatus = typeof STATUSES[number];

export type SkybridgeParams<
  R extends SkybridgeResource = SkybridgeResource,
  M extends SkybridgeMode = SkybridgeMode
> = {
  context: SkybridgeContext<M>;
  /** Unique identifier for a swap. */
  hash: string;
  /** Address where the user will receive their funds after the swap. */
  addressReceiving: string;
  /** Address where the user sends funds from to start a swap. */
  addressSending: string | null;
  /** Address that users have to send funds to to initiate a swap. */
  addressDeposit: string;
  /** Amount that users type in the UI. */
  amountDesired: string;
  /** Amount that users have to send to Skybridge to start the swap. */
  amountDeposit: string;
  amountReceiving: string;
  currencyDeposit: SkybridgeCoin<R, M, 'in'>;
  currencyReceiving: SkybridgeCoin<R, M, 'out'>;
  nonce: number;
  timestamp: Date;
  /** e.g. `0.1` means `10%`. */
  feeBridgeFraction: string;
  /** In the units specified by `feeCurrency`. */
  feeMiner: string;
  feeCurrency: SkybridgeCoin<R, M, 'out'>;
  /** In the units specified by `feeCurrency`. */
  feeTotal: string;
  status: SkybridgeStatus;
  txDepositId: string;
  txReceivingId: string;
  isSkypoolsSwap: R extends 'swap' ? boolean : false;
};

export type SkybridgePeer = {
  active: boolean;
  id: string;
  moniker: string;
  p2pListener: string;
  rank: number;
  restUri: string;
  rewardsAddress1?: string;
  rewardsAddress2?: string;
  stake: Stake;
  state: number;
  state_name: string;
  version: string;
  thisNode?: boolean;
};

export type Stake = {
  address: string;
  amount: string;
  stakeTime: number;
  stakeValid: boolean;
};

export type SkybridgeCurrency = 'BTC' | 'WBTC' | 'sbBTC' | 'BTCB' | 'SKYPOOL';

export type SkybridgeQuery = {
  addressDeposit: string;
  addressIn: string;
  addressOut: string;
  amountIn: string;
  amountOut: string;
  currencyIn: SkybridgeCurrency;
  currencyOut: SkybridgeCurrency;
  fee: string;
  feeCurrency: string;
  hash: string;
  rewards: any[];
  skypools: boolean;
  status: SkybridgeStatus;
  timestamp: number;
  txIdIn?: string;
  txIdOut?: string;
};

export const SkybridgeTermsMessage =
  'I am not the person or entities who reside in, are citizens of, are incorporated in, or have a registered office in the United States of America or any prohibited localities, as defined in the Terms of Use. (https://docs.swingby.network/terms.pdf)I will not in the future access this site or use Swingby dApps while located within the United States any prohibited localities, as defined in the Terms of Use.I am not using, and will not in the future use, a VPN to mask my physical location from a restricted territory.I am legally permitted to access this site and use Swingby dApps under the laws of the jurisdiction in which I reside and where I am located.I understand the risks related to using Swingby Network protocols.';
