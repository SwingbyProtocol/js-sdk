import { fetch } from '../../fetch';
import { getNodeUrl, WithServer } from '../../nodes';

export const createSwap = async (
  params: WithServer & {
    addressTo: string;
    amount: string;
    currencyFrom: string;
    currencyTo: string;
    nonce: number;
  },
) => {
  const node = getNodeUrl(params);
  return await fetch<{
    addressIn: string;
    addressOut: string;
    amountIn: string;
    currencyIn: string;
    currencyOut: string;
    timestamp: number;
  }>(`${node}/api/v1/swaps/create`, {
    method: 'post',
    body: JSON.stringify({
      address_to: params.addressTo,
      amount: params.amount,
      currency_from: params.currencyFrom,
      currency_to: params.currencyTo,
    }),
  });
};
