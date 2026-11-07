// SPDX-License-Identifier: LicenseRef-Blockscout

import type {
  ShineriumAccount,
  ShineriumBlockConsensus,
  ShineriumEpoch,
  ShineriumEpochDetailed,
  ShineriumValidator,
  ShineriumValidatorDetailed,
  ShineriumValidatorEpoch,
} from './types/api';

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

export const SHINERIUM_EPOCH: ShineriumEpoch = {
  number: 287,
  control_block_hash: '0xb12eb66cc51f43c2b794a8d8f6a01f907f336cc2711577acf9fdb1cbc73f7f19',
  committee_hash: '0x3f0c7fde01d44fc6de342ac29d65391ed19775829a8ef8501d48e8ecf6f805af',
  started_at: '2026-11-06T15:28:11.000000Z',
  ended_at: '2026-11-06T15:38:11.000000Z',
  carrier_block_number: 3507,
  first_block_number: 3508,
  end_block_number: 3510,
  members_count: 7,
  qcs: 2,
  signed: 14,
  absent_kept: 0,
  joined_count: 0,
  removed_count: 0,
  is_current: false,
};

export const SHINERIUM_EPOCH_DETAILED: ShineriumEpochDetailed = {
  ...SHINERIUM_EPOCH,
  next_first: 1,
  members: [
    {
      index: 0,
      identity: '0x7a8c7e56b6d2741a685511134b3e7e44c7a044784566e2c84e91816a730ea791',
      ed_address_hash: '0x62adbfea805c0baf48b88a9e8c011dae7e450765',
      name: 'SCM01',
      coinbase_hash: '0x0b5f7268a8081e9b871c902b3bd968443b3fa173',
      pq_key_hash: '0xf985fb7c937d6d126f35ab9a07e2bb848ab90aa8760e1ee66cfe3640d383f3b1',
      location: { country: 'CA', region: 'Quebec', asn: 16276, source: 'declared' },
      signed: 2,
      correlated: 0,
      credited: 2,
      slow: 0,
      removal: null,
      reward: '15219100281300000000',
    },
  ],
  joined: [],
};

export const SHINERIUM_VALIDATOR: ShineriumValidator = {
  identity: '0x7a8c7e56b6d2741a685511134b3e7e44c7a044784566e2c84e91816a730ea791',
  ed_address_hash: '0x62adbfea805c0baf48b88a9e8c011dae7e450765',
  name: 'SCM01',
  status: 'active',
  genesis: true,
  amount: '100000000000000000000000',
  is_member: true,
  epochs: 288,
  first_epoch: 0,
  last_epoch: 287,
  signed: 574,
  qcs: 574,
  rewards_total: '4383100000000000000000',
  rewards_count: 287,
  location: { country: 'CA', region: 'Quebec', asn: 16276, source: 'declared' },
  location_epoch: 287,
};

export const SHINERIUM_VALIDATOR_DETAILED: ShineriumValidatorDetailed = {
  ...SHINERIUM_VALIDATOR,
  bond_owner_hash: '0xb67a9585b0d8b6d3b1b8e7e5a2a9d6f1c3e4b5a6',
  refund_address_hash: '0xb67a9585b0d8b6d3b1b8e7e5a2a9d6f1c3e4b5a6',
  bls_hash: '0x5c7ddae5401b6e3a9c166009009ff49ed2317a986c9643a10376c9f93fd6cad2',
  pq_hash: '0xf985fb7c937d6d126f35ab9a07e2bb848ab90aa8760e1ee66cfe3640d383f3b1',
  active_at: 0,
  exiting: false,
  release_at: null,
  forced_exit: false,
  required: '100000000000000000000000',
  shortfall: '0',
  penalty: null,
  penalty_box: null,
  bond_block_number: 3510,
};

export const SHINERIUM_VALIDATOR_EPOCH: ShineriumValidatorEpoch = {
  epoch_number: 287,
  index: 0,
  started_at: '2026-11-06T15:28:11.000000Z',
  ended_at: '2026-11-06T15:38:11.000000Z',
  signed: 2,
  qcs: 2,
  correlated: 0,
  credited: 2,
  slow: 0,
  removal: null,
  reward: '15219100281300000000',
};

export const SHINERIUM_BLOCK_CONSENSUS: ShineriumBlockConsensus = {
  epoch: 287,
  view: 4106,
  justify: null,
  certificate: null,
};
