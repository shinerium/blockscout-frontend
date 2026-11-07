// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack, VStack } from '@chakra-ui/react';
import React from 'react';

import type { ShineriumCertificate } from 'src/features/chain-variants/shinerium/types/api';

import useApiQuery from 'src/api/hooks/useApiQuery';

import BlockEntity from 'src/slices/block/components/entity/BlockEntity';

import ShineriumValidatorEntity from 'src/features/chain-variants/shinerium/components/ShineriumValidatorEntity';
import { SHINERIUM_BLOCK_CONSENSUS } from 'src/features/chain-variants/shinerium/stubs';
import { isEpochGenesisCertificate } from 'src/features/chain-variants/shinerium/utils/consensus';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

const CERTIFICATE_HINT = 'The quorum certificate that makes the block certified: the committee members that signed it. The next block carries it';
const CARRIER_CERTIFICATE_HINT = 'A carrier\'s certificates travel in empty blocks above it, which are discarded when its epoch ends. ' +
  'They serve as the next epoch\'s genesis certificate, which the next block names without their signatures';
const JUSTIFY_HINT = 'The quorum certificate of the parent block, which this block carries as its justification';
const EPOCH_START_HINT = 'An epoch\'s first block carries the epoch\'s genesis certificate: the block below it as view 0, ' +
  'without the signatures that made that block final';

interface Props {
  readonly height: number;
  readonly isLoading: boolean;
}

interface CertificateItemProps {
  readonly certificate: ShineriumCertificate;
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

const BlockDetailsShineriumCarrierCertificate = ({ certificate, isLoading }: CertificateItemProps) => (
  <HStack gap={ 1 } flexWrap="wrap">
    <Skeleton loading={ isLoading }>In no block: block</Skeleton>
    <BlockEntity number={ certificate.carried_by_block_number } noIcon isLoading={ isLoading }/>
    <Skeleton loading={ isLoading }>starts epoch { certificate.epoch ?? '-' } on this carrier as its view 0</Skeleton>
  </HStack>
);

const BlockDetailsShineriumEpochStart = ({ certificate, isLoading }: CertificateItemProps) => (
  <HStack gap={ 1 } flexWrap="wrap">
    <Skeleton loading={ isLoading }>The genesis certificate of epoch { certificate.epoch ?? '-' }: block</Skeleton>
    <BlockEntity number={ certificate.certified_block_number } noIcon isLoading={ isLoading }/>
    <Skeleton loading={ isLoading }>as view 0, without signatures</Skeleton>
  </HStack>
);

const BlockDetailsShineriumOwnCertificate = ({ certificate, isLoading }: CertificateItemProps) => {
  const isCarrier = isEpochGenesisCertificate(certificate);

  return (
    <>
      <DetailedInfo.ItemLabel hint={ isCarrier ? CARRIER_CERTIFICATE_HINT : CERTIFICATE_HINT } isLoading={ isLoading }>
        Quorum certificate
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        { isCarrier ? (
          <BlockDetailsShineriumCarrierCertificate certificate={ certificate } isLoading={ isLoading }/>
        ) : (
          <BlockDetailsShineriumCertificate
            certificate={ certificate }
            blockLabel="carried by block"
            blockNumber={ certificate.carried_by_block_number }
            isLoading={ isLoading }
          />
        ) }
      </DetailedInfo.ItemValue>
    </>
  );
};

const BlockDetailsShineriumJustify = ({ certificate, isLoading }: CertificateItemProps) => {
  const isEpochStart = isEpochGenesisCertificate(certificate);

  return (
    <>
      <DetailedInfo.ItemLabel hint={ isEpochStart ? EPOCH_START_HINT : JUSTIFY_HINT } isLoading={ isLoading }>
        Justifies
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        { isEpochStart ? (
          <BlockDetailsShineriumEpochStart certificate={ certificate } isLoading={ isLoading }/>
        ) : (
          <BlockDetailsShineriumCertificate
            certificate={ certificate }
            blockLabel="certifies block"
            blockNumber={ certificate.certified_block_number }
            isLoading={ isLoading }
          />
        ) }
      </DetailedInfo.ItemValue>
    </>
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
      { data.certificate && <BlockDetailsShineriumOwnCertificate certificate={ data.certificate } isLoading={ isDataLoading }/> }
      { data.justify && <BlockDetailsShineriumJustify certificate={ data.justify } isLoading={ isDataLoading }/> }
    </>
  );
};

export default React.memo(BlockDetailsShineriumConsensus);
