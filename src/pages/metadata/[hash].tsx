// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

const MetadataShinerium = dynamic(
  () => import('src/features/chain-variants/shinerium/pages/metadata-details/MetadataShinerium'),
  { ssr: false },
);

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/metadata/[hash]" query={ props.query }>
      <MetadataShinerium/>
    </PageNextJs>
  );
};

export default Page;

export { shineriumMetadata as getServerSideProps } from 'src/server/getServerSideProps/main';
