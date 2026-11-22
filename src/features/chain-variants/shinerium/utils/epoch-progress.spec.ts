// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, it, expect } from 'vitest';

import { getEpochDiamonds, getEpochProgressHint, getEpochProgressPercent } from './epoch-progress';

describe('getEpochDiamonds', () => {
  it('marks the twelfths behind as done, the one in progress as current, the rest as upcoming', () => {
    expect(getEpochDiamonds(0.4, 12)).toEqual([
      'done', 'done', 'done', 'done', 'current',
      'upcoming', 'upcoming', 'upcoming', 'upcoming', 'upcoming', 'upcoming', 'upcoming',
    ]);
  });

  it('starts an epoch with the first diamond in progress', () => {
    expect(getEpochDiamonds(0, 4)).toEqual([ 'current', 'upcoming', 'upcoming', 'upcoming' ]);
  });

  it('fills every diamond once the epoch is complete, and keeps out-of-range values inside the strip', () => {
    expect(getEpochDiamonds(1, 4)).toEqual([ 'done', 'done', 'done', 'done' ]);
    expect(getEpochDiamonds(1.7, 3)).toEqual([ 'done', 'done', 'done' ]);
    expect(getEpochDiamonds(-0.2, 3)).toEqual([ 'current', 'upcoming', 'upcoming' ]);
  });
});

describe('getEpochProgressPercent', () => {
  it('rounds down, so an epoch shows 100% only when it is complete', () => {
    expect(getEpochProgressPercent(0.3965)).toBe(39);
    expect(getEpochProgressPercent(0.9999)).toBe(99);
    expect(getEpochProgressPercent(1)).toBe(100);
  });
});

describe('getEpochProgressHint', () => {
  it('names both bounds and how far the epoch is along each', () => {
    expect(getEpochProgressHint({ number: 2786, blocks: 203, max_blocks: 512, seconds: 95, max_seconds: 600, progress: 0.3965 })).toEqual([
      'Epoch 2786 is 39% through: 203 of 512 blocks, 95 of 600 seconds.',
      'An epoch ends at 512 blocks or after 600 seconds, whichever comes first.',
    ]);
  });

  it('never counts past a bound while the next epoch is not known yet', () => {
    const [ first ] = getEpochProgressHint({ number: 7, blocks: 530, max_blocks: 512, seconds: 610, max_seconds: 600, progress: 1 });
    expect(first).toBe('Epoch 7 is 100% through: 512 of 512 blocks, 600 of 600 seconds.');
  });
});
