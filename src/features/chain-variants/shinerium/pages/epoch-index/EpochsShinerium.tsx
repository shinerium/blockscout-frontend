// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import { SHINERIUM_EPOCH } from 'src/features/chain-variants/shinerium/stubs';

import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { generateListStub } from 'src/shared/pagination/utils';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import EpochsShineriumTable from './EpochsShineriumTable';

const EpochsShinerium = () => {
  const { isError, isInitialLoading, isTransitioning, data, pagination, queryHash } = useApiPaginatedQuery({
    resourceName: 'core:shinerium_epochs',
    options: {
      placeholderData: generateListStub<'core:shinerium_epochs'>(SHINERIUM_EPOCH, 50, { next_page_params: null }),
    },
  });

  const actionBar = pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  const content = data?.items ? (
    <TableContainerScrollable>
      <EpochsShineriumTable
        data={ data.items }
        isLoading={ isInitialLoading }
        top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
        resetKey={ queryHash }
      />
    </TableContainerScrollable>
  ) : null;

  return (
    <Box>
      <PageTitle title="Epochs" withTextAd/>
      <DataList
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no epochs."
        actionBar={ actionBar }
        isTransitioning={ isTransitioning }
      >
        { content }
      </DataList>
    </Box>
  );
};

export default EpochsShinerium;
