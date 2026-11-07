// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { ShineriumValidatorEpoch } from 'src/features/chain-variants/shinerium/types/api';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import ShineriumCredited from 'src/features/chain-variants/shinerium/components/ShineriumCredited';
import ShineriumEpochEntity from 'src/features/chain-variants/shinerium/components/ShineriumEpochEntity';
import ShineriumSlowTag from 'src/features/chain-variants/shinerium/components/ShineriumSlowTag';
import { SHINERIUM_VALIDATOR_EPOCH } from 'src/features/chain-variants/shinerium/stubs';
import { formatCountOfQcs, formatRemoval } from 'src/features/chain-variants/shinerium/utils/consensus';
import { CREDITED_HINT } from 'src/features/chain-variants/shinerium/utils/labels';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { generateListStub } from 'src/shared/pagination/utils';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import {
  TableBody,
  TableCell,
  TableColumnHeader,
  TableContainerScrollable,
  TableHeader,
  TableRoot,
  TableRow,
} from 'src/toolkit/chakra/table';
import { Tag } from 'src/toolkit/chakra/tag';
import { Hint } from 'src/toolkit/components/Hint/Hint';

interface Props {
  readonly id: string;
  readonly isEnabled: boolean;
}

interface ItemProps {
  readonly item: ShineriumValidatorEpoch;
  readonly isLoading: boolean;
}

const ValidatorShineriumEpochsItem = ({ item, isLoading }: ItemProps) => (
  <TableRow>
    <TableCell verticalAlign="middle">
      <HStack gap={ 2 }>
        <ShineriumEpochEntity number={ item.epoch_number } noIcon fontWeight={ 600 } isLoading={ isLoading }/>
        <ShineriumSlowTag slow={ item.slow } isLoading={ isLoading }/>
      </HStack>
      <TimeWithTooltip timestamp={ item.started_at } isLoading={ isLoading } color="text.secondary" mt={ 1 }/>
    </TableCell>
    <TableCell verticalAlign="middle" isNumeric>
      <Skeleton loading={ isLoading } display="inline-block">{ item.index }</Skeleton>
    </TableCell>
    <TableCell verticalAlign="middle" isNumeric>
      <Skeleton loading={ isLoading } display="inline-block">{ formatCountOfQcs(item.signed, item.qcs) }</Skeleton>
    </TableCell>
    <TableCell verticalAlign="middle" isNumeric>
      <ShineriumCredited figures={ item } qcs={ item.qcs } isLoading={ isLoading }/>
    </TableCell>
    <TableCell verticalAlign="middle" isNumeric>
      { item.reward ? <NativeCoinValue amount={ item.reward } noSymbol loading={ isLoading }/> : '-' }
    </TableCell>
    <TableCell verticalAlign="middle">
      { item.removal ? <Tag colorPalette="orange" loading={ isLoading }>{ formatRemoval(item.removal) }</Tag> : null }
    </TableCell>
  </TableRow>
);

const ValidatorShineriumEpochs = ({ id, isEnabled }: Props) => {
  const { isError, isInitialLoading, isTransitioning, data, pagination } = useApiPaginatedQuery({
    resourceName: 'core:shinerium_validator_epochs',
    pathParams: { id },
    options: {
      enabled: isEnabled,
      placeholderData: generateListStub<'core:shinerium_validator_epochs'>(SHINERIUM_VALIDATOR_EPOCH, 10, { next_page_params: null }),
    },
  });

  const actionBar = pagination.isVisible ? (
    <ActionBar>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  const content = data?.items ? (
    <TableContainerScrollable>
      <TableRoot minW="760px">
        <TableHeader>
          <TableRow>
            <TableColumnHeader width="28%">Epoch</TableColumnHeader>
            <TableColumnHeader width="9%" isNumeric>Seat</TableColumnHeader>
            <TableColumnHeader width="14%" isNumeric>Signed</TableColumnHeader>
            <TableColumnHeader width="15%" isNumeric>Credited<Hint label={ CREDITED_HINT } ml={ 1 }/></TableColumnHeader>
            <TableColumnHeader width="18%" isNumeric>Reward</TableColumnHeader>
            <TableColumnHeader width="16%">Left</TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          { data.items.map((item, index) => (
            <ValidatorShineriumEpochsItem
              key={ item.epoch_number + (isInitialLoading ? `_${ index }` : '') }
              item={ item }
              isLoading={ isInitialLoading }
            />
          )) }
        </TableBody>
      </TableRoot>
    </TableContainerScrollable>
  ) : null;

  return (
    <DataList
      isError={ isError }
      itemsNum={ data?.items.length }
      emptyText="It has served no epoch."
      actionBar={ actionBar }
      isTransitioning={ isTransitioning }
    >
      { content }
    </DataList>
  );
};

export default React.memo(ValidatorShineriumEpochs);
