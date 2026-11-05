// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { BlockQuery } from 'src/slices/block/hooks/useBlockQuery';

import { Badge } from 'src/toolkit/chakra/badge';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

import { getBlockEpoch, getShineriumBlock, isCarrier } from '../../utils/shinerium-data';

interface Props {
  readonly blockQuery: BlockQuery;
}

const BlockShineriumCarrierTag = ({ blockQuery }: Props) => {
  const block = blockQuery.data ? getShineriumBlock(blockQuery.data) : undefined;

  if (!block || !isCarrier(block)) {
    return null;
  }

  const epoch = getBlockEpoch(block);
  const content = epoch === null ?
    'The block that ends an epoch: it carries the next control block and pays the epoch\'s rewards' :
    `The block that ends epoch ${ epoch }: it carries control block ${ block.control_block_number }, which starts the next epoch, ` +
    `and pays epoch ${ epoch }'s rewards`;

  return (
    <Tooltip content={ content }>
      <Badge colorPalette="purple" loading={ blockQuery.isPlaceholderData }>Carrier</Badge>
    </Tooltip>
  );
};

export default React.memo(BlockShineriumCarrierTag);
