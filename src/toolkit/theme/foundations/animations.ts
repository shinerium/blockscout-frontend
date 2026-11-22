// SPDX-License-Identifier: LicenseRef-Blockscout

export const keyframes = {
  fromLeftToRight: {
    from: {
      left: '0%',
      transform: 'translateX(0%)',
    },
    to: {
      left: '100%',
      transform: 'translateX(-100%)',
    },
  },
  skeletonShimmer: {
    from: {
      transform: 'translateX(-100%)',
    },
    to: {
      transform: 'translateX(100%)',
    },
  },
  pulseOut: {
    from: {
      boxShadow: '0 0 0 6px currentColor',
    },
    to: {
      boxShadow: '0 0 0 0 currentColor',
    },
  },
};
