import { useDelayedReady } from '@/src/hooks/useDelayedReady';
import { useGameStore } from '@/src/store/gameStore';
import { uiColors } from '@/src/theme/ui';
import type { CardType } from '@/src/types/Card';
import React from 'react';
import { ActivityIndicator, Animated, StyleSheet, View } from 'react-native';
import { CardTypeList } from './home/CardTypeList';
import { FancyBackground } from './home/FancyBackground';
import { HeroCardOverlay } from './home/HeroCardOverlay';
import { useHomeCardController } from './home/useHomeCardController';

const CARD_TYPES: CardType[] = ['question', 'reward', 'penalty', 'penaltyGroup'];

export default function HomeScreen() {
  const { drawCard, currentCard } = useGameStore();
  const isReady = useDelayedReady(100);

  const controller = useHomeCardController({
    currentCard,
    drawCard,
    clearCurrentCard: () => useGameStore.setState({ currentCard: null }),
  });

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <FancyBackground />
        <ActivityIndicator size="large" color={uiColors.brandGold} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FancyBackground />

      <Animated.View
        pointerEvents={currentCard ? 'auto' : 'none'}
        style={[
          styles.backgroundOverlay,
          {
            opacity: controller.overlayOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.65],
            }),
          },
        ]}
      />

      <CardTypeList
        types={CARD_TYPES}
        selectedType={controller.selectedType}
        isBlocked={Boolean(currentCard)}
        backgroundCardOpacity={controller.backgroundCardOpacity}
        backgroundCardScale={controller.backgroundCardScale}
        onSelect={controller.onDrawCard}
      />

      {currentCard && controller.heroType && (
        <HeroCardOverlay
          currentCard={currentCard}
          heroType={controller.heroType}
          overlayOpacity={controller.overlayOpacity}
          cardScale={controller.cardScale}
          cardTranslateY={controller.cardTranslateY}
          frontOpacity={controller.frontOpacity}
          backOpacity={controller.backOpacity}
          frontTransform={controller.frontTransform}
          backTransform={controller.backTransform}
          revealCorrect={controller.revealCorrect}
          onRevealCorrect={() => controller.setRevealCorrect(true)}
          showRevealButton={controller.showRevealButton}
          isFlipped={controller.isFlipped}
          onReset={controller.onReset}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: uiColors.screenBackground,
    paddingHorizontal: 20,
    
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: uiColors.screenBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: uiColors.overlayBackground,
    zIndex: 100,
  },
});
