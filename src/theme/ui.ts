import type { CardType } from '../types/Card';
import { colors } from './colors';

export const uiColors = {
  screenBackground: colors.indigo[950],
  overlayBackground: colors.zinc[950],
  brandGold: colors.amber[500],

  card: {
    front: colors.slate[950],
    back: colors.slate[900],
    border: colors.amber[500],
    shadow: colors.zinc[950],
  },

  cardTypeBackground: {
    question: colors.slate[950],
    reward: colors.emerald[950],
    penalty: colors.rose[950],
    penaltyGroup: colors.rose[950],
  } satisfies Record<CardType, string>,

  effectLabel: {
    reward: colors.emerald[500],
    penalty: colors.rose[500],
  },

  button: {
    primary: colors.amber[500],
    secondary: colors.slate[800],
  },

  text: {
    onDark: colors.white,
  },
} as const;
