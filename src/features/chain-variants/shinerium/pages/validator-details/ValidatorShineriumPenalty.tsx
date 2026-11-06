// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ShineriumPenaltyBox, ShineriumValidatorDetailed } from 'src/features/chain-variants/shinerium/types/api';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tag } from 'src/toolkit/chakra/tag';

const PENALTY_BOX_HINT = 'The penalty box, in the epoch of the block the bond was read at: a member removed as absent ' +
  'or too slow waits there before it may take a seat again';

interface Props {
  readonly data: ShineriumValidatorDetailed;
  readonly isLoading: boolean;
}

const pluralize = (count: number, one: string, many: string): string => `${ count } ${ count === 1 ? one : many }`;

const describePenaltyBox = (box: ShineriumPenaltyBox): string => {
  const strikes = pluralize(box.strikes ?? 0, 'strike', 'strikes');
  const reason = box.reason_name ? `, ${ box.reason_name }` : '';
  const since = box.since === null ? '' : `, since epoch ${ box.since }`;
  return strikes + reason + since;
};

const ValidatorShineriumPenalty = ({ data, isLoading }: Props) => {
  const box = data.penalty_box;
  const hasStrikes = box !== null && box.strikes !== null && box.strikes > 0;

  return (
    <>
      { data.penalty && (
        <>
          <DetailedInfo.ItemLabel hint="The penalty of a forced exit" isLoading={ isLoading }>Penalty</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue columnGap={ 2 }>
            <Skeleton loading={ isLoading }>{ data.penalty.reason ?? '-' }</Skeleton>
            { data.penalty.active && <Tag colorPalette="red" loading={ isLoading }>Active</Tag> }
            { data.penalty.requires_rebond && <Tag loading={ isLoading }>Requires a new bond</Tag> }
          </DetailedInfo.ItemValue>
        </>
      ) }

      { box && hasStrikes && (
        <>
          <DetailedInfo.ItemLabel hint={ PENALTY_BOX_HINT } isLoading={ isLoading }>Penalty box</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue columnGap={ 2 }>
            <Skeleton loading={ isLoading }>{ describePenaltyBox(box) }</Skeleton>
            { box.active && (
              <Tag colorPalette="orange" loading={ isLoading }>
                Held{ box.epochs_left ? `, ${ pluralize(box.epochs_left, 'epoch', 'epochs') } left` : '' }
              </Tag>
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }
    </>
  );
};

export default React.memo(ValidatorShineriumPenalty);
