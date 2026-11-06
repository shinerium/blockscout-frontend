// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import config from 'src/config';

const Epochs = dynamic(() => {
  if (config.features.shinerium.isEnabled) {
    return import('src/features/chain-variants/shinerium/pages/epoch-index/EpochsShinerium');
  }

  return import('src/features/chain-variants/celo/pages/epoch-index/Epochs');
}, { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/epochs">
      <Epochs/>
    </PageNextJs>
  );
};

export default Page;

export { epochs as getServerSideProps } from 'src/server/getServerSideProps/main';
