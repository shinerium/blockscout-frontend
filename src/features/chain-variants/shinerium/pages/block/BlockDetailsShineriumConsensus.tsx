// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack, VStack } from '@chakra-ui/react';
import React from 'react';

import type { ShineriumCertificate } from 'src/features/chain-variants/shinerium/types/api';

import useApiQuery from 'src/api/hooks/useApiQuery';

import BlockEntity from 'src/slices/block/components/entity/BlockEntity';

import ShineriumValidatorEntity from 'src/features/chain-variants/shinerium/components/ShineriumValidatorEntity';
import { SHINERIUM_BLOCK_CONSENSUS } from 'src/features/chain-variants/shinerium/stubs';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  readonly height: number;
  readonly isLoading: boolean;
}

interface CertificateProps {
  readonly certificate: ShineriumCertificate;
  readonly blockLabel: string;
  readonly blockNumber: number;
  readonly isLoading: boolean;
}

const BlockDetailsShineriumCertificate = ({ certificate, blockLabel, blockNumber, isLoading }: CertificateProps) => {
  const size = certificate.committee_size ?? '?';

  return (
    <VStack alignItems="flex-start" gap={ 2 } w="100%">
      <HStack gap={ 1 } flexWrap="wrap">
        <Skeleton loading={ isLoading }>
          { certificate.signers.length } of { size } members signed, view { certificate.view ?? '-' },
          { ' ' }{ certificate.scheme.name ?? `scheme ${ certificate.scheme.id ?? '-' }` }; { blockLabel }
        </Skeleton>
        <BlockEntity number={ blockNumber } noIcon isLoading={ isLoading }/>
      </HStack>
      <HStack gap={ 3 } flexWrap="wrap">
        { certificate.signers.map((signer) => (
          signer.identity ? (
            <ShineriumValidatorEntity
              key={ signer.index }
              identity={ signer.identity }
              label={ signer.name ?? `Seat ${ signer.index }` }
              noIcon
              noCopy
              isLoading={ isLoading }
            />
          ) : (
            <Skeleton key={ signer.index } loading={ isLoading } color="text.secondary">Seat { signer.index }</Skeleton>
          )
        )) }
      </HStack>
    </VStack>
  );
};

const BlockDetailsShineriumConsensus = ({ height, isLoading }: Props) => {
  const query = useApiQuery('core:shinerium_block_consensus', {
    pathParams: { height_or_hash: String(height) },
    queryOptions: {
      enabled: !isLoading,
      placeholderData: SHINERIUM_BLOCK_CONSENSUS,
    },
  });

  const data = query.data;
  if (query.isError || !data) {
    return null;
  }

  const isDataLoading = isLoading || query.isPlaceholderData;

  return (
    <>
      { data.certificate && (
        <>
          <DetailedInfo.ItemLabel
            hint="The quorum certificate that makes the block certified: the committee members that signed it. The next block carries it"
            isLoading={ isDataLoading }
          >
            Quorum certificate
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <BlockDetailsShineriumCertificate
              certificate={ data.certificate }
              blockLabel="carried by block"
              blockNumber={ data.certificate.carried_by_block_number }
              isLoading={ isDataLoading }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.justify && (
        <>
          <DetailedInfo.ItemLabel
            hint="The quorum certificate of the parent block, which this block carries as its justification"
            isLoading={ isDataLoading }
          >
            Justifies
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <BlockDetailsShineriumCertificate
              certificate={ data.justify }
              blockLabel="certifies block"
              blockNumber={ data.justify.certified_block_number }
              isLoading={ isDataLoading }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }
    </>
  );
};

export default React.memo(BlockDetailsShineriumConsensus);
