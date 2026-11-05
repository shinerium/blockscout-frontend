// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, it, expect } from 'vitest';

import * as mocks from '../mocks';
import {
  formatVestingStep,
  getBlockEpoch,
  getShineriumBlock,
  getShineriumTransaction,
  getShineriumWithdrawal,
  hasAccountKey,
  hasVesting,
  isCarrier,
} from './shinerium-data';

describe('getShineriumBlock', () => {
  it('reads the shinerium object of a block', () => {
    expect(getShineriumBlock({ height: 622, shinerium: mocks.carrierBlock })).toBe(mocks.carrierBlock);
  });

  it('gives nothing for a block of another chain', () => {
    expect(getShineriumBlock({ height: 622 })).toBeUndefined();
  });

  it('gives nothing when the field is no object', () => {
    expect(getShineriumBlock({ height: 622, shinerium: null })).toBeUndefined();
    expect(getShineriumBlock({ height: 622, shinerium: 'control' })).toBeUndefined();
  });
});

describe('getShineriumTransaction and getShineriumWithdrawal', () => {
  it('read their shinerium objects', () => {
    expect(getShineriumTransaction({ hash: '0x1', shinerium: mocks.hybridTransaction })).toBe(mocks.hybridTransaction);
    expect(getShineriumWithdrawal({ index: 1313, shinerium: mocks.supportFundReward })).toBe(mocks.supportFundReward);
    expect(getShineriumTransaction({ hash: '0x1' })).toBeUndefined();
    expect(getShineriumWithdrawal({ index: 1313 })).toBeUndefined();
  });
});

describe('isCarrier', () => {
  it('is true only for a block of type control', () => {
    expect(isCarrier(mocks.carrierBlock)).toBe(true);
    expect(isCarrier(mocks.normalBlock)).toBe(false);
    expect(isCarrier({ ...mocks.normalBlock, block_type: null })).toBe(false);
  });
});

describe('getBlockEpoch', () => {
  it('is the control block a block names', () => {
    expect(getBlockEpoch(mocks.normalBlock)).toBe(146);
  });

  it('is the epoch a carrier ends, not the one whose control block it carries', () => {
    expect(getBlockEpoch(mocks.carrierBlock)).toBe(145);
  });

  it('is unknown without a control block, and for a carrier of control block 0', () => {
    expect(getBlockEpoch({ ...mocks.normalBlock, control_block_number: null })).toBeNull();
    expect(getBlockEpoch({ ...mocks.carrierBlock, control_block_number: 0 })).toBeNull();
  });
});

describe('hasAccountKey', () => {
  it('is true for a key, or for a policy without one', () => {
    expect(hasAccountKey(mocks.requiredKey)).toBe(true);
    expect(hasAccountKey({ ...mocks.noKey, policy: 'optional' })).toBe(true);
  });

  it('is false for an account the policy none leaves without a key', () => {
    expect(hasAccountKey(mocks.noKey)).toBe(false);
  });
});

describe('hasVesting', () => {
  it('is true for a vesting record, a time lock or a locked part', () => {
    expect(hasVesting(mocks.poolVesting)).toBe(true);
    expect(hasVesting({ ...mocks.noVesting, locked_until: '2027-11-04T15:30:00Z' })).toBe(true);
    expect(hasVesting({ ...mocks.noVesting, locked: '1' })).toBe(true);
  });

  it('is false for an account that can spend all of its balance', () => {
    expect(hasVesting(mocks.noVesting)).toBe(false);
    expect(hasVesting({ ...mocks.noVesting, locked: null })).toBe(false);
  });
});

describe('formatVestingStep', () => {
  it('names a step of whole days in days', () => {
    expect(formatVestingStep(2592000)).toBe('Every 30 days');
    expect(formatVestingStep(31536000)).toBe('Every 365 days');
    expect(formatVestingStep(86400)).toBe('Every day');
  });

  it('names any other step in seconds, and step 0 continuous', () => {
    expect(formatVestingStep(3600)).toBe('Every 3600 seconds');
    expect(formatVestingStep(0)).toBe('Continuous');
  });
});
