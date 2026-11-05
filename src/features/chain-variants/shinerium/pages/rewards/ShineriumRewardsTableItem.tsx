// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Badge } from 'src/toolkit/chakra/badge';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

import { getRewardTypeLabel } from '../../utils/labels';
import { getShineriumWithdrawal } from '../../utils/shinerium-data';

interface Props {
  readonly item: schemas['BeaconWithdrawal'];
  readonly view: 'address' | 'block' | 'list';
  readonly isLoading?: boolean;
}

const ShineriumRewardsTableItem = ({ item, view, isLoading }: Props) => {
  const reward = getShineriumWithdrawal(item);
  const label = getRewardTypeLabel(reward?.reward_type ?? null);

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <Tooltip content={ label.hint }>
          <Badge colorPalette={ label.color } loading={ isLoading }>{ label.text }</Badge>
        </Tooltip>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">{ item.validator_index }</Skeleton>
      </TableCell>
      { view !== 'block' && (
        <TableCell verticalAlign="middle">
          { item.block_number ? (
            <BlockEntity
              number={ item.block_number }
              isLoading={ isLoading }
              textStyle="sm"
              noIcon
            />
          ) : '-' }
        </TableCell>
      ) }
      <TableCell verticalAlign="middle">
        { reward?.validator_hash ? (
          <AddressEntity
            address={{ hash: reward.validator_hash }}
            isLoading={ isLoading }
            truncation="constant"
          />
        ) : '-' }
      </TableCell>
      { view !== 'address' && (
        <TableCell verticalAlign="middle">
          { item.receiver ? (
            <AddressEntity
              address={ item.receiver }
              isLoading={ isLoading }
              truncation="constant"
            />
          ) : '-' }
        </TableCell>
      ) }
      { view !== 'block' && (
        <TableCell verticalAlign="middle" pr={ 12 }>
          <TimeWithTooltip
            timestamp={ item.timestamp }
            isLoading={ isLoading }
            color="text.secondary"
            display="inline-block"
          />
        </TableCell>
      ) }
      <TableCell verticalAlign="middle">
        <NativeCoinValue amount={ item.amount } loading={ isLoading } noSymbol/>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ShineriumRewardsTableItem);
