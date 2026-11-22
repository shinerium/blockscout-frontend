// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ShineriumMetadata } from '../types/api';

import { describe, it, expect } from 'vitest';

import { getMetadataSections, isWebAddress } from './metadata';

const NO_PARTS: Pick<ShineriumMetadata, 'metadata' | 'identity' | 'security' | 'iso20022'> = {
  metadata: null,
  identity: null,
  security: null,
  iso20022: null,
};

const BASE: ShineriumMetadata = {
  metadata_hash: '0x37e7dbb1f631d894bd75930267f12765298ead5e3db586823fee2867a403efbe',
  transactions_count: 1,
  first_transaction: {
    hash: '0xd30d0a2f942cf8b5323f4e80cad0f959738cf3218e9b9340c06a74b5104c5ed5',
    block_number: 144359,
    timestamp: '2026-11-22T14:04:51.000000Z',
  },
  read_from_node: true,
  ...NO_PARTS,
};

const REFERENCES = {
  ipfs: 'Qm7HvQPGYim878Ykzg94cEgw4T8SCh1M5YtteqxwT3i2yv',
  url: 'https://docs.example.org/buvjnn/24c17771903c3351',
  note: 'Delivery of order 186742',
  device_id: 'c7352bc3-3901-424e-836e-9b831e7fc0e7',
  server: 'https://erp.example.org/r2',
  off_chain_key: 'order-186742',
  location: null,
  origin_app: null,
  source_system: null,
};

describe('isWebAddress', () => {
  it('takes http and https addresses', () => {
    expect(isWebAddress('https://docs.example.org/a')).toBe(true);
    expect(isWebAddress('http://erp.example.org')).toBe(true);
  });

  it('refuses other schemes and text that is no address', () => {
    expect(isWebAddress('javascript:alert(1)')).toBe(false);
    expect(isWebAddress('data:text/html,hi')).toBe(false);
    expect(isWebAddress('ipfs://Qm7HvQPGYim878Ykzg94cEgw4T8SCh1M5YtteqxwT3i2yv')).toBe(false);
    expect(isWebAddress('docs.example.org')).toBe(false);
  });
});

describe('getMetadataSections', () => {
  it('gives the fields a part has, in the node\'s order, the web addresses as links', () => {
    const [ section, ...rest ] = getMetadataSections({ ...BASE, metadata: REFERENCES });

    expect(rest).toHaveLength(0);
    expect(section.title).toBe('Metadata');
    expect(section.fields.map(({ label, kind }) => [ label, kind ])).toEqual([
      [ 'IPFS', 'hash' ],
      [ 'URL', 'link' ],
      [ 'Note', 'long' ],
      [ 'Device ID', 'hash' ],
      [ 'Server', 'link' ],
      [ 'Off-chain key', 'hash' ],
    ]);
    expect(section.fields[1].value).toBe('https://docs.example.org/buvjnn/24c17771903c3351');
  });

  it('shows an address that is not on the web as text', () => {
    const [ section ] = getMetadataSections({
      ...BASE,
      metadata: { ...REFERENCES, url: 'javascript:alert(1)', server: null },
    });

    expect(section.fields.find(({ key }) => key === 'url')?.kind).toBe('text');
    expect(section.fields.some(({ key }) => key === 'server')).toBe(false);
  });

  it('gives the parts in the node\'s order, and leaves out a part without a field', () => {
    const sections = getMetadataSections({
      ...BASE,
      iso20022: {
        type: 'SWIFT',
        tx_type: null,
        msg_id: '1e74c26f-88f3-4bf5-b49e-1b4919621247',
        reference: 'SCT-2026-62195048',
        creditor_hash: 'b64901d274cc1d1026bba6727f4e73f4afefa3f0cb4c4acf57bda706d8380bd0',
      },
      security: {
        hash_proof: '0xc40e014e4fd1bdfb277195576649412a8c4e17d3b00d66459688281ab2401d33',
        pub_key_proof: null,
        encryption_key: null,
        verification_key: null,
        attestation: null,
      },
      identity: { type: null, did: null, vc: null, biometric_hash: null, id_proof_cid: null },
    });

    expect(sections.map(({ title }) => title)).toEqual([ 'Security', 'ISO 20022' ]);
    expect(sections[1].fields.map(({ label }) => label)).toEqual([ 'Payment type', 'Message ID', 'Reference', 'Creditor hash' ]);
  });

  it('gives nothing when the node gave no metadata', () => {
    expect(getMetadataSections({ ...BASE, read_from_node: false })).toEqual([]);
  });
});
