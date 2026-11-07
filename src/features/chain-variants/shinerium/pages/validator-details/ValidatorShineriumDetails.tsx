// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { ShineriumValidatorDetailed } from 'src/features/chain-variants/shinerium/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';

import ShineriumEpochEntity from 'src/features/chain-variants/shinerium/components/ShineriumEpochEntity';
import { formatLocation, formatShare, getSignedShare } from 'src/features/chain-variants/shinerium/utils/consensus';
import { VALIDATOR_LOCATION_HINT } from 'src/features/chain-variants/shinerium/utils/labels';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Truncate } from 'src/toolkit/components/truncation/Truncate';

import ValidatorShineriumBond from './ValidatorShineriumBond';
import ValidatorShineriumPenalty from './ValidatorShineriumPenalty';

interface Props {
  readonly data: ShineriumValidatorDetailed;
  readonly isLoading: boolean;
}

interface HashItemProps {
  readonly label: string;
  readonly hint: string;
  readonly value: string;
  readonly isLoading: boolean;
}

const HashItem = ({ label, hint, value, isLoading }: HashItemProps) => (
  <>
    <DetailedInfo.ItemLabel hint={ hint } isLoading={ isLoading }>{ label }</DetailedInfo.ItemLabel>
    <DetailedInfo.ItemValue flexWrap="nowrap">
      <Flex overflow="hidden">
        <Truncate value={ value } loading={ isLoading }/>
      </Flex>
      <CopyToClipboard text={ value } isLoading={ isLoading }/>
    </DetailedInfo.ItemValue>
  </>
);

const ValidatorShineriumService = ({ data, isLoading }: Props) => (
  <>
    <DetailedInfo.ItemLabel hint="The epochs in whose committee the validator sat" isLoading={ isLoading }>
      Epochs served
    </DetailedInfo.ItemLabel>
    <DetailedInfo.ItemValue columnGap={ 1 }>
      <Skeleton loading={ isLoading }>{ data.epochs }</Skeleton>
      { data.first_epoch !== null && data.last_epoch !== null && (
        <>
          <Skeleton loading={ isLoading } color="text.secondary">, from</Skeleton>
          <ShineriumEpochEntity number={ data.first_epoch } noIcon isLoading={ isLoading }/>
          <Skeleton loading={ isLoading } color="text.secondary">to</Skeleton>
          <ShineriumEpochEntity number={ data.last_epoch } noIcon isLoading={ isLoading }/>
        </>
      ) }
    </DetailedInfo.ItemValue>

    <DetailedInfo.ItemLabel hint={ VALIDATOR_LOCATION_HINT } isLoading={ isLoading }>
      Location
    </DetailedInfo.ItemLabel>
    <DetailedInfo.ItemValue columnGap={ 1 }>
      <Skeleton loading={ isLoading }>{ formatLocation(data.location) ?? '-' }</Skeleton>
      { data.location_epoch !== null && (
        <>
          <Skeleton loading={ isLoading } color="text.secondary">, in epoch</Skeleton>
          <ShineriumEpochEntity number={ data.location_epoch } noIcon isLoading={ isLoading }/>
        </>
      ) }
    </DetailedInfo.ItemValue>

    <DetailedInfo.ItemLabel hint="The quorum certificates it signed, against those of the ended epochs it served" isLoading={ isLoading }>
      Signed
    </DetailedInfo.ItemLabel>
    <DetailedInfo.ItemValue>
      <Skeleton loading={ isLoading }>
        { data.signed === null ? '-' : `${ data.signed } of ${ data.qcs ?? '-' } (${ formatShare(getSignedShare(data.signed, data.qcs)) })` }
      </Skeleton>
    </DetailedInfo.ItemValue>

    <DetailedInfo.ItemLabel hint="The committee rewards paid to it, one for each ended epoch it served" isLoading={ isLoading }>
      Rewards
    </DetailedInfo.ItemLabel>
    <DetailedInfo.ItemValue columnGap={ 2 }>
      { data.rewards_total ? <NativeCoinValue amount={ data.rewards_total } loading={ isLoading }/> : '-' }
      { data.rewards_count > 0 && (
        <Skeleton loading={ isLoading } color="text.secondary">
          in { data.rewards_count } { data.rewards_count === 1 ? 'epoch' : 'epochs' }
        </Skeleton>
      ) }
    </DetailedInfo.ItemValue>
  </>
);

const ValidatorShineriumDetails = ({ data, isLoading }: Props) => {
  return (
    <DetailedInfo.Container templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}>
      <DetailedInfo.ItemLabel hint="The address of the validator's Ed25519 identity key" isLoading={ isLoading }>
        Identity address
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <AddressEntity address={{ hash: data.ed_address_hash }} isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>

      <ValidatorShineriumBond data={ data } isLoading={ isLoading }/>
      <ValidatorShineriumPenalty data={ data } isLoading={ isLoading }/>

      <DetailedInfo.ItemDivider/>

      <ValidatorShineriumService data={ data } isLoading={ isLoading }/>

      { data.bls_hash && (
        <HashItem label="BLS key hash" hint="The Keccak-256 hash of its BLS voting key" value={ data.bls_hash } isLoading={ isLoading }/>
      ) }

      { data.pq_hash && (
        <HashItem
          label="Post-quantum key hash"
          hint="The hash of the ML-DSA-44 key bound to its identity"
          value={ data.pq_hash }
          isLoading={ isLoading }
        />
      ) }

      { data.bond_block_number !== null && (
        <>
          <DetailedInfo.ItemLabel hint="The block the bond was read at" isLoading={ isLoading }>Read at</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <BlockEntity number={ data.bond_block_number } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }
    </DetailedInfo.Container>
  );
};

export default React.memo(ValidatorShineriumDetails);
