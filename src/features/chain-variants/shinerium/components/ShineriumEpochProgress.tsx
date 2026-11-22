// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BoxProps, FlexProps } from '@chakra-ui/react';
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { EpochDiamondState } from 'src/features/chain-variants/shinerium/utils/epoch-progress';
import { EPOCH_DIAMONDS_NUM, getEpochDiamonds, getEpochProgressPercent } from 'src/features/chain-variants/shinerium/utils/epoch-progress';

const DIAMOND_STYLES: Record<EpochDiamondState, BoxProps> = {
  done: { borderColor: 'shinerium', bgColor: { _light: 'shinerium', _dark: 'white' } },
  current: { borderColor: 'shinerium', bgColor: 'bg.primary' },
  upcoming: { borderColor: { _light: 'blackAlpha.300', _dark: 'whiteAlpha.400' }, bgColor: 'bg.primary' },
};

interface Props extends FlexProps {
  readonly progress: number;
}

const ShineriumEpochProgress = ({ progress, ...rest }: Props) => {
  const diamonds = React.useMemo(() => getEpochDiamonds(progress, EPOCH_DIAMONDS_NUM), [ progress ]);
  const lastDoneIndex = diamonds.lastIndexOf('done');

  return (
    <Flex
      role="progressbar"
      aria-label="Epoch progress"
      aria-valuemin={ 0 }
      aria-valuemax={ 100 }
      aria-valuenow={ getEpochProgressPercent(progress) }
      position="relative"
      alignItems="center"
      justifyContent="space-between"
      bgColor="bg.primary"
      borderRadius="sm"
      px={{ base: 1.5, lg: 2 }}
      py={{ base: 1, lg: 1.5 }}
      { ...rest }
    >
      <Box
        aria-hidden
        position="absolute"
        left={{ base: 1.5, lg: 2 }}
        right={{ base: 1.5, lg: 2 }}
        top="50%"
        borderTopWidth="1px"
        borderColor={{ _light: 'blackAlpha.200', _dark: 'whiteAlpha.300' }}
      />
      { diamonds.map((state, index) => (
        <Box
          key={ index }
          aria-hidden
          position="relative"
          flexShrink={ 0 }
          boxSize={{ base: '6px', lg: '8px' }}
          borderWidth={{ base: '1.5px', lg: '2px' }}
          borderStyle="solid"
          transform="rotate(45deg)"
          color="shinerium/45"
          animation={ index === lastDoneIndex ? 'pulseOut 1.2s ease-out' : undefined }
          _motionReduce={{ animation: 'none' }}
          { ...DIAMOND_STYLES[state] }
        />
      )) }
    </Flex>
  );
};

export default React.memo(ShineriumEpochProgress);
