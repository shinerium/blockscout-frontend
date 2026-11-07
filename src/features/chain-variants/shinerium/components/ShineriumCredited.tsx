// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ShineriumRecordFigures } from 'src/features/chain-variants/shinerium/types/api';

import { formatCountOfQcs, getCreditedDetails } from 'src/features/chain-variants/shinerium/utils/consensus';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

interface Props {
  readonly figures: ShineriumRecordFigures;
  readonly qcs: number | null;
  readonly isLoading: boolean;
}

const ShineriumCredited = ({ figures, qcs, isLoading }: Props) => {
  const value = (
    <Skeleton loading={ isLoading } display="inline-block">{ formatCountOfQcs(figures.credited, qcs) }</Skeleton>
  );
  const details = figures.credited === null ? null : getCreditedDetails(qcs, figures.correlated);

  return details ? <Tooltip content={ details }>{ value }</Tooltip> : value;
};

export default React.memo(ShineriumCredited);
