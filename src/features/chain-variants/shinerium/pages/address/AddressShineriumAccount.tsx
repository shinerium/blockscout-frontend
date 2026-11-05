// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { ShineriumAccountKey, ShineriumVesting } from 'src/features/chain-variants/shinerium/types/api';

import useApiQuery from 'src/api/hooks/useApiQuery';

import BlockEntity from 'src/slices/block/components/entity/BlockEntity';

import config from 'src/config';
import Time from 'src/shared/date-and-time/Time';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import * as DetailedInfoItemBreakdown from 'src/shared/detailed-info/DetailedInfoItemBreakdown';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';
import TextSeparator from 'src/shared/texts/TextSeparator';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Badge } from 'src/toolkit/chakra/badge';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { Truncate } from 'src/toolkit/components/truncation/Truncate';

import { SHINERIUM_ACCOUNT } from '../../stubs';
import { getPolicyLabel } from '../../utils/labels';
import { formatVestingStep, hasAccountKey, hasVesting } from '../../utils/shinerium-data';

interface KeyProps {
  readonly data: ShineriumAccountKey;
  readonly isLoading: boolean;
}

const AddressShineriumKey = ({ data, isLoading }: KeyProps) => {
  const policy = getPolicyLabel(data.policy);

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="The account's post-quantum key and policy, which the account keys contract keeps"
        isLoading={ isLoading }
      >
        Post-quantum key
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow columnGap={ 2 }>
        <Tooltip content={ policy.hint }>
          <Badge colorPalette={ policy.color } loading={ isLoading }>{ policy.text }</Badge>
        </Tooltip>
        { data.scheme && <Skeleton loading={ isLoading }>{ data.scheme.name }</Skeleton> }
        { data.key_hash && (
          <DetailedInfoItemBreakdown.Container loading={ isLoading }>
            <DetailedInfoItemBreakdown.Row label="Key hash" hint="The hash of the key's scheme and public key">
              <Flex alignItems="center" overflow="hidden">
                <Truncate value={ data.key_hash }/>
                <CopyToClipboard text={ data.key_hash }/>
              </Flex>
            </DetailedInfoItemBreakdown.Row>
            <DetailedInfoItemBreakdown.Row label="Last change" hint="The block of the last change of the account's key or policy">
              <BlockEntity number={ data.changed_at_block } noIcon/>
            </DetailedInfoItemBreakdown.Row>
            <DetailedInfoItemBreakdown.Row label="Version" hint="The number of changes of the account's key and policy">
              <span>{ data.version }</span>
            </DetailedInfoItemBreakdown.Row>
            { !data.verifiable && (
              <DetailedInfoItemBreakdown.Row label="Verifies" hint="Whether a witness by this key verifies in the next block">
                <span>No: the key's scheme is retired</span>
              </DetailedInfoItemBreakdown.Row>
            ) }
          </DetailedInfoItemBreakdown.Container>
        ) }
      </DetailedInfo.ItemValue>
    </>
  );
};

interface VestingProps {
  readonly data: ShineriumVesting;
}

const AddressShineriumVesting = ({ data }: VestingProps) => {
  const { record } = data;

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="The part of the account's balance that is locked until it vests, as the node computes it at the latest block"
      >
        Vesting
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow columnGap={ 1 }>
        <NativeCoinValue amount={ data.locked ?? '0' }/>
        <span>locked</span>
        <TextSeparator/>
        <NativeCoinValue amount={ data.spendable ?? '0' }/>
        <span>spendable</span>
        { record?.pool && (
          <Tooltip content="A grant pool: its locked part falls with each grant it gives">
            <Badge colorPalette="teal" ml={ 2 }>Grant pool</Badge>
          </Tooltip>
        ) }
        { (record || data.locked_until) && (
          <DetailedInfoItemBreakdown.Container>
            { record && (
              <>
                <DetailedInfoItemBreakdown.Row label="Vested" hint="What has vested of the record's amount">
                  <Flex columnGap={ 1 } flexWrap="wrap">
                    <NativeCoinValue amount={ data.vested ?? '0' }/>
                    <span>of</span>
                    <NativeCoinValue amount={ record.amount }/>
                  </Flex>
                </DetailedInfoItemBreakdown.Row>
                { data.next_vest && (
                  <DetailedInfoItemBreakdown.Row label="Next vesting" hint="When the next part vests">
                    <Time timestamp={ data.next_vest }/>
                  </DetailedInfoItemBreakdown.Row>
                ) }
                { record.start && (
                  <DetailedInfoItemBreakdown.Row label="Start" hint="Where the vesting schedule starts">
                    <Time timestamp={ record.start }/>
                  </DetailedInfoItemBreakdown.Row>
                ) }
                { record.cliff && (
                  <DetailedInfoItemBreakdown.Row label="Cliff" hint="Nothing vests before the cliff">
                    <Time timestamp={ record.cliff }/>
                  </DetailedInfoItemBreakdown.Row>
                ) }
                { record.end && (
                  <DetailedInfoItemBreakdown.Row label="End" hint="All of the amount has vested at the end">
                    <Time timestamp={ record.end }/>
                  </DetailedInfoItemBreakdown.Row>
                ) }
                <DetailedInfoItemBreakdown.Row label="Steps" hint="How often a part vests between the cliff and the end">
                  <span>{ formatVestingStep(record.step) }</span>
                </DetailedInfoItemBreakdown.Row>
              </>
            ) }
            { !record && data.locked_until && (
              <DetailedInfoItemBreakdown.Row label="Locked until" hint="The end of the account's time lock">
                <Time timestamp={ data.locked_until }/>
              </DetailedInfoItemBreakdown.Row>
            ) }
          </DetailedInfoItemBreakdown.Container>
        ) }
      </DetailedInfo.ItemValue>
    </>
  );
};

interface Props {
  readonly addressHash: string;
  readonly isContract: boolean;
  readonly isLoading: boolean;
}

const AddressShineriumAccount = ({ addressHash, isContract, isLoading }: Props) => {
  const query = useApiQuery('core:address_shinerium_account', {
    pathParams: { hash: addressHash },
    queryOptions: {
      enabled: config.features.shinerium.isEnabled && Boolean(addressHash),
      placeholderData: SHINERIUM_ACCOUNT,
    },
  });

  if (!config.features.shinerium.isEnabled || query.isError || !query.data) {
    return null;
  }

  const { account_key: accountKey, vesting } = query.data;
  const isPlaceholder = isLoading || query.isPlaceholderData;

  return (
    <>
      { accountKey && (hasAccountKey(accountKey) || !isContract) && (
        <AddressShineriumKey data={ accountKey } isLoading={ isPlaceholder }/>
      ) }
      { !isPlaceholder && vesting && hasVesting(vesting) && <AddressShineriumVesting data={ vesting }/> }
    </>
  );
};

export default React.memo(AddressShineriumAccount);
