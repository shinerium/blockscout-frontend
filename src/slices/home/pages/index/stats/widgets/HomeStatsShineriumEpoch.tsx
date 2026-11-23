// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import ShineriumEpochProgress from 'src/features/chain-variants/shinerium/components/ShineriumEpochProgress';
import { SHINERIUM_EPOCH_PROGRESS } from 'src/features/chain-variants/shinerium/stubs';
import { getEpochProgressHint } from 'src/features/chain-variants/shinerium/utils/epoch-progress';

import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { SECOND } from 'src/toolkit/utils/consts';
import { mdash } from 'src/toolkit/utils/htmlEntities';

import HomeStatsWidget from '../HomeStatsWidget';

const EPOCH_PROGRESS_REFETCH_INTERVAL = 20 * SECOND;

const HomeStatsShineriumEpoch = () => {
  const query = useApiQuery('core:shinerium_epoch_progress', {
    queryOptions: {
      placeholderData: SHINERIUM_EPOCH_PROGRESS,
      refetchInterval: (query) => query.state.status === 'error' ? false : EPOCH_PROGRESS_REFETCH_INTERVAL,
    },
  });

  const { data } = query;

  const hint = React.useMemo(() => {
    return data ? getEpochProgressHint(data).map((line) => <Box key={ line }>{ line }</Box>) : null;
  }, [ data ]);

  if (query.isError || !data) {
    return <HomeStatsWidget label="Epoch" icon="hourglass" value={ mdash } isFallback/>;
  }

  return (
    <Tooltip content={ hint } disabled={ query.isPlaceholderData }>
      <HomeStatsWidget
        label="Epoch"
        icon="hourglass"
        value={ (
          <Flex flexWrap="wrap" alignItems="center" columnGap={ 3 } rowGap={ 1 } w="100%">
            <chakra.span>{ data.number }</chakra.span>
            <ShineriumEpochProgress progress={ data.progress } flexGrow={ 1 } minW={{ base: '132px', lg: '168px' }}/>
          </Flex>
        ) }
        href={ data.is_stored ? { pathname: '/epochs/[number]', query: { number: String(data.number) } } : { pathname: '/epochs' } }
        isLoading={ query.isPlaceholderData }
      />
    </Tooltip>
  );
};

export default React.memo(HomeStatsShineriumEpoch);
