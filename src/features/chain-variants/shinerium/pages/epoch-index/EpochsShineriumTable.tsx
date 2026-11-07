// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ShineriumEpoch } from 'src/features/chain-variants/shinerium/types/api';

import { EPOCH_QCS_HINT } from 'src/features/chain-variants/shinerium/utils/labels';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';
import { Hint } from 'src/toolkit/components/Hint/Hint';

import EpochsShineriumTableItem from './EpochsShineriumTableItem';

interface Props {
  readonly data: Array<ShineriumEpoch>;
  readonly isLoading: boolean;
  readonly top: number;
  readonly resetKey: string;
}

const EpochsShineriumTable = ({ data, isLoading, top, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <TableRoot minW="800px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="28%">Epoch</TableColumnHeader>
          <TableColumnHeader width="22%">Blocks</TableColumnHeader>
          <TableColumnHeader width="12%" isNumeric>Committee</TableColumnHeader>
          <TableColumnHeader width="12%" isNumeric>QCs<Hint label={ EPOCH_QCS_HINT } ml={ 1 }/></TableColumnHeader>
          <TableColumnHeader width="14%" isNumeric>Signed</TableColumnHeader>
          <TableColumnHeader width="12%" isNumeric>Joined / left</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.slice(0, renderedItemsNum).map((item, index) => (
          <EpochsShineriumTableItem key={ item.number + (isLoading ? `_${ index }` : '') } item={ item } isLoading={ isLoading }/>
        )) }
        <TableRow ref={ cutRef }/>
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(EpochsShineriumTable);
