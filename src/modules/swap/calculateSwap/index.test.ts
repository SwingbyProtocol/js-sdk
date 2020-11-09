import { calculateSwap } from './';

const RealDate = Date.now;

it.each([
  ['2020-08-25T10:20:00Z', { nonce: 409, sendAmount: '0.99999968' }],
  ['2020-08-25T10:21:00Z', { nonce: 197, sendAmount: '0.99999626' }],
  ['2020-08-25T10:22:00Z', { nonce: 835, sendAmount: '0.99999586' }],
])('works for %s', async (date, expected) => {
  expect.assertions(1);

  try {
    global.Date.now = jest.fn(() => new Date(date).getTime());

    const result = await calculateSwap({
      amount: '1',
      currencyFrom: 'BTC',
      destAddr: '0x0807cd4fb2cc82f8d45182a1d7d44446aee088b3',
    });

    expect(result).toMatchObject(expected);
  } finally {
    global.Date.now = RealDate;
  }
});
