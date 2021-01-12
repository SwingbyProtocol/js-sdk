import type { SkybridgeMode } from '../../modes';
import { create, CreateParams, CreateResult } from '../../generic-create';
import { logger } from '../../logger';
import { fetch } from '../../fetch';

export const createSwap = async <M extends SkybridgeMode>(
  params: Omit<CreateParams<'swap', M>, 'resource'> & { affiliateCode?: string | null },
): Promise<CreateResult<'swap', M>> => {
  const result = await create({ ...params, resource: 'swap' });

  (async () => {
    try {
      if (!params.context.affiliateApi) {
        logger('No affiliate program API present in context.');
        return;
      }

      if (!params.affiliateCode) {
        logger('No affiliate code has been passed.');
        return;
      }

      const linkResult = await fetch<{ affiliateCode: string }>(
        `${params.context.affiliateApi}/api/swaps/link`,
        {
          method: 'POST',
          body: JSON.stringify({ affiliateCode: params.affiliateCode, swapHash: result.hash }),
        },
      );

      if (!linkResult.ok) {
        throw new Error(`Affiliate code linking failed: ${linkResult.response}`);
      }

      logger('Swap linked to affiliate code: %O', linkResult.response);
    } catch (e) {
      logger('Failed calling the affiliate program API: %s', e.message);
    }
  })();

  return result;
};
