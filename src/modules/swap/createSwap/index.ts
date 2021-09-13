import type { SkybridgeMode } from '../../modes';
import { create, CreateParams, CreateResult } from '../../generic-create';
import { baseLogger } from '../../logger';
import { fetch } from '../../fetch';

const logger = baseLogger.extend('create-swap');

export const createSwap = async <M extends SkybridgeMode>(
  params: Omit<CreateParams<'swap', M>, 'resource'> & { affiliateCode?: string | null },
): Promise<CreateResult<'swap', M>> => {
  const result = await create({ ...params, resource: 'swap' });

  (async () => {
    try {
      if (typeof params.context.affiliateApi !== 'string') {
        logger('No affiliate program API present in context.');
        return;
      }

      if (!params.affiliateCode) {
        logger('No affiliate code has been passed.');
        return;
      }

      const linkResult = await fetch<{ affiliateCode: string }>(
        `${params.context.affiliateApi}/api/${params.context.mode}/swaps/link`,
        {
          method: 'POST',
          body: JSON.stringify({ affiliateCode: params.affiliateCode, swapHash: result.hash }),
        },
      );

      if (!linkResult.ok) {
        throw new Error(`Affiliate code linking failed: ${linkResult.response}`);
      }

      logger('Swap linked to affiliate code: %j', linkResult.response);
    } catch (e: any) {
      logger('Failed calling the affiliate program API: %s', e.message);
    }
  })();

  return result;
};
