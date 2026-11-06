// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ShineriumValidatorDetailed } from 'src/features/chain-variants/shinerium/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';

import { formatBondStatus } from 'src/features/chain-variants/shinerium/utils/consensus';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tag } from 'src/toolkit/chakra/tag';

interface Props {
  readonly data: ShineriumValidatorDetailed;
  readonly isLoading: boolean;
}

const ValidatorShineriumBondAmount = ({ data, isLoading }: Props) => {
  if (!data.amount) {
    return null;
  }

  const hasShortfall = data.shortfall !== null && data.shortfall !== '0';

  return (
    <>
      <DetailedInfo.ItemLabel hint="The bond's amount, and the collateral in force" isLoading={ isLoading }>
        Bonded
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue columnGap={ 2 }>
        <NativeCoinValue amount={ data.amount } accuracy={ 0 } loading={ isLoading }/>
        { data.required && (
          <Skeleton loading={ isLoading } color="text.secondary" display="inline-flex" columnGap={ 1 }>
            of <NativeCoinValue amount={ data.required } accuracy={ 0 } noSymbol/> required
          </Skeleton>
        ) }
        { hasShortfall && data.shortfall && (
          <Tag colorPalette="orange" loading={ isLoading }>
            Short by <NativeCoinValue amount={ data.shortfall } accuracy={ 0 } noSymbol/>
          </Tag>
        ) }
      </DetailedInfo.ItemValue>
    </>
  );
};

const ValidatorShineriumBond = ({ data, isLoading }: Props) => {
  const status = formatBondStatus(data.status);

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="The bond's status as the node read it; empty until a node that serves shn_getValidator has been asked"
        isLoading={ isLoading }
      >
        Bond
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue columnGap={ 2 }>
        { status ? (
          <>
            <Skeleton loading={ isLoading }>{ status }</Skeleton>
            { data.genesis && <Tag loading={ isLoading }>Genesis</Tag> }
            { data.forced_exit && <Tag colorPalette="red" loading={ isLoading }>Forced exit</Tag> }
          </>
        ) : <Skeleton loading={ isLoading } color="text.secondary">Not read yet</Skeleton> }
      </DetailedInfo.ItemValue>

      <ValidatorShineriumBondAmount data={ data } isLoading={ isLoading }/>

      { data.bond_owner_hash && (
        <>
          <DetailedInfo.ItemLabel hint="The account that owns the bond" isLoading={ isLoading }>Bond owner</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <AddressEntity address={{ hash: data.bond_owner_hash }} isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.refund_address_hash && (
        <>
          <DetailedInfo.ItemLabel hint="Where the bond goes when it is released" isLoading={ isLoading }>
            Refund address
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <AddressEntity address={{ hash: data.refund_address_hash }} isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.active_at !== null && data.active_at > 0 && (
        <>
          <DetailedInfo.ItemLabel hint="The block from which the bond is active" isLoading={ isLoading }>
            Active from
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <BlockEntity number={ data.active_at } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.release_at && (
        <>
          <DetailedInfo.ItemLabel hint="When the bond's release delay ends" isLoading={ isLoading }>Release</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <TimeWithTooltip timestamp={ data.release_at } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }
    </>
  );
};

export default React.memo(ValidatorShineriumBond);
