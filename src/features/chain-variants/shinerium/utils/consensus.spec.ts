// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import {
  formatBondStatus,
  formatLocation,
  formatRemoval,
  formatShare,
  getEpochParticipation,
  getSignedShare,
  shortenIdentity,
} from './consensus';

describe('formatLocation', () => {
  it('joins the country, the region and the autonomous system', () => {
    expect(formatLocation({ country: 'CA', region: 'Quebec', asn: 16276, source: 'declared' })).toBe('CA · Quebec · AS16276');
  });

  it('leaves out what the beacons did not find', () => {
    expect(formatLocation({ country: 'SG', region: '', asn: 16276 })).toBe('SG · AS16276');
    expect(formatLocation({ country: '', asn: 0 })).toBe('AS0');
  });

  it('is null without a location or anything in it', () => {
    expect(formatLocation(null)).toBeNull();
    expect(formatLocation({ source: 'declared' })).toBeNull();
  });
});

describe('getSignedShare', () => {
  it('is the signatures given against those possible', () => {
    expect(getSignedShare(3, 4)).toBe(0.75);
  });

  it('is null while an epoch runs or when nothing was possible', () => {
    expect(getSignedShare(null, 4)).toBeNull();
    expect(getSignedShare(3, null)).toBeNull();
    expect(getSignedShare(0, 0)).toBeNull();
  });
});

describe('getEpochParticipation', () => {
  it('counts every member against every certificate', () => {
    expect(getEpochParticipation(13, 2, 7)).toBeCloseTo(13 / 14);
  });

  it('is null while the epoch runs', () => {
    expect(getEpochParticipation(null, null, 7)).toBeNull();
  });
});

describe('formatShare', () => {
  it('gives whole percents without decimals and others with one', () => {
    expect(formatShare(1)).toBe('100%');
    expect(formatShare(0.75)).toBe('75%');
    expect(formatShare(13 / 14)).toBe('92.9%');
  });

  it('gives a dash for no share', () => {
    expect(formatShare(null)).toBe('-');
  });
});

describe('formatBondStatus', () => {
  it('capitalises the status and keeps null', () => {
    expect(formatBondStatus('releasable')).toBe('Releasable');
    expect(formatBondStatus(null)).toBeNull();
  });
});

describe('formatRemoval', () => {
  it('names the reason, or gives its code when the explorer does not know it', () => {
    expect(formatRemoval({ code: 2, name: 'offline' })).toBe('Offline');
    expect(formatRemoval({ code: 13, name: null })).toBe('Reason 13');
  });
});

describe('shortenIdentity', () => {
  it('keeps the start and the end of the key', () => {
    expect(shortenIdentity('0x7a8c7e56b6d2741a685511134b3e7e44c7a044784566e2c84e91816a730ea791')).toBe('0x7a8c7e56…730ea791');
  });
});
