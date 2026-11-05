// SPDX-License-Identifier: LicenseRef-Blockscout

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, it, expect } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

describe('getWithdrawalsNaming', () => {
  it('names the beacon chain\'s withdrawals rewards on a Shinerium chain', async() => {
    await withEnvs(ENVS_MAP.shinerium, async() => {
      const { getWithdrawalsNaming } = await import('./withdrawals-naming');

      expect(getWithdrawalsNaming()).toEqual({
        title: 'Rewards',
        singular: 'reward',
        plural: 'rewards',
        processed: 'paid',
        moved: 'issued',
        blockHint: 'The number of rewards the carrier pays for the epoch it ends',
      });
    });
  });

  it('keeps the withdrawals\' own names on any other chain', async() => {
    await withEnvs(ENVS_MAP.beaconChain, async() => {
      const { getWithdrawalsNaming } = await import('./withdrawals-naming');

      expect(getWithdrawalsNaming()).toMatchObject({ title: 'Withdrawals', plural: 'withdrawals', moved: 'withdrawn' });
    });
  });
});
