// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';

import { Truncate } from 'src/toolkit/components/truncation/Truncate';

import { getShineriumBlock } from '../../utils/shinerium-data';

interface Props {
  readonly block: schemas['BlockResponse'];
}

interface HashRowProps {
  readonly label: string;
  readonly hint: string;
  readonly hash: string;
}

const HashRow = ({ label, hint, hash }: HashRowProps) => (
  <>
    <DetailedInfo.ItemLabel hint={ hint }>
      { label }
    </DetailedInfo.ItemLabel>
    <DetailedInfo.ItemValue flexWrap="nowrap">
      <Box overflow="hidden">
        <Truncate value={ hash }/>
      </Box>
      <CopyToClipboard text={ hash }/>
    </DetailedInfo.ItemValue>
  </>
);

const BlockDetailsShineriumHashes = ({ block }: Props) => {
  const data = getShineriumBlock(block);

  if (!data) {
    return null;
  }

  return (
    <>
      { data.block_access_list_hash && (
        <HashRow
          label="Access list hash"
          hint="The hash of the block's access list (EIP-7928), which its header commits to"
          hash={ data.block_access_list_hash }
        />
      ) }
      { data.anchor_chain_hash && (
        <HashRow
          label="Anchor chain hash"
          hint="The anchor chain's hash that the block's header holds"
          hash={ data.anchor_chain_hash }
        />
      ) }
    </>
  );
};

export default React.memo(BlockDetailsShineriumHashes);
