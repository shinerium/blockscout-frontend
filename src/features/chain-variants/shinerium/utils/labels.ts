// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ShineriumOperation } from '../types/api';

import type { BadgeProps } from 'src/toolkit/chakra/badge';

export interface ShineriumLabel {
  readonly text: string;
  readonly hint: string;
  readonly color: BadgeProps['colorPalette'];
}

const REWARD_TYPES: Readonly<Partial<Record<string, ShineriumLabel>>> = {
  committee: {
    text: 'Committee',
    hint: 'A committee member\'s payment for the epoch: its leader bonus and its share, scaled by its votes',
    color: 'purple',
  },
  leader: { text: 'Leader', hint: 'The share of the member that proposed the block', color: 'purple' },
  poq: { text: 'PoQ miner', hint: 'The share of the epoch\'s Proof-of-Qualification miner', color: 'orange' },
  pq: { text: 'PQ registration', hint: 'A committee node\'s fee for processing post-quantum registrations', color: 'cyan' },
  candidate: { text: 'Candidate', hint: 'The reward of a candidate the Proof of Qualification selected', color: 'gray' },
  ecosystem: { text: 'Ecosystem fund', hint: 'The share of the epoch\'s issue for the ecosystem and development fund', color: 'teal' },
  support: { text: 'Support node fund', hint: 'The share of the epoch\'s issue for the fund that pays RPC and archive nodes', color: 'green' },
};

const FORMS: Readonly<Partial<Record<string, ShineriumLabel>>> = {
  extended: {
    text: 'Extended',
    hint: 'Shinerium\'s version 1 transaction, with metadata, signed with ECDSA alone',
    color: 'gray',
  },
  hybrid: {
    text: 'Hybrid',
    hint: 'Shinerium\'s version 1 transaction, signed with ECDSA and a post-quantum witness',
    color: 'purple',
  },
  envelope: {
    text: 'Envelope',
    hint: 'A wallet\'s Ethereum transaction, unchanged, with a post-quantum witness around it',
    color: 'blue',
  },
};

const POLICIES: Readonly<Partial<Record<string, ShineriumLabel>>> = {
  none: { text: 'None', hint: 'No post-quantum key: ECDSA alone signs the account\'s transactions', color: 'gray' },
  optional: {
    text: 'Optional',
    hint: 'A post-quantum key is registered: a transaction may carry its witness, which is then checked',
    color: 'yellow',
  },
  required: {
    text: 'Required',
    hint: 'Every transaction of the account must carry a witness of its post-quantum key',
    color: 'green',
  },
  'pq-only': { text: 'Post-quantum only', hint: 'A policy reserved for later', color: 'green' },
};

const CONTRACTS: Readonly<Partial<Record<string, string>>> = {
  bond: 'Validator bond',
  registry: 'Binary registry',
  account_keys: 'Account keys',
  council: 'Council',
};

const PROPOSER_REWARD_TYPES: ReadonlySet<string> = new Set([ 'poq', 'ecosystem', 'support' ]);

export const EPOCH_QCS_HINT = 'The quorum certificates of the epoch\'s blocks before its carrier, each carried by the block after it: ' +
  'a quiet epoch of three blocks has two';

export const CREDITED_HINT = 'The certificates the carrier pays the member for: the epoch\'s less its correlated misses, ' +
  'a certificate it did not sign counting as many times as members of its autonomous system did not sign it, at most f + 1';

export const SLOW_HINT = 'The consecutive epochs before this one that found the member slow, its votes reaching most leaders ' +
  'only after they had proposed again. At two it leads no views and may give way to a candidate';

export const VALIDATOR_LOCATION_HINT = 'Where the beacons placed the validator when it joined its latest committee, ' +
  'or what the genesis declares: country, region and autonomous system';

const unknownLabel = (text: string, hint: string): ShineriumLabel => ({ text, hint, color: 'gray' });

export const getRewardTypeLabel = (rewardType: string | null): ShineriumLabel => {
  if (!rewardType) {
    return unknownLabel('Reward', 'A reward the carrier pays for its epoch');
  }

  return REWARD_TYPES[rewardType] ?? unknownLabel(rewardType, 'A reward the carrier pays for its epoch');
};

export const isProposerReward = (rewardType: string | null): boolean => {
  return rewardType !== null && PROPOSER_REWARD_TYPES.has(rewardType);
};

export const getFormLabel = (form: string): ShineriumLabel =>
  FORMS[form] ?? unknownLabel(form, 'The transaction\'s form, as the node names it');

export const getPolicyLabel = (policy: string): ShineriumLabel =>
  POLICIES[policy] ?? unknownLabel(policy, 'The account\'s post-quantum policy, as the node names it');

export const getContractLabel = (contract: string): string => CONTRACTS[contract] ?? contract;

export const getOperationName = (operation: ShineriumOperation): string => operation.name ?? `Operation ${ operation.code }`;

export const getOperationDetails = (operation: ShineriumOperation): string => {
  return [
    operation.proposal !== null ? `proposal ${ operation.proposal }` : null,
    operation.kind,
    operation.choice,
    operation.scheme?.name ?? null,
    operation.policy !== null ? `policy ${ getPolicyLabel(operation.policy).text.toLowerCase() }` : null,
    operation.version !== null ? `version ${ operation.version }` : null,
  ].filter((detail) => detail !== null).join(', ');
};
