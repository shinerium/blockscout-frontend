// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import PageTitle from 'src/shell/page/title/PageTitle';

import TextAd from 'src/features/ads/text/components/TextAd';
import ShineriumValidatorEntity from 'src/features/chain-variants/shinerium/components/ShineriumValidatorEntity';
import { SHINERIUM_VALIDATOR_DETAILED } from 'src/features/chain-variants/shinerium/stubs';

import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import { Heading } from 'src/toolkit/chakra/heading';
import { Tag } from 'src/toolkit/chakra/tag';

import ValidatorShineriumDetails from './ValidatorShineriumDetails';
import ValidatorShineriumEpochs from './ValidatorShineriumEpochs';

const ValidatorShinerium = () => {
  const router = useRouter();
  const id = getQueryParamString(router.query.id);

  const query = useApiQuery('core:shinerium_validator', {
    pathParams: { id },
    queryOptions: { placeholderData: SHINERIUM_VALIDATOR_DETAILED },
  });

  throwOnResourceLoadError(query);

  const isLoading = query.isPlaceholderData;
  const data = query.data;

  const titleSecondRow = data ? (
    <ShineriumValidatorEntity identity={ data.identity } label={ null } isLoading={ isLoading } variant="subheading" noLink/>
  ) : null;

  const titleContentAfter = data?.is_member ? <Tag colorPalette="green" loading={ isLoading }>Committee</Tag> : null;

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ data?.name ?? 'Validator details' }
        contentAfter={ titleContentAfter }
        secondRow={ titleSecondRow }
        isLoading={ isLoading }
      />
      { data && (
        <>
          <ValidatorShineriumDetails data={ data } isLoading={ isLoading }/>
          <Heading level="3" mt={ 8 } mb={ 4 }>Epochs served</Heading>
          <ValidatorShineriumEpochs id={ data.identity } isEnabled={ !isLoading }/>
        </>
      ) }
    </>
  );
};

export default ValidatorShinerium;
