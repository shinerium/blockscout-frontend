// SPDX-License-Identifier: LicenseRef-Blockscout

import { capitalize } from 'es-toolkit';

import type { ShineriumCertificate, ShineriumLocation, ShineriumRemoval } from '../types/api';

export const formatLocation = (location: ShineriumLocation | null): string | null => {
  if (!location) {
    return null;
  }

  const parts = [ location.country, location.region, typeof location.asn === 'number' ? `AS${ location.asn }` : undefined ]
    .filter((part): part is string => typeof part === 'string' && part !== '');

  return parts.length > 0 ? parts.join(' · ') : null;
};

export const getSignedShare = (signed: number | null, possible: number | null): number | null => {
  if (signed === null || possible === null || possible === 0) {
    return null;
  }

  return signed / possible;
};

export const getEpochParticipation = (signed: number | null, qcs: number | null, membersCount: number): number | null => {
  return getSignedShare(signed, qcs === null ? null : qcs * membersCount);
};

export const formatShare = (share: number | null): string => {
  if (share === null) {
    return '-';
  }

  const percent = share * 100;
  return `${ Number.isInteger(percent) ? percent : percent.toFixed(1) }%`;
};

export const formatBondStatus = (status: string | null): string | null => {
  return status ? capitalize(status) : null;
};

export const formatRemoval = (removal: ShineriumRemoval): string => {
  return removal.name ? capitalize(removal.name) : `Reason ${ removal.code }`;
};

export const isEpochGenesisCertificate = (certificate: Pick<ShineriumCertificate, 'view'>): boolean => {
  return certificate.view === 0;
};

export const shortenIdentity = (identity: string): string => {
  return `${ identity.slice(0, 10) }…${ identity.slice(-8) }`;
};
