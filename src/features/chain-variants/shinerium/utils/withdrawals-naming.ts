// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';

export interface WithdrawalsNaming {
  readonly title: string;
  readonly singular: string;
  readonly plural: string;
  readonly processed: string;
  readonly moved: string;
  readonly blockHint: string;
}

const REWARDS: WithdrawalsNaming = {
  title: 'Rewards',
  singular: 'reward',
  plural: 'rewards',
  processed: 'paid',
  moved: 'issued',
  blockHint: 'The number of rewards the carrier pays for the epoch it ends',
};

const WITHDRAWALS: WithdrawalsNaming = {
  title: 'Withdrawals',
  singular: 'withdrawal',
  plural: 'withdrawals',
  processed: 'processed',
  moved: 'withdrawn',
  blockHint: 'The number of beacon withdrawals in the block',
};

export const getWithdrawalsNaming = (): WithdrawalsNaming => (config.features.shinerium.isEnabled ? REWARDS : WITHDRAWALS);
