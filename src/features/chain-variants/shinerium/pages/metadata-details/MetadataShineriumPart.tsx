// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, chakra } from '@chakra-ui/react';
import React from 'react';

import type { MetadataField, MetadataSection } from 'src/features/chain-variants/shinerium/utils/metadata';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';

import { Heading } from 'src/toolkit/chakra/heading';
import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Truncate } from 'src/toolkit/components/truncation/Truncate';

interface Props {
  readonly section: MetadataSection;
  readonly isLoading: boolean;
}

interface ValueProps {
  readonly field: MetadataField;
  readonly isLoading: boolean;
}

const MetadataShineriumValue = ({ field, isLoading }: ValueProps) => {
  switch (field.kind) {
    case 'link':
      return (
        <Link
          href={ field.value }
          external
          rel="noopener noreferrer nofollow ugc"
          loading={ isLoading }
          display="inline"
          wordBreak="break-all"
        >
          { field.value }
        </Link>
      );
    case 'hash':
      return (
        <>
          <Box overflow="hidden">
            <Truncate value={ field.value } loading={ isLoading }/>
          </Box>
          <CopyToClipboard text={ field.value } isLoading={ isLoading }/>
        </>
      );
    case 'long':
      return (
        <Skeleton loading={ isLoading } whiteSpace="pre-wrap" wordBreak="break-word">
          { field.value }
        </Skeleton>
      );
    case 'text':
      return (
        <Skeleton loading={ isLoading } wordBreak="break-word">
          <chakra.span>{ field.value }</chakra.span>
        </Skeleton>
      );
  }
};

const MetadataShineriumPart = ({ section, isLoading }: Props) => {
  return (
    <>
      <Heading level="3" mt={ 8 } mb={ 4 }>{ section.title }</Heading>
      <DetailedInfo.Container templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}>
        { section.fields.map((field) => (
          <React.Fragment key={ field.key }>
            <DetailedInfo.ItemLabel hint={ field.hint } isLoading={ isLoading }>
              { field.label }
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue
              flexWrap={ field.kind === 'hash' ? 'nowrap' : undefined }
              whiteSpace={ field.kind === 'hash' ? undefined : 'normal' }
            >
              <MetadataShineriumValue field={ field } isLoading={ isLoading }/>
            </DetailedInfo.ItemValue>
          </React.Fragment>
        )) }
      </DetailedInfo.Container>
    </>
  );
};

export default React.memo(MetadataShineriumPart);
