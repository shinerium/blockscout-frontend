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
  readonly epoch: number | null;
  readonly view: number | null;
  readonly justify: ShineriumBlockJustify | null;
}

export interface ShineriumBlockJustify {
  readonly epoch: number;
  readonly view: number;
  readonly scheme: number;
  readonly signers_count: number;
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

export type ShineriumLocation = Readonly<Record<string, unknown>>;

export interface ShineriumRemoval {
  readonly code: number;
  readonly name: string | null;
}

export interface ShineriumEpoch {
  readonly number: number;
  readonly control_block_hash: string;
  readonly committee_hash: string | null;
  readonly started_at: string;
  readonly ended_at: string | null;
  readonly carrier_block_number: number | null;
  readonly first_block_number: number;
  readonly end_block_number: number | null;
  readonly members_count: number;
  readonly qcs: number | null;
  readonly signed: number | null;
  readonly absent_kept: number | null;
  readonly joined_count: number | null;
  readonly removed_count: number | null;
  readonly is_current: boolean;
}

export interface ShineriumEpochMember {
  readonly index: number;
  readonly identity: string;
  readonly ed_address_hash: string;
  readonly name: string | null;
  readonly coinbase_hash: string | null;
  readonly pq_key_hash: string | null;
  readonly location: ShineriumLocation | null;
  readonly signed: number | null;
  readonly removal: ShineriumRemoval | null;
  readonly reward: string | null;
}

export interface ShineriumJoinedNode {
  readonly identity: string | null;
  readonly ed_address_hash: string | null;
  readonly coinbase_hash: string | null;
  readonly pq_key_hash: string | null;
  readonly location: ShineriumLocation | null;
}

export interface ShineriumEpochDetailed extends ShineriumEpoch {
  readonly next_first: number | null;
  readonly members: Array<ShineriumEpochMember>;
  readonly joined: Array<ShineriumJoinedNode> | null;
}

export interface ShineriumEpochsResponse {
  readonly items: Array<ShineriumEpoch>;
  readonly next_page_params: { readonly number: number } | null;
}

export interface ShineriumValidator {
  readonly identity: string;
  readonly ed_address_hash: string;
  readonly name: string | null;
  readonly status: string | null;
  readonly genesis: boolean | null;
  readonly amount: string | null;
  readonly is_member: boolean;
  readonly epochs: number;
  readonly first_epoch: number | null;
  readonly last_epoch: number | null;
  readonly signed: number | null;
  readonly qcs: number | null;
  readonly rewards_total: string | null;
  readonly rewards_count: number;
}

export interface ShineriumPenalty {
  readonly reason: string | null;
  readonly active: boolean | null;
  readonly awaiting_removal: boolean | null;
  readonly until: string | null;
  readonly requires_rebond: boolean | null;
}

export interface ShineriumPenaltyBox {
  readonly seat_from: number | null;
  readonly since: number | null;
  readonly strikes: number | null;
  readonly reason: number | null;
  readonly reason_name: string | null;
  readonly active: boolean | null;
  readonly epochs_left: number | null;
}

export interface ShineriumValidatorDetailed extends ShineriumValidator {
  readonly bond_owner_hash: string | null;
  readonly refund_address_hash: string | null;
  readonly bls_hash: string | null;
  readonly pq_hash: string | null;
  readonly active_at: number | null;
  readonly exiting: boolean | null;
  readonly release_at: string | null;
  readonly forced_exit: boolean | null;
  readonly required: string | null;
  readonly shortfall: string | null;
  readonly penalty: ShineriumPenalty | null;
  readonly penalty_box: ShineriumPenaltyBox | null;
  readonly bond_block_number: number | null;
}

export interface ShineriumValidatorsResponse {
  readonly items: Array<ShineriumValidator>;
  readonly next_page_params: null;
}

export interface ShineriumValidatorEpoch {
  readonly epoch_number: number;
  readonly index: number;
  readonly started_at: string;
  readonly ended_at: string | null;
  readonly signed: number | null;
  readonly qcs: number | null;
  readonly removal: ShineriumRemoval | null;
  readonly reward: string | null;
}

export interface ShineriumValidatorEpochsResponse {
  readonly items: Array<ShineriumValidatorEpoch>;
  readonly next_page_params: { readonly number: number } | null;
}

export interface ShineriumCertificateSigner {
  readonly index: number;
  readonly identity: string | null;
  readonly ed_address_hash: string | null;
  readonly name: string | null;
}

export interface ShineriumCertificate {
  readonly certified_block_number: number;
  readonly certified_block_hash: string;
  readonly carried_by_block_number: number;
  readonly carried_by_block_hash: string;
  readonly epoch: number | null;
  readonly view: number | null;
  readonly scheme: { readonly id: number | null; readonly name: string | null };
  readonly committee_size: number | null;
  readonly signers: Array<ShineriumCertificateSigner>;
}

export interface ShineriumBlockConsensus {
  readonly epoch: number | null;
  readonly view: number | null;
  readonly justify: ShineriumCertificate | null;
  readonly certificate: ShineriumCertificate | null;
}
