// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import PageTitle from 'src/shell/page/title/PageTitle';

import BlockEntity from 'src/slices/block/components/entity/BlockEntity';

import TextAd from 'src/features/ads/text/components/TextAd';
import { SHINERIUM_EPOCH_DETAILED } from 'src/features/chain-variants/shinerium/stubs';

import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import { Heading } from 'src/toolkit/chakra/heading';
import { Tag } from 'src/toolkit/chakra/tag';

import EpochShineriumDetails from './EpochShineriumDetails';
import EpochShineriumJoined from './EpochShineriumJoined';
import EpochShineriumMembers from './EpochShineriumMembers';

const EpochShinerium = () => {
  const router = useRouter();
  const number = getQueryParamString(router.query.number);

  const query = useApiQuery('core:shinerium_epoch', {
    pathParams: { number },
    queryOptions: { placeholderData: SHINERIUM_EPOCH_DETAILED },
  });

  throwOnResourceLoadError(query);

  const isLoading = query.isPlaceholderData;
  const data = query.data;

  const titleSecondRow = data ? (
    <HStack textStyle={{ base: 'heading.sm', lg: 'heading.md' }} flexWrap="wrap">
      <Box color="text.secondary">Blocks</Box>
      <BlockEntity number={ data.first_block_number } variant="subheading" isLoading={ isLoading }/>
      { data.end_block_number !== null && (
        <>
          <Box color="text.secondary">to</Box>
          <BlockEntity number={ data.end_block_number } variant="subheading" isLoading={ isLoading }/>
        </>
      ) }
    </HStack>
  ) : null;

  const titleContentAfter = data?.is_current ? <Tag colorPalette="green" loading={ isLoading }>Running</Tag> : null;

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ `Epoch #${ number }` }
        contentAfter={ titleContentAfter }
        secondRow={ titleSecondRow }
        isLoading={ isLoading }
      />
      { data && (
        <>
          <EpochShineriumDetails data={ data } isLoading={ isLoading }/>
          <Heading level="3" mt={ 8 } mb={ 4 }>Committee</Heading>
          <EpochShineriumMembers data={ data } isLoading={ isLoading }/>
          { data.joined && data.joined.length > 0 && (
            <>
              <Heading level="3" mt={ 8 } mb={ 4 }>Joining at its end</Heading>
              <EpochShineriumJoined data={ data.joined } isLoading={ isLoading }/>
            </>
          ) }
        </>
      ) }
    </>
  );
};

export default EpochShinerium;
