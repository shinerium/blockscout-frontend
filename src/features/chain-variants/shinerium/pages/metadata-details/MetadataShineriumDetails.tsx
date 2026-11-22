// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ShineriumMetadata } from 'src/features/chain-variants/shinerium/types/api';

import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

import { Alert } from 'src/toolkit/chakra/alert';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  readonly data: ShineriumMetadata;
  readonly isLoading: boolean;
}

const MetadataShineriumDetails = ({ data, isLoading }: Props) => {
  const first = data.first_transaction;

  return (
    <>
      { !data.read_from_node && (
        <Alert status="warning" mb={ 6 } loading={ isLoading }>
          The node did not give the metadata of this hash just now. The transactions below carry it; try again later.
        </Alert>
      ) }
      <DetailedInfo.Container templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}>
        <DetailedInfo.ItemLabel
          hint="How many transactions carry this metadata hash. The hash commits to the metadata, so every one of them carries the same fields"
          isLoading={ isLoading }
        >
          Transactions
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <Skeleton loading={ isLoading }>{ data.transactions_count.toLocaleString() }</Skeleton>
        </DetailedInfo.ItemValue>

        <DetailedInfo.ItemLabel
          hint="The first transaction that carries the hash; the explorer reads the metadata from it"
          isLoading={ isLoading }
        >
          First transaction
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <TxEntity hash={ first.hash } isLoading={ isLoading } noIcon/>
        </DetailedInfo.ItemValue>

        { first.block_number !== null && (
          <>
            <DetailedInfo.ItemLabel hint="The block of the first transaction, and its time" isLoading={ isLoading }>
              First block
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue columnGap={ 2 }>
              <BlockEntity number={ first.block_number } isLoading={ isLoading } noIcon/>
              { first.timestamp && <TimeWithTooltip timestamp={ first.timestamp } isLoading={ isLoading } color="text.secondary"/> }
            </DetailedInfo.ItemValue>
          </>
        ) }
      </DetailedInfo.Container>
    </>
  );
};

export default React.memo(MetadataShineriumDetails);
