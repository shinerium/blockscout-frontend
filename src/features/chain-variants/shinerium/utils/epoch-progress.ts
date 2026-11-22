// SPDX-License-Identifier: LicenseRef-Blockscout

import { clamp } from 'es-toolkit';

import type { ShineriumEpochProgress } from 'src/features/chain-variants/shinerium/types/api';

export type EpochDiamondState = 'done' | 'current' | 'upcoming';

export const EPOCH_DIAMONDS_NUM = 12;

export function getEpochDiamonds(progress: number, count: number): ReadonlyArray<EpochDiamondState> {
  const doneNum = Math.floor(clamp(progress, 0, 1) * count);

  return Array.from({ length: count }, (_, index): EpochDiamondState => {
    if (index < doneNum) {
      return 'done';
    }
    return index === doneNum ? 'current' : 'upcoming';
  });
}

export function getEpochProgressPercent(progress: number): number {
  return Math.floor(clamp(progress, 0, 1) * 100);
}

type EpochProgressFigures = Pick<ShineriumEpochProgress, 'number' | 'blocks' | 'max_blocks' | 'seconds' | 'max_seconds' | 'progress'>;

export function getEpochProgressHint(data: EpochProgressFigures): ReadonlyArray<string> {
  return [
    `Epoch ${ data.number } is ${ getEpochProgressPercent(data.progress) }% through: ` +
      `${ Math.min(data.blocks, data.max_blocks).toLocaleString('en-US') } of ${ data.max_blocks.toLocaleString('en-US') } blocks, ` +
      `${ Math.min(data.seconds, data.max_seconds).toLocaleString('en-US') } of ${ data.max_seconds.toLocaleString('en-US') } seconds.`,
    `An epoch ends at ${ data.max_blocks.toLocaleString('en-US') } blocks or after ${ data.max_seconds.toLocaleString('en-US') } seconds, ` +
      'whichever comes first.',
  ];
}
