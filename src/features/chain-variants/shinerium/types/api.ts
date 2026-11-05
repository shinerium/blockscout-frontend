// SPDX-License-Identifier: LicenseRef-Blockscout

export interface ShineriumPqScheme {
  readonly id: number;
  readonly name: string;
}

export interface ShineriumBlock {
  readonly block_type: string | null;
  readonly control_block_number: number | null;
  readonly control_block_hash: string | null;
  readonly reward: string | null;
  readonly total_supply: string | null;
  readonly block_access_list_hash: string | null;
  readonly poq_miner_hash: string | null;
  readonly anchor_chain_hash: string | null;
}

export interface ShineriumOperation {
  readonly contract: string;
  readonly code: number;
  readonly name: string | null;
  readonly identity: string | null;
  readonly proposal: number | null;
  readonly kind: string | null;
  readonly choice: string | null;
  readonly scheme: ShineriumPqScheme | null;
  readonly policy: string | null;
  readonly binary: string | null;
  readonly version: number | null;
}

export interface ShineriumTransaction {
  readonly version: number | null;
  readonly form: string | null;
  readonly pq_scheme: ShineriumPqScheme | null;
  readonly pq_sender_hash: string | null;
  readonly metadata_hash: string | null;
  readonly operation: ShineriumOperation | null;
}

export interface ShineriumWithdrawal {
  readonly reward_type: string | null;
  readonly validator_hash: string | null;
}

export interface ShineriumAccountKey {
  readonly policy: string;
  readonly scheme: ShineriumPqScheme | null;
  readonly version: number;
  readonly changed_at_block: number;
  readonly key_hash: string | null;
  readonly verifiable: boolean;
}

export interface ShineriumVestingRecord {
  readonly amount: string;
  readonly start: string | null;
  readonly cliff: string | null;
  readonly end: string | null;
  readonly step: number;
  readonly pool: boolean;
}

export interface ShineriumVesting {
  readonly locked_until: string | null;
  readonly wholly_locked: boolean;
  readonly locked: string | null;
  readonly spendable: string | null;
  readonly vested: string | null;
  readonly next_vest: string | null;
  readonly record: ShineriumVestingRecord | null;
}

export interface ShineriumAccount {
  readonly account_key: ShineriumAccountKey | null;
  readonly vesting: ShineriumVesting | null;
}
