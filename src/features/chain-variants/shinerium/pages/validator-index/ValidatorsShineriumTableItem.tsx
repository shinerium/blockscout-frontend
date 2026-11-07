// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { ShineriumValidator } from 'src/features/chain-variants/shinerium/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import ShineriumValidatorEntity from 'src/features/chain-variants/shinerium/components/ShineriumValidatorEntity';
import { formatBondStatus, formatLocation, formatShare, getSignedShare } from 'src/features/chain-variants/shinerium/utils/consensus';

import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';
import { Tag } from 'src/toolkit/chakra/tag';

interface Props {
  readonly item: ShineriumValidator;
  readonly isLoading: boolean;
}

const ValidatorsShineriumTableItem = ({ item, isLoading }: Props) => {
  const status = formatBondStatus(item.status);

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <ShineriumValidatorEntity identity={ item.identity } label={ item.name } isLoading={ isLoading } fontWeight={ 600 }/>
        <AddressEntity address={{ hash: item.ed_address_hash }} noIcon isLoading={ isLoading } color="text.secondary" mt={ 1 }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        <HStack gap={ 2 } flexWrap="wrap">
          { item.is_member && <Tag colorPalette="green" loading={ isLoading }>Committee</Tag> }
          { status && <Skeleton loading={ isLoading } display="inline-block">{ status }</Skeleton> }
        </HStack>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">{ formatLocation(item.location) ?? '-' }</Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading } display="inline-block">{ item.epochs }</Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading } display="inline-block">{ formatShare(getSignedShare(item.signed, item.qcs)) }</Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        { item.rewards_total ? <NativeCoinValue amount={ item.rewards_total } noSymbol loading={ isLoading }/> : '-' }
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        { item.amount ? <NativeCoinValue amount={ item.amount } noSymbol accuracy={ 0 } loading={ isLoading }/> : '-' }
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ValidatorsShineriumTableItem);
