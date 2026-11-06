// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { ValidatorsChainType } from 'src/features/validators/types/config';

import PageNextJs from 'src/server/PageNextJs';

import config from 'src/config';

const validatorsFeature = config.features.validators;

const VALIDATORS_PAGES = {
  stability: () => import('src/features/chain-variants/stability/pages/validator-index/ValidatorsStability'),
  blackfort: () => import('src/features/chain-variants/blackfort/pages/validator-index/ValidatorsBlackfort'),
  zilliqa: () => import('src/features/chain-variants/zilliqa/pages/validator-index/ValidatorsZilliqa'),
  shinerium: () => import('src/features/chain-variants/shinerium/pages/validator-index/ValidatorsShinerium'),
} satisfies Record<ValidatorsChainType, () => Promise<{ 'default': React.ComponentType }>>;

const Validators = dynamic(() => {
  if (!validatorsFeature.isEnabled) {
    throw new Error('Validators feature is not enabled.');
  }

  return VALIDATORS_PAGES[validatorsFeature.chainType]();
}, { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/validators">
      <Validators/>
    </PageNextJs>
  );
};

export default Page;

export { validators as getServerSideProps } from 'src/server/getServerSideProps/main';
