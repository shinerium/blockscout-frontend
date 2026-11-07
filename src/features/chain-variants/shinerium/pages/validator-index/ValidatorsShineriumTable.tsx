// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ShineriumValidator } from 'src/features/chain-variants/shinerium/types/api';

import { VALIDATOR_LOCATION_HINT } from 'src/features/chain-variants/shinerium/utils/labels';

import config from 'src/config';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';
import { Hint } from 'src/toolkit/components/Hint/Hint';

import ValidatorsShineriumTableItem from './ValidatorsShineriumTableItem';

interface Props {
  readonly data: Array<ShineriumValidator>;
  readonly isLoading: boolean;
  readonly resetKey: string;
}

const ValidatorsShineriumTable = ({ data, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <TableRoot minW="900px">
      <TableHeaderSticky top={ 0 }>
        <TableRow>
          <TableColumnHeader width="24%">Validator</TableColumnHeader>
          <TableColumnHeader width="13%">Status</TableColumnHeader>
          <TableColumnHeader width="17%">Location<Hint label={ VALIDATOR_LOCATION_HINT } ml={ 1 }/></TableColumnHeader>
          <TableColumnHeader width="9%" isNumeric>Epochs</TableColumnHeader>
          <TableColumnHeader width="9%" isNumeric>Signed</TableColumnHeader>
          <TableColumnHeader width="14%" isNumeric>Rewards { config.chain.currency.symbol }</TableColumnHeader>
          <TableColumnHeader width="14%" isNumeric>Bond { config.chain.currency.symbol }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.slice(0, renderedItemsNum).map((item, index) => (
          <ValidatorsShineriumTableItem key={ item.identity + (isLoading ? `_${ index }` : '') } item={ item } isLoading={ isLoading }/>
        )) }
        <TableRow ref={ cutRef }/>
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(ValidatorsShineriumTable);
