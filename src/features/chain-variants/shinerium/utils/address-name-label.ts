// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';

export interface AddressNameLabel {
  readonly label: string;
  readonly hint: string;
}

const ACCOUNT_NAME: AddressNameLabel = {
  label: 'Account name',
  hint: 'The account\'s name: a genesis allocation\'s label, or the name of an account of the protocol',
};

const VALIDATOR_NAME: AddressNameLabel = {
  label: 'Validator name',
  hint: 'The name of the validator',
};

export const getAddressNameLabel = (): AddressNameLabel => (config.features.shinerium.isEnabled ? ACCOUNT_NAME : VALIDATOR_NAME);
