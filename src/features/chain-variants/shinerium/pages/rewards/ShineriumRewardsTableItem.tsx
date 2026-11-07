// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
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

import { getRewardTypeLabel, isProposerReward } from '../../utils/labels';
import { getShineriumWithdrawal } from '../../utils/shinerium-data';

interface Props {
  readonly item: schemas['BeaconWithdrawal'];
  readonly view: 'address' | 'block' | 'list';
  readonly isLoading?: boolean;
}

interface MemberProps {
  readonly rewardType: string | null;
  readonly validatorHash: string | null | undefined;
  readonly isLoading: boolean | undefined;
}

const ShineriumRewardMember = ({ rewardType, validatorHash, isLoading }: MemberProps) => {
  if (!validatorHash) {
    return '-';
  }

  return (
    <Flex alignItems="center" columnGap={ 2 }>
      { isProposerReward(rewardType) && (
        <Skeleton loading={ isLoading } color="text.secondary" flexShrink={ 0 }>Proposer</Skeleton>
      ) }
      <AddressEntity
        address={{ hash: validatorHash }}
        isLoading={ isLoading }
        truncation="constant"
      />
    </Flex>
  );
};

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
        <ShineriumRewardMember rewardType={ reward?.reward_type ?? null } validatorHash={ reward?.validator_hash } isLoading={ isLoading }/>
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
