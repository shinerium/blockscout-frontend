// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';

import ChainMenuLink from './ChainMenuLink';

describe('ChainMenuLink', () => {
  afterEach(cleanup);

  it('links to a network that is open', () => {
    render(<ChainMenuLink title="Shinerium Testnet" url="https://testnet.example.com/" group="Testnets"/>);

    const link = screen.getByText('Shinerium Testnet').closest('a');

    expect(link?.getAttribute('href')).toBe('https://testnet.example.com/');
  });

  it('shows a disabled network without a link', () => {
    render(<ChainMenuLink title="Shinerium Mainnet" url="https://mainnet.example.com/" group="Mainnets" isDisabled/>);

    const item = screen.getByRole('link', { name: /Shinerium Mainnet/ });

    expect(item.getAttribute('aria-disabled')).toBe('true');
    expect(item.getAttribute('href')).toBeNull();
    expect(item.closest('a')).toBeNull();
  });
});
