// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, chakra, HStack } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ShineriumTransaction } from 'src/features/chain-variants/shinerium/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';

import { Badge } from 'src/toolkit/chakra/badge';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { Truncate } from 'src/toolkit/components/truncation/Truncate';

import { getContractLabel, getFormLabel, getOperationDetails, getOperationName } from '../../utils/labels';
import { getShineriumTransaction } from '../../utils/shinerium-data';

interface Props {
  readonly tx: schemas['TransactionResponse'];
  readonly isLoading: boolean;
}

interface ContentProps {
  readonly data: ShineriumTransaction;
  readonly isLoading: boolean;
}

const TxDetailsShineriumContent = ({ data, isLoading }: ContentProps) => {
  const form = data.form ? getFormLabel(data.form) : null;
  const operationDetails = data.operation ? getOperationDetails(data.operation) : '';
  const operationHash = data.operation?.identity ?? data.operation?.binary ?? null;

  return (
    <>
      { form && (
        <>
          <DetailedInfo.ItemLabel
            hint="The transaction's Shinerium form and, with a post-quantum witness, the witness's signature scheme"
            isLoading={ isLoading }
          >
            Signature
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue columnGap={ 2 }>
            <Tooltip content={ form.hint }>
              <Badge colorPalette={ form.color } loading={ isLoading }>{ form.text }</Badge>
            </Tooltip>
            { data.pq_scheme && (
              <Skeleton loading={ isLoading }>{ data.pq_scheme.name }</Skeleton>
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.pq_sender_hash && (
        <>
          <DetailedInfo.ItemLabel
            hint="The post-quantum sender the node names for the transaction"
            isLoading={ isLoading }
          >
            PQ sender
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <AddressEntity address={{ hash: data.pq_sender_hash }} isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.metadata_hash && (
        <>
          <DetailedInfo.ItemLabel
            hint="The hash of the metadata an extended transaction carries"
            isLoading={ isLoading }
          >
            Metadata hash
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue flexWrap="nowrap">
            <Box overflow="hidden">
              <Truncate value={ data.metadata_hash } loading={ isLoading }/>
            </Box>
            <CopyToClipboard text={ data.metadata_hash } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.operation && (
        <>
          <DetailedInfo.ItemLabel
            hint="The operation the transaction asks of a Shinerium system contract, decoded from its input"
            isLoading={ isLoading }
          >
            Operation
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue multiRow columnGap={ 2 }>
            <Badge loading={ isLoading }>{ getContractLabel(data.operation.contract) }</Badge>
            <Skeleton loading={ isLoading } fontWeight="semibold">{ getOperationName(data.operation) }</Skeleton>
            { operationDetails && (
              <Skeleton loading={ isLoading } color="text.secondary">{ operationDetails }</Skeleton>
            ) }
            { operationHash && (
              <HStack gap={ 0 } minW={ 0 } maxW="100%">
                <chakra.span color="text.secondary" flexShrink={ 0 } mr={ 1 }>
                  { data.operation.identity ? 'identity' : 'binary' }
                </chakra.span>
                <Box overflow="hidden">
                  <Truncate value={ operationHash } loading={ isLoading }/>
                </Box>
                <CopyToClipboard text={ operationHash } isLoading={ isLoading }/>
              </HStack>
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }
    </>
  );
};

const TxDetailsShinerium = ({ tx, isLoading }: Props) => {
  const data = getShineriumTransaction(tx);

  return data ? <TxDetailsShineriumContent data={ data } isLoading={ isLoading }/> : null;
};

export default React.memo(TxDetailsShinerium);
