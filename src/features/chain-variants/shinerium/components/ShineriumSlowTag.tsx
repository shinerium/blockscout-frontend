// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { getSlowLabel } from 'src/features/chain-variants/shinerium/utils/consensus';
import { SLOW_HINT } from 'src/features/chain-variants/shinerium/utils/labels';

import { Tag } from 'src/toolkit/chakra/tag';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

interface Props {
  readonly slow: number | null;
  readonly isLoading: boolean;
}

const ShineriumSlowTag = ({ slow, isLoading }: Props) => {
  const label = getSlowLabel(slow);

  if (!label) {
    return null;
  }

  return (
    <Tooltip content={ SLOW_HINT }>
      <Tag label="Slow" colorPalette={ label.color } loading={ isLoading } flexShrink={ 0 }>{ label.text }</Tag>
    </Tooltip>
  );
};

export default React.memo(ShineriumSlowTag);
