// SPDX-License-Identifier: LicenseRef-Blockscout

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, it, expect } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

describe('getShineriumNavigationLogo', () => {
  it('widens the logo to the menu and the drawer on a Shinerium chain', async() => {
    await withEnvs(ENVS_MAP.shinerium, async() => {
      const { getShineriumNavigationLogo } = await import('./navigation-logo');

      expect(getShineriumNavigationLogo()).toEqual({
        menuLogoWidth: '160px',
        menuHeaderHeight: 16,
        menuNavMarginTop: 0,
        drawerLogoWidth: '146px',
      });
    });
  });

  it('leaves the logo as it is on any other chain', async() => {
    await withEnvs(ENVS_MAP.beaconChain, async() => {
      const { getShineriumNavigationLogo } = await import('./navigation-logo');

      expect(getShineriumNavigationLogo()).toBeUndefined();
    });
  });
});
