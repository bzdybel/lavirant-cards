import { uiColors } from '@/src/theme/ui';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '');
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export function FancyBackground() {
  return (
    <View style={[styles.fancyBackground, { pointerEvents: 'none' }]}>
      <View
        style={[
          styles.blob,
          styles.blobGold,
          { backgroundColor: hexToRgba(uiColors.brandGold, 0.14) },
        ]}
      />
      <View
        style={[
          styles.blob,
          styles.blobBlue,
          { backgroundColor: hexToRgba(uiColors.card.back, 0.22) },
        ]}
      />
      <View
        style={[
          styles.blob,
          styles.blobRose,
          { backgroundColor: hexToRgba(uiColors.effectLabel.penalty, 0.09) },
        ]}
      />

      <View
        style={[
          styles.glow,
          styles.glowGold,
          {
            backgroundColor: hexToRgba(uiColors.brandGold, 0.09),
            borderColor: hexToRgba(uiColors.brandGold, 0.22),
            shadowColor: uiColors.brandGold,
          },
        ]}
      />
      <View
        style={[
          styles.glow,
          styles.glowBlue,
          {
            backgroundColor: hexToRgba(uiColors.card.back, 0.1),
            borderColor: hexToRgba(uiColors.card.back, 0.22),
            shadowColor: uiColors.card.back,
          },
        ]}
      />

      <View
        style={[
          styles.vignette,
          { backgroundColor: hexToRgba(uiColors.overlayBackground, 0.12) },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fancyBackground: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 9999,
  },
  blobGold: {
    width: 420,
    height: 420,
    top: -170,
    left: -120,
    transform: [{ rotate: '18deg' }],
  },
  blobBlue: {
    width: 520,
    height: 520,
    bottom: -260,
    right: -220,
    transform: [{ rotate: '-12deg' }],
  },
  blobRose: {
    width: 360,
    height: 360,
    top: 160,
    right: -180,
    transform: [{ rotate: '8deg' }],
  },
  glow: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.75,
    shadowRadius: 52,
  },
  glowGold: {
    width: 520,
    height: 520,
    top: -230,
    left: -190,
  },
  glowBlue: {
    width: 620,
    height: 620,
    bottom: -330,
    right: -310,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
  },
});
