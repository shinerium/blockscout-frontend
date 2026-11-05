// SPDX-License-Identifier: LicenseRef-Blockscout

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, it, expect } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

describe('getAddressNameLabel', () => {
  it('calls a named account\'s name an account name on a Shinerium chain', async() => {
    await withEnvs(ENVS_MAP.shinerium, async() => {
      const { getAddressNameLabel } = await import('./address-name-label');

      expect(getAddressNameLabel().label).toBe('Account name');
    });
  });

  it('keeps the validator\'s name on any other chain', async() => {
    await withEnvs(ENVS_MAP.beaconChain, async() => {
      const { getAddressNameLabel } = await import('./address-name-label');

      expect(getAddressNameLabel()).toEqual({ label: 'Validator name', hint: 'The name of the validator' });
    });
  });
});
