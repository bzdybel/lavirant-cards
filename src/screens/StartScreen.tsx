import { uiText } from '@/src/content/ui';
import { FancyBackground } from '@/src/screens/home/FancyBackground';
import { uiColors } from '@/src/theme/ui';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function StartScreen() {
  const ringSize = Math.min(Math.max(Math.floor(width * 0.52), 190), 280);
  const innerSize = Math.max(160, ringSize - 18);
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <View style={styles.container}>
      <FancyBackground />

      <View style={styles.content}>
        <View style={[styles.ring, { width: ringSize, height: ringSize, borderRadius: ringSize / 2 }]}>
          <Pressable
            onPress={() => router.push('/home')}
            onHoverIn={() => setIsHovered(true)}
            onHoverOut={() => setIsHovered(false)}
            style={({ pressed }) => [
              styles.button,
              {
                width: innerSize,
                height: innerSize,
                borderRadius: innerSize / 2,
                opacity: pressed ? 0.96 : 1,
                transform: [{ scale: pressed ? 0.985 : isHovered ? 1.015 : 1 }],
              },
              isHovered && styles.buttonHover,
            ]}
            accessibilityRole="button"
            accessibilityLabel={uiText.accessibility.start}
          >
            <View pointerEvents="none" style={[styles.topGlow, isHovered && styles.topGlowHover]} />
            <View pointerEvents="none" style={[styles.bottomShade, isHovered && styles.bottomShadeHover]} />
            <View pointerEvents="none" style={[styles.innerRing, isHovered && styles.innerRingHover]} />
            <Text style={styles.startText}>{uiText.buttons.start}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: uiColors.screenBackground,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: uiColors.card.border,
    backgroundColor: uiColors.screenBackground,
    shadowColor: uiColors.brandGold,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.24,
    shadowRadius: 30,
    elevation: 12,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: uiColors.card.front,
    borderWidth: 1,
    borderColor: uiColors.card.border,
    overflow: 'hidden',
    shadowColor: uiColors.card.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.55,
    shadowRadius: 22,
    elevation: 10,
  },
  buttonHover: {
    shadowOpacity: 0.66,
    shadowRadius: 26,
    elevation: 12,
  },
  topGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: uiColors.brandGold,
    opacity: 0.07,
  },
  topGlowHover: {
    opacity: 0.11,
  },
  bottomShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: uiColors.overlayBackground,
    opacity: 0.18,
    transform: [{ translateY: 18 }],
  },
  bottomShadeHover: {
    opacity: 0.14,
  },
  innerRing: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: uiColors.brandGold,
    opacity: 0.2,
  },
  innerRingHover: {
    opacity: 0.32,
  },
  startText: {
    color: uiColors.brandGold,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 4,
    textAlign: 'center',
    textShadowColor: uiColors.overlayBackground,
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
});
