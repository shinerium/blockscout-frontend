// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import {
  formatBondStatus,
  formatCountOfQcs,
  formatLocation,
  formatRemoval,
  formatShare,
  getCreditedDetails,
  getEpochParticipation,
  getSignedShare,
  getSlowLabel,
  isEpochGenesisCertificate,
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

describe('formatCountOfQcs', () => {
  it('gives a count against the epoch\'s certificates', () => {
    expect(formatCountOfQcs(17, 31)).toBe('17 / 31');
    expect(formatCountOfQcs(0, 31)).toBe('0 / 31');
  });

  it('gives a dash for no count, and for certificates not known', () => {
    expect(formatCountOfQcs(null, 31)).toBe('-');
    expect(formatCountOfQcs(2, null)).toBe('2 / -');
  });
});

describe('getCreditedDetails', () => {
  it('names the certificates and the correlated misses taken from them', () => {
    expect(getCreditedDetails(31, 14)).toBe('31 certificates less 14 correlated misses');
    expect(getCreditedDetails(1, 1)).toBe('1 certificate less 1 correlated miss');
    expect(getCreditedDetails(2, 0)).toBe('2 certificates less 0 correlated misses');
  });

  it('is null without the correlated misses or the certificates', () => {
    expect(getCreditedDetails(31, null)).toBeNull();
    expect(getCreditedDetails(null, 3)).toBeNull();
  });
});

describe('getSlowLabel', () => {
  it('counts the slow epochs, in orange from two, when the member leads no views', () => {
    expect(getSlowLabel(1)).toEqual({ text: '1 epoch', color: 'yellow' });
    expect(getSlowLabel(2)).toEqual({ text: '2 epochs', color: 'orange' });
    expect(getSlowLabel(3)).toEqual({ text: '3 epochs', color: 'orange' });
  });

  it('is null for a member no epoch found slow, or one not known', () => {
    expect(getSlowLabel(0)).toBeNull();
    expect(getSlowLabel(null)).toBeNull();
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

describe('isEpochGenesisCertificate', () => {
  it('is the view 0 on which an epoch starts', () => {
    expect(isEpochGenesisCertificate({ view: 0 })).toBe(true);
  });

  it('is no certificate of a later view, nor one whose view is not known', () => {
    expect(isEpochGenesisCertificate({ view: 1 })).toBe(false);
    expect(isEpochGenesisCertificate({ view: null })).toBe(false);
  });
});
