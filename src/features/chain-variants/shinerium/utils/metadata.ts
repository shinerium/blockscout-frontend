// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ShineriumMetadata } from '../types/api';

export type MetadataPart = 'metadata' | 'identity' | 'security' | 'iso20022';

export type MetadataFieldKind = 'link' | 'hash' | 'long' | 'text';

export interface MetadataField {
  readonly key: string;
  readonly label: string;
  readonly hint: string;
  readonly value: string;
  readonly kind: MetadataFieldKind;
}

export interface MetadataSection {
  readonly key: MetadataPart;
  readonly title: string;
  readonly hint: string;
  readonly fields: Array<MetadataField>;
}

interface FieldSpec {
  readonly label: string;
  readonly hint: string;
  readonly kind: MetadataFieldKind;
}

interface SectionSpec {
  readonly title: string;
  readonly hint: string;
  readonly fields: Readonly<Record<string, FieldSpec>>;
}

const SECTIONS: Readonly<Record<MetadataPart, SectionSpec>> = {
  metadata: {
    title: 'Metadata',
    hint: 'References to data off the chain',
    fields: {
      ipfs: { label: 'IPFS', hint: 'An IPFS content identifier (CID) the transaction refers to', kind: 'hash' },
      url: { label: 'URL', hint: 'An external address the transaction refers to, up to 512 characters', kind: 'link' },
      note: { label: 'Note', hint: 'A free text note, up to 256 characters', kind: 'long' },
      device_id: { label: 'Device ID', hint: 'The device that made the transaction', kind: 'hash' },
      server: { label: 'Server', hint: 'The base address of an external system, such as a FHIR server', kind: 'link' },
      off_chain_key: { label: 'Off-chain key', hint: 'The key of a record in an external database', kind: 'hash' },
      location: { label: 'Location', hint: 'The physical or logical place the transaction came from', kind: 'text' },
      origin_app: { label: 'Origin app', hint: 'The application, or its version, that made the transaction', kind: 'text' },
      source_system: { label: 'Source system', hint: 'The system the transaction came from, such as an ERP', kind: 'text' },
    },
  },
  identity: {
    title: 'Identity',
    hint: 'A digital identity the transaction names',
    fields: {
      type: { label: 'Type', hint: 'The kind of identity, such as DID', kind: 'text' },
      did: { label: 'DID', hint: 'A decentralised identifier', kind: 'hash' },
      vc: { label: 'Verifiable credential', hint: 'A verifiable credential, as a JWT', kind: 'hash' },
      biometric_hash: {
        label: 'Biometric hash',
        hint: 'A hash of biometric data; the data itself is not on the chain',
        kind: 'hash',
      },
      id_proof_cid: { label: 'Proof document', hint: 'The IPFS content identifier of an identity proof document', kind: 'hash' },
    },
  },
  security: {
    title: 'Security',
    hint: 'Proofs and keys the transaction carries',
    fields: {
      hash_proof: { label: 'Hash proof', hint: 'A 32-byte hash the transaction commits to', kind: 'hash' },
      pub_key_proof: { label: 'Public key proof', hint: 'A public key the transaction names', kind: 'hash' },
      encryption_key: { label: 'Encryption key', hint: 'A key for encrypted content, such as an IPFS key', kind: 'hash' },
      verification_key: {
        label: 'Verification key',
        hint: 'A key that verifies a zero-knowledge proof or a credential',
        kind: 'hash',
      },
      attestation: { label: 'Attestation', hint: 'A signature of a notary or an oracle', kind: 'hash' },
    },
  },
  iso20022: {
    title: 'ISO 20022',
    hint: 'A payment message reference, kept small and private',
    fields: {
      type: { label: 'Payment type', hint: 'SEPA, SWIFT or ACH', kind: 'text' },
      tx_type: { label: 'Message type', hint: 'The ISO 20022 message, such as pacs.008.001.08', kind: 'text' },
      msg_id: { label: 'Message ID', hint: 'The message\'s unique identifier', kind: 'hash' },
      reference: { label: 'Reference', hint: 'The ISO 20022 document reference', kind: 'hash' },
      creditor_hash: {
        label: 'Creditor hash',
        hint: 'A hash of the creditor\'s details, such as name and IBAN; the details are not on the chain',
        kind: 'hash',
      },
    },
  },
};

const PARTS: ReadonlyArray<MetadataPart> = [ 'metadata', 'identity', 'security', 'iso20022' ];

export function isWebAddress(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function field(key: string, spec: FieldSpec, value: string): MetadataField {
  const kind = spec.kind === 'link' && !isWebAddress(value) ? 'text' : spec.kind;
  return { key, label: spec.label, hint: spec.hint, value, kind };
}

export function getMetadataSections(data: ShineriumMetadata): Array<MetadataSection> {
  return PARTS.flatMap((part) => {
    const partValues = data[part];
    if (!partValues) {
      return [];
    }

    const fieldValues: Readonly<Record<string, string | null>> = { ...partValues };

    const spec = SECTIONS[part];
    const fields = Object.entries(spec.fields).flatMap(([ key, fieldSpec ]) => {
      const value = fieldValues[key];
      return value ? [ field(key, fieldSpec, value) ] : [];
    });

    return fields.length > 0 ? [ { key: part, title: spec.title, hint: spec.hint, fields } ] : [];
  });
}
