// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { ShineriumEpochDetailed } from 'src/features/chain-variants/shinerium/types/api';

import BlockEntity from 'src/slices/block/components/entity/BlockEntity';

import { formatShare, getEpochParticipation } from 'src/features/chain-variants/shinerium/utils/consensus';
import { EPOCH_QCS_HINT } from 'src/features/chain-variants/shinerium/utils/labels';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Truncate } from 'src/toolkit/components/truncation/Truncate';

const QCS_HINT = `${ EPOCH_QCS_HINT }. Signed: the share of the members' possible signatures on them that were given`;

interface Props {
  readonly data: ShineriumEpochDetailed;
  readonly isLoading: boolean;
}

const EpochShineriumDetails = ({ data, isLoading }: Props) => {
  const participation = getEpochParticipation(data.signed, data.qcs, data.members_count);
  const nextFirst = data.next_first === null ? undefined : data.members[data.next_first];

  return (
    <DetailedInfo.Container>
      <DetailedInfo.ItemLabel hint="When the control block that starts the epoch was made" isLoading={ isLoading }>
        Started
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <TimeWithTooltip timestamp={ data.started_at } isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>

      { data.ended_at && (
        <>
          <DetailedInfo.ItemLabel hint="When the control block that ends the epoch was made" isLoading={ isLoading }>
            Ended
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <TimeWithTooltip timestamp={ data.ended_at } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemLabel
        hint="The control block that starts the epoch and seats its committee, by its number and hash"
        isLoading={ isLoading }
      >
        Control block
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue flexWrap="nowrap" columnGap={ 2 }>
        <Skeleton loading={ isLoading } flexShrink={ 0 }>{ data.number }</Skeleton>
        <Box overflow="hidden" color="text.secondary">
          <Truncate value={ data.control_block_hash } loading={ isLoading }/>
        </Box>
        <CopyToClipboard text={ data.control_block_hash } isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>

      { data.carrier_block_number !== null && (
        <>
          <DetailedInfo.ItemLabel hint="The block that carries the epoch's control block" isLoading={ isLoading }>
            Carried by
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <BlockEntity number={ data.carrier_block_number } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.committee_hash && (
        <>
          <DetailedInfo.ItemLabel hint="The hash of the committee the control block seats" isLoading={ isLoading }>
            Committee hash
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue flexWrap="nowrap">
            <Box overflow="hidden">
              <Truncate value={ data.committee_hash } loading={ isLoading }/>
            </Box>
            <CopyToClipboard text={ data.committee_hash } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemLabel hint="The members of the epoch's committee" isLoading={ isLoading }>
        Committee
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isLoading }>{ data.members_count } members</Skeleton>
      </DetailedInfo.ItemValue>

      { data.qcs !== null && (
        <>
          <DetailedInfo.ItemLabel
            hint={ QCS_HINT }
            isLoading={ isLoading }
          >
            Quorum certificates
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading }>
              { data.qcs }, { formatShare(participation) } signed
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.ended_at && (
        <>
          <DetailedInfo.ItemLabel hint="The nodes seated and the members removed when the epoch ended" isLoading={ isLoading }>
            Joined / left
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading }>
              { data.joined_count ?? 0 } / { data.removed_count ?? 0 }
              { data.absent_kept ? `, ${ data.absent_kept } absent but kept` : '' }
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { nextFirst && (
        <>
          <DetailedInfo.ItemLabel hint="The member the next committee starts with" isLoading={ isLoading }>
            Next committee starts with
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading }>
              Seat { nextFirst.index }{ nextFirst.name ? `, ${ nextFirst.name }` : '' }
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }
    </DetailedInfo.Container>
  );
};

export default React.memo(EpochShineriumDetails);
