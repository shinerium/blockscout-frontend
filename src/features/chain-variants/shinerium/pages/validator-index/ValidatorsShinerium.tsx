// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import PageTitle from 'src/shell/page/title/PageTitle';

import { SHINERIUM_VALIDATOR } from 'src/features/chain-variants/shinerium/stubs';

import DataList from 'src/shared/lists/DataList';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { generateListStub } from 'src/shared/pagination/utils';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import ValidatorsShineriumTable from './ValidatorsShineriumTable';

const ValidatorsShinerium = () => {
  const { isError, isInitialLoading, isTransitioning, data, queryHash } = useApiPaginatedQuery({
    resourceName: 'core:shinerium_validators',
    options: {
      placeholderData: generateListStub<'core:shinerium_validators'>(SHINERIUM_VALIDATOR, 7, { next_page_params: null }),
    },
  });

  const content = data?.items ? (
    <TableContainerScrollable>
      <ValidatorsShineriumTable data={ data.items } isLoading={ isInitialLoading } resetKey={ queryHash }/>
    </TableContainerScrollable>
  ) : null;

  return (
    <Box>
      <PageTitle title="Validators" withTextAd/>
      <DataList
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no validators."
        isTransitioning={ isTransitioning }
      >
        { content }
      </DataList>
    </Box>
  );
};

export default ValidatorsShinerium;
