// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';

const FOOTER_DESCRIPTION = 'Shinerium Explorer is a tool for scanning, inspecting and analyzing the Shinerium blockchain network.';

export const getShineriumFooterDescription = (): string | undefined => (
  config.features.shinerium.isEnabled ? FOOTER_DESCRIPTION : undefined
);
