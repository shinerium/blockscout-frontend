// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';

export interface ShineriumNavigationLogo {
  readonly menuLogoWidth: string;
  readonly menuHeaderHeight: number;
  readonly menuNavMarginTop: number;
  readonly drawerLogoWidth: string;
}

const NAVIGATION_LOGO: ShineriumNavigationLogo = {
  menuLogoWidth: '160px',
  menuHeaderHeight: 16,
  menuNavMarginTop: 0,
  drawerLogoWidth: '146px',
};

export const getShineriumNavigationLogo = (): ShineriumNavigationLogo | undefined => (
  config.features.shinerium.isEnabled ? NAVIGATION_LOGO : undefined
);
