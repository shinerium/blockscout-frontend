// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, it, expect } from 'vitest';

import * as mocks from '../mocks';
import {
  getContractLabel,
  getFormLabel,
  getOperationDetails,
  getOperationName,
  getPolicyLabel,
  getRewardTypeLabel,
  isProposerReward,
} from './labels';

describe('getRewardTypeLabel', () => {
  it('names the node\'s reward types', () => {
    expect(getRewardTypeLabel('committee').text).toBe('Committee');
    expect(getRewardTypeLabel('poq').text).toBe('PoQ miner');
    expect(getRewardTypeLabel('ecosystem').text).toBe('Ecosystem fund');
    expect(getRewardTypeLabel('support').text).toBe('Support node fund');
  });

  it('passes an unknown type through, in gray, and names a missing one a reward', () => {
    expect(getRewardTypeLabel('bonus')).toMatchObject({ text: 'bonus', color: 'gray' });
    expect(getRewardTypeLabel(null)).toMatchObject({ text: 'Reward', color: 'gray' });
  });
});

describe('isProposerReward', () => {
  it('is a reward whose withdrawal names the member that proposed the carrier', () => {
    expect(isProposerReward('poq')).toBe(true);
    expect(isProposerReward('ecosystem')).toBe(true);
    expect(isProposerReward('support')).toBe(true);
  });

  it('is not a member\'s own reward, nor one of a type not known', () => {
    expect(isProposerReward('committee')).toBe(false);
    expect(isProposerReward('leader')).toBe(false);
    expect(isProposerReward(null)).toBe(false);
  });
});

describe('getFormLabel and getPolicyLabel', () => {
  it('name the known forms and policies', () => {
    expect(getFormLabel('hybrid').text).toBe('Hybrid');
    expect(getFormLabel('envelope').text).toBe('Envelope');
    expect(getPolicyLabel('required').text).toBe('Required');
    expect(getPolicyLabel('pq-only').text).toBe('Post-quantum only');
  });

  it('pass unknown values through', () => {
    expect(getFormLabel('compact').text).toBe('compact');
    expect(getPolicyLabel('strict').text).toBe('strict');
  });
});

describe('getContractLabel', () => {
  it('names the system contracts the backend decodes', () => {
    expect(getContractLabel('bond')).toBe('Validator bond');
    expect(getContractLabel('account_keys')).toBe('Account keys');
    expect(getContractLabel('elsewhere')).toBe('elsewhere');
  });
});

describe('getOperationName', () => {
  it('is the operation\'s name or, unknown, its number', () => {
    expect(getOperationName(mocks.councilVote)).toBe('vote');
    expect(getOperationName({ ...mocks.councilVote, name: null, code: 12 })).toBe('Operation 12');
  });
});

describe('getOperationDetails', () => {
  it('lists what the backend decoded of an operation', () => {
    expect(getOperationDetails(mocks.councilVote)).toBe('proposal 7, yes');
    expect(getOperationDetails(mocks.accountKeyRegistration)).toBe('FN-DSA-512 (pre-standard), policy required');
    expect(getOperationDetails({ ...mocks.councilVote, proposal: null, choice: null, kind: 'transfer', version: 3 })).toBe('transfer, version 3');
  });

  it('is empty for an operation without details', () => {
    expect(getOperationDetails({ ...mocks.councilVote, proposal: null, choice: null })).toBe('');
  });
});
