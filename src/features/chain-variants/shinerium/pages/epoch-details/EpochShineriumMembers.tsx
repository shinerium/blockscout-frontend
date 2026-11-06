// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ShineriumEpochDetailed, ShineriumEpochMember } from 'src/features/chain-variants/shinerium/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import ShineriumValidatorEntity from 'src/features/chain-variants/shinerium/components/ShineriumValidatorEntity';
import { formatLocation, formatRemoval } from 'src/features/chain-variants/shinerium/utils/consensus';

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

interface Props {
  readonly data: ShineriumEpochDetailed;
  readonly isLoading: boolean;
}

interface ItemProps {
  readonly member: ShineriumEpochMember;
  readonly qcs: number | null;
  readonly isLoading: boolean;
}

const EpochShineriumMembersItem = ({ member, qcs, isLoading }: ItemProps) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">{ member.index }</Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <ShineriumValidatorEntity identity={ member.identity } label={ member.name } isLoading={ isLoading } fontWeight={ 600 }/>
        <AddressEntity address={{ hash: member.ed_address_hash }} noIcon isLoading={ isLoading } color="text.secondary" mt={ 1 }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        { member.coinbase_hash ? <AddressEntity address={{ hash: member.coinbase_hash }} isLoading={ isLoading }/> : '-' }
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">{ formatLocation(member.location) ?? '-' }</Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading } display="inline-block">
          { member.signed === null ? '-' : `${ member.signed } / ${ qcs ?? '-' }` }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        { member.reward ? <NativeCoinValue amount={ member.reward } noSymbol loading={ isLoading }/> : '-' }
      </TableCell>
      <TableCell verticalAlign="middle">
        { member.removal ? <Tag colorPalette="orange" loading={ isLoading }>{ formatRemoval(member.removal) }</Tag> : null }
      </TableCell>
    </TableRow>
  );
};

const EpochShineriumMembers = ({ data, isLoading }: Props) => {
  return (
    <TableContainerScrollable>
      <TableRoot minW="800px">
        <TableHeader>
          <TableRow>
            <TableColumnHeader width="6%">Seat</TableColumnHeader>
            <TableColumnHeader width="28%">Member</TableColumnHeader>
            <TableColumnHeader width="20%">Rewards to</TableColumnHeader>
            <TableColumnHeader width="14%">Location</TableColumnHeader>
            <TableColumnHeader width="10%" isNumeric>Signed</TableColumnHeader>
            <TableColumnHeader width="12%" isNumeric>Reward</TableColumnHeader>
            <TableColumnHeader width="10%">Left</TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          { data.members.map((member) => (
            <EpochShineriumMembersItem key={ member.index } member={ member } qcs={ data.qcs } isLoading={ isLoading }/>
          )) }
        </TableBody>
      </TableRoot>
    </TableContainerScrollable>
  );
};

export default React.memo(EpochShineriumMembers);
