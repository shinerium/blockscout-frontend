// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import PageTitle from 'src/shell/page/title/PageTitle';

import TxsWithFrontendSorting from 'src/slices/tx/pages/index/list/TxsWithFrontendSorting';
import { TX_ITEM } from 'src/slices/tx/stubs/tx';

import TextAd from 'src/features/ads/text/components/TextAd';
import ShineriumMetadataEntity from 'src/features/chain-variants/shinerium/components/ShineriumMetadataEntity';
import { SHINERIUM_METADATA } from 'src/features/chain-variants/shinerium/stubs';
import { getMetadataSections } from 'src/features/chain-variants/shinerium/utils/metadata';

import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import { Heading } from 'src/toolkit/chakra/heading';

import MetadataShineriumDetails from './MetadataShineriumDetails';
import MetadataShineriumPart from './MetadataShineriumPart';

const MetadataShinerium = () => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);

  const query = useApiQuery('core:shinerium_metadata', {
    pathParams: { hash },
    queryOptions: { enabled: Boolean(hash), placeholderData: SHINERIUM_METADATA },
  });

  const txsQuery = useApiPaginatedQuery({
    resourceName: 'core:shinerium_metadata_txs',
    pathParams: { hash },
    options: {
      enabled: Boolean(hash) && !query.isPlaceholderData && Boolean(query.data),
      placeholderData: generateListStub<'core:shinerium_metadata_txs'>(TX_ITEM, 1, { next_page_params: null }),
    },
  });

  throwOnResourceLoadError(query);

  const isLoading = query.isPlaceholderData;
  const data = query.data;
  const sections = React.useMemo(() => data ? getMetadataSections(data) : [], [ data ]);

  const titleSecondRow = <ShineriumMetadataEntity hash={ hash } variant="subheading" noLink noIcon isLoading={ isLoading }/>;

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle title="Metadata details" secondRow={ titleSecondRow } isLoading={ isLoading }/>
      { data && (
        <>
          <MetadataShineriumDetails data={ data } isLoading={ isLoading }/>
          { sections.map((section) => <MetadataShineriumPart key={ section.key } section={ section } isLoading={ isLoading }/>) }
        </>
      ) }
      <Heading level="3" mt={ 8 } mb={ 4 }>Transactions</Heading>
      <TxsWithFrontendSorting query={ txsQuery }/>
    </>
  );
};

export default MetadataShinerium;
