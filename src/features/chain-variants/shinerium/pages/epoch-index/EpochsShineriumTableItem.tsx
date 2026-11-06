// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { ShineriumEpoch } from 'src/features/chain-variants/shinerium/types/api';

import BlockEntity from 'src/slices/block/components/entity/BlockEntity';

import ShineriumEpochEntity from 'src/features/chain-variants/shinerium/components/ShineriumEpochEntity';
import { formatShare, getEpochParticipation } from 'src/features/chain-variants/shinerium/utils/consensus';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';
import { Tag } from 'src/toolkit/chakra/tag';

interface Props {
  readonly item: ShineriumEpoch;
  readonly isLoading: boolean;
}

const EpochsShineriumTableItem = ({ item, isLoading }: Props) => {
  const participation = getEpochParticipation(item.signed, item.qcs, item.members_count);
  const hasEnded = item.ended_at !== null;

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <HStack gap={ 2 }>
          <ShineriumEpochEntity number={ item.number } noIcon fontWeight={ 700 } isLoading={ isLoading }/>
          { item.is_current && <Tag colorPalette="green" loading={ isLoading }>Running</Tag> }
          <TimeWithTooltip timestamp={ item.started_at } isLoading={ isLoading } color="text.secondary"/>
        </HStack>
      </TableCell>
      <TableCell verticalAlign="middle">
        <HStack gap={ 1 }>
          <BlockEntity number={ item.first_block_number } noIcon isLoading={ isLoading }/>
          { item.end_block_number !== null && (
            <>
              <Skeleton loading={ isLoading } color="text.secondary">–</Skeleton>
              <BlockEntity number={ item.end_block_number } noIcon isLoading={ isLoading }/>
            </>
          ) }
        </HStack>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading } display="inline-block">{ item.members_count }</Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading } display="inline-block">{ item.qcs ?? '-' }</Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading } display="inline-block">{ formatShare(participation) }</Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading } display="inline-block">
          { hasEnded ? `${ item.joined_count ?? 0 } / ${ item.removed_count ?? 0 }` : '-' }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(EpochsShineriumTableItem);
