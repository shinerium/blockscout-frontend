// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';
import { currencyUnits } from 'src/slices/chain/units';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import ShineriumRewardsTableItem from './ShineriumRewardsTableItem';

interface Props {
  readonly top: number;
  readonly isLoading?: boolean;
  readonly items: Array<schemas['BeaconWithdrawal']>;
  readonly view: 'address' | 'block' | 'list';
  readonly resetKey?: string;
}

const ShineriumRewardsTable = ({ items, isLoading, top, view, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <AddressHighlightProvider>
      <TableRoot style={{ tableLayout: 'auto' }} minW="950px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader>Type</TableColumnHeader>
            <TableColumnHeader>Epoch</TableColumnHeader>
            { view !== 'block' && <TableColumnHeader>Block</TableColumnHeader> }
            <TableColumnHeader>Member</TableColumnHeader>
            { view !== 'address' && <TableColumnHeader>To</TableColumnHeader> }
            { view !== 'block' && <TableColumnHeader>Timestamp<TimeFormatToggle/></TableColumnHeader> }
            <TableColumnHeader>{ `Value ${ currencyUnits.ether }` }</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { items.slice(0, renderedItemsNum).map((item, index) => (
            <ShineriumRewardsTableItem key={ item.index + (isLoading ? String(index) : '') } item={ item } view={ view } isLoading={ isLoading }/>
          )) }
          <TableRow ref={ cutRef }/>
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default ShineriumRewardsTable;
