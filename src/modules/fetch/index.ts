import originalFetch from 'isomorphic-unfetch';

import { logger } from '../logger';

export const fetch = async <SuccessResponse extends unknown>(
  url: Parameters<typeof originalFetch>[0],
  optionsParam: Parameters<typeof originalFetch>[1],
): Promise<
  | { ok: true; status: number; response: SuccessResponse }
  | { ok: false; status: number; response: string }
> => {
  const options: typeof optionsParam = {
    ...optionsParam,
    headers: {
      'Content-Type': 'application/json',
      ...optionsParam?.headers,
    },
  };

  logger(`Will call "%s" with %O`, url, options);
  const result = await originalFetch(url, options);

  const response = await (async () => {
    const str = await result.text();
    try {
      return JSON.parse(str);
    } catch (e) {
      return str;
    }
  })();

  if (!result.ok) {
    return { ok: false, status: result.status, response: response?.message ?? response };
  }

  return { ok: true, status: result.status, response };
};
