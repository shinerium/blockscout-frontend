// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ShineriumJoinedNode } from 'src/features/chain-variants/shinerium/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import ShineriumValidatorEntity from 'src/features/chain-variants/shinerium/components/ShineriumValidatorEntity';
import { formatLocation } from 'src/features/chain-variants/shinerium/utils/consensus';

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

interface Props {
  readonly data: Array<ShineriumJoinedNode>;
  readonly isLoading: boolean;
}

const EpochShineriumJoined = ({ data, isLoading }: Props) => {
  return (
    <TableContainerScrollable>
      <TableRoot minW="700px">
        <TableHeader>
          <TableRow>
            <TableColumnHeader width="45%">Node</TableColumnHeader>
            <TableColumnHeader width="30%">Rewards to</TableColumnHeader>
            <TableColumnHeader width="25%">Location</TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          { data.map((node, index) => (
            <TableRow key={ node.identity ?? index }>
              <TableCell verticalAlign="middle">
                { node.identity ? (
                  <ShineriumValidatorEntity identity={ node.identity } label={ null } isLoading={ isLoading } fontWeight={ 600 }/>
                ) : '-' }
                { node.ed_address_hash && (
                  <AddressEntity address={{ hash: node.ed_address_hash }} noIcon isLoading={ isLoading } color="text.secondary" mt={ 1 }/>
                ) }
              </TableCell>
              <TableCell verticalAlign="middle">
                { node.coinbase_hash ? <AddressEntity address={{ hash: node.coinbase_hash }} isLoading={ isLoading }/> : '-' }
              </TableCell>
              <TableCell verticalAlign="middle">
                <Skeleton loading={ isLoading } display="inline-block">{ formatLocation(node.location) ?? '-' }</Skeleton>
              </TableCell>
            </TableRow>
          )) }
        </TableBody>
      </TableRoot>
    </TableContainerScrollable>
  );
};

export default React.memo(EpochShineriumJoined);
