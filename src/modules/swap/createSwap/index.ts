import { Coin } from '../../coins';
import { fetch } from '../../fetch';
import { getNodeUrl, WithServer } from '../../nodes';

export const createSwap = async (
  params: WithServer & {
    addressTo: string;
    amount: string;
    currencyFrom: Coin;
    currencyTo: Coin;
    nonce: number;
  },
) => {
  const node = getNodeUrl(params);
  return await fetch<{
    addressIn: string;
    addressOut: string;
    amountIn: string;
    currencyIn: Coin;
    currencyOut: Coin;
    timestamp: number;
  }>(`${node}/api/v1/swaps/create`, {
    method: 'post',
    body: JSON.stringify({
      address_to: params.addressTo,
      amount: params.amount,
      currency_from: params.currencyFrom,
      currency_to: params.currencyTo,
      nonce: params.nonce,
    }),
  });
};
