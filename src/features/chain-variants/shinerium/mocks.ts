// SPDX-License-Identifier: LicenseRef-Blockscout

import type {
  ShineriumAccount,
  ShineriumAccountKey,
  ShineriumBlock,
  ShineriumOperation,
  ShineriumTransaction,
  ShineriumVesting,
  ShineriumWithdrawal,
} from './types/api';

export const carrierBlock: ShineriumBlock = {
  block_type: 'control',
  control_block_number: 146,
  control_block_hash: '0xfd3577ee83c9b68ecf723f17d60ca39d7e962c42786740cfd9723c37d2093910',
  reward: '106504526120904992701',
  total_supply: '200022264189437159723050887',
  block_access_list_hash: '0x5a38a00785025d473ab26047c0333b39f83fb9fbb17f53dbf01fc287697e953b',
  poq_miner_hash: null,
  anchor_chain_hash: null,
};

export const normalBlock: ShineriumBlock = {
  ...carrierBlock,
  block_type: 'normal',
  reward: '0',
  block_access_list_hash: '0xc549df9e6b2760960677f8bdf039dc7a7810c59124b2ae59015781070980527d',
};

export const councilVote: ShineriumOperation = {
  contract: 'council',
  code: 2,
  name: 'vote',
  identity: null,
  proposal: 7,
  kind: null,
  choice: 'yes',
  scheme: null,
  policy: null,
  binary: null,
  version: null,
};

export const accountKeyRegistration: ShineriumOperation = {
  contract: 'account_keys',
  code: 1,
  name: 'register',
  identity: null,
  proposal: null,
  kind: null,
  choice: null,
  scheme: { id: 32, name: 'FN-DSA-512 (pre-standard)' },
  policy: 'required',
  binary: null,
  version: null,
};

export const hybridTransaction: ShineriumTransaction = {
  version: 1,
  form: 'hybrid',
  pq_scheme: { id: 32, name: 'FN-DSA-512 (pre-standard)' },
  pq_sender_hash: null,
  metadata_hash: null,
  operation: null,
};

export const extendedTransaction: ShineriumTransaction = {
  version: 1,
  form: 'extended',
  pq_scheme: null,
  pq_sender_hash: null,
  metadata_hash: '0x9b2c6e4b7d1a3f5e8c0d2a4b6c8e0f1a3b5c7d9e1f2a4b6c8d0e2f4a6b8c0d2e',
  operation: null,
};

export const ethereumTransaction: ShineriumTransaction = {
  version: 0,
  form: null,
  pq_scheme: null,
  pq_sender_hash: null,
  metadata_hash: null,
  operation: null,
};

export const committeeReward: ShineriumWithdrawal = {
  reward_type: 'committee',
  validator_hash: '0x6c6851263fe8bc189f4acc9bdafedac072105853',
};

export const supportFundReward: ShineriumWithdrawal = {
  reward_type: 'support',
  validator_hash: '0xbbd21108aee91fdb34833f0f33c7bfa7dc5233f1',
};

export const requiredKey: ShineriumAccountKey = {
  policy: 'required',
  scheme: { id: 32, name: 'FN-DSA-512 (pre-standard)' },
  version: 1,
  changed_at_block: 0,
  key_hash: '0x5c7ddae5401b6e3a9c166009009ff49ed2317a986c9643a10376c9f93fd6cad2',
  verifiable: true,
};

export const noKey: ShineriumAccountKey = {
  policy: 'none',
  scheme: null,
  version: 0,
  changed_at_block: 0,
  key_hash: null,
  verifiable: false,
};

export const poolVesting: ShineriumVesting = {
  locked_until: '2032-10-14T15:30:00Z',
  wholly_locked: false,
  locked: '7990000000000000000000000',
  spendable: '10000000000000000000000',
  vested: '0',
  next_vest: '2028-12-04T15:30:00Z',
  record: {
    amount: '7990000000000000000000000',
    start: '2028-11-04T15:30:00Z',
    cliff: '2028-11-04T15:30:00Z',
    end: '2032-10-14T15:30:00Z',
    step: 2592000,
    pool: true,
  },
};

export const noVesting: ShineriumVesting = {
  locked_until: null,
  wholly_locked: false,
  locked: '0',
  spendable: '2227525552327423013235',
  vested: null,
  next_vest: null,
  record: null,
};

export const grantPoolAccount: ShineriumAccount = { account_key: requiredKey, vesting: poolVesting };

export const plainAccount: ShineriumAccount = { account_key: noKey, vesting: noVesting };
