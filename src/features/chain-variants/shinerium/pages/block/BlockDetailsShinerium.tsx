// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Truncate } from 'src/toolkit/components/truncation/Truncate';

import { getBlockEpoch, getShineriumBlock, isCarrier } from '../../utils/shinerium-data';

const COMMITTEE_REWARD_HINT = 'What this carrier pays for the epoch\'s validation: the committee members\' shares and ' +
  'the Proof-of-Qualification miner\'s. The funds\' shares come on top';

interface Props {
  readonly block: schemas['BlockResponse'];
  readonly isLoading: boolean;
}

const BlockDetailsShinerium = ({ block, isLoading }: Props) => {
  const data = getShineriumBlock(block);

  if (!data) {
    return null;
  }

  const epoch = getBlockEpoch(data);
  const isCarrierBlock = isCarrier(data);
  const reward = isCarrierBlock && data.reward && data.reward !== '0' ? data.reward : null;

  return (
    <>
      { epoch !== null && (
        <>
          <DetailedInfo.ItemLabel
            hint="The epoch the block belongs to: the number of the control block that seats the epoch's committee"
            isLoading={ isLoading }
          >
            Epoch
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading }>{ epoch }</Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.control_block_number !== null && (
        <>
          <DetailedInfo.ItemLabel
            hint={ isCarrierBlock ?
              'The control block this carrier carries, which starts the next epoch' :
              'The control block of the block\'s epoch' }
            isLoading={ isLoading }
          >
            Control block
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue flexWrap="nowrap" columnGap={ 2 }>
            <Skeleton loading={ isLoading } flexShrink={ 0 }>{ data.control_block_number }</Skeleton>
            { data.control_block_hash && (
              <>
                <Box overflow="hidden" color="text.secondary">
                  <Truncate value={ data.control_block_hash } loading={ isLoading }/>
                </Box>
                <CopyToClipboard text={ data.control_block_hash } isLoading={ isLoading }/>
              </>
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }

      { reward && (
        <>
          <DetailedInfo.ItemLabel
            hint={ COMMITTEE_REWARD_HINT }
            isLoading={ isLoading }
          >
            Committee reward
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <NativeCoinValue amount={ reward } accuracy={ 0 } loading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.total_supply && (
        <>
          <DetailedInfo.ItemLabel
            hint="The supply after this block, as its header gives it"
            isLoading={ isLoading }
          >
            Total supply
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <NativeCoinValue amount={ data.total_supply } loading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.poq_miner_hash && (
        <>
          <DetailedInfo.ItemLabel
            hint="The epoch's Proof-of-Qualification miner"
            isLoading={ isLoading }
          >
            PoQ miner
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <AddressEntity address={{ hash: data.poq_miner_hash }} isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }
    </>
  );
};

export default React.memo(BlockDetailsShinerium);
