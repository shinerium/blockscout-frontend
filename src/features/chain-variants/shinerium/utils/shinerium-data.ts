// SPDX-License-Identifier: LicenseRef-Blockscout

import type {
  ShineriumAccountKey,
  ShineriumBlock,
  ShineriumTransaction,
  ShineriumVesting,
  ShineriumWithdrawal,
} from '../types/api';

import { DAY, SECOND } from 'src/toolkit/utils/consts';

const getShineriumField = <TField>(item: object): TField | undefined => {
  if (!('shinerium' in item)) {
    return undefined;
  }

  const field = item.shinerium;
  return typeof field === 'object' && field !== null ? field as TField : undefined;
};

export const getShineriumBlock = (block: object): ShineriumBlock | undefined => getShineriumField<ShineriumBlock>(block);

export const getShineriumTransaction = (transaction: object): ShineriumTransaction | undefined =>
  getShineriumField<ShineriumTransaction>(transaction);

export const getShineriumWithdrawal = (withdrawal: object): ShineriumWithdrawal | undefined =>
  getShineriumField<ShineriumWithdrawal>(withdrawal);

export const isCarrier = (block: ShineriumBlock): boolean => block.block_type === 'control';

export const getBlockEpoch = (block: ShineriumBlock): number | null => {
  if (block.control_block_number === null) {
    return null;
  }

  if (!isCarrier(block)) {
    return block.control_block_number;
  }

  return block.control_block_number > 0 ? block.control_block_number - 1 : null;
};

export const hasAccountKey = (accountKey: ShineriumAccountKey): boolean =>
  accountKey.scheme !== null || accountKey.policy !== 'none';

export const hasVesting = (vesting: ShineriumVesting): boolean =>
  vesting.record !== null || vesting.locked_until !== null || (vesting.locked !== null && vesting.locked !== '0');

export const formatVestingStep = (seconds: number): string => {
  if (seconds === 0) {
    return 'Continuous';
  }

  const milliseconds = seconds * SECOND;
  if (milliseconds % DAY !== 0) {
    return `Every ${ seconds } seconds`;
  }

  const days = milliseconds / DAY;
  return days === 1 ? 'Every day' : `Every ${ days } days`;
};
