// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ShineriumAccount } from './types/api';

export const SHINERIUM_ACCOUNT: ShineriumAccount = {
  account_key: {
    policy: 'required',
    scheme: { id: 32, name: 'FN-DSA-512 (pre-standard)' },
    version: 1,
    changed_at_block: 0,
    key_hash: '0x5c7ddae5401b6e3a9c166009009ff49ed2317a986c9643a10376c9f93fd6cad2',
    verifiable: true,
  },
  vesting: {
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
  },
};
