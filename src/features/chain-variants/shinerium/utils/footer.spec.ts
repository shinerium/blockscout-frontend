// SPDX-License-Identifier: LicenseRef-Blockscout

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, it, expect } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

describe('getShineriumFooterDescription', () => {
  it('describes the Shinerium explorer on a Shinerium chain', async() => {
    await withEnvs(ENVS_MAP.shinerium, async() => {
      const { getShineriumFooterDescription } = await import('./footer');

      expect(getShineriumFooterDescription()).toBe(
        'Shinerium Explorer is a tool for scanning, inspecting and analyzing the Shinerium blockchain network.',
      );
    });
  });

  it('leaves the footer as it is on any other chain', async() => {
    await withEnvs(ENVS_MAP.beaconChain, async() => {
      const { getShineriumFooterDescription } = await import('./footer');

      expect(getShineriumFooterDescription()).toBeUndefined();
    });
  });
});
