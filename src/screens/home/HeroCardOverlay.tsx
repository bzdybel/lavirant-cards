import { EffectCardDisplay, QuestionCardDisplay } from '@/src/components/CardDisplay';
import { GameCard } from '@/src/components/GameCard';
import { uiText } from '@/src/content/ui';
import { uiColors } from '@/src/theme/ui';
import type { Card, CardType } from '@/src/types/Card';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function HeroCardOverlay(props: {
  currentCard: Card;
  heroType: CardType;
  overlayOpacity: Animated.Value;
  cardScale: Animated.Value;
  cardTranslateY: Animated.Value;
  frontOpacity: Animated.AnimatedInterpolation<number>;
  backOpacity: Animated.AnimatedInterpolation<number>;
  frontTransform: Animated.AnimatedInterpolation<string>;
  backTransform: Animated.AnimatedInterpolation<string>;
  revealCorrect: boolean;
  onRevealCorrect: () => void;
  showRevealButton: boolean;
  isFlipped: boolean;
  onReset: () => void;
}) {
  const {
    currentCard,
    heroType,
    overlayOpacity,
    cardScale,
    cardTranslateY,
    frontOpacity,
    backOpacity,
    frontTransform,
    backTransform,
    revealCorrect,
    onRevealCorrect,
    showRevealButton,
    isFlipped,
    onReset,
  } = props;

  const isQuestion = currentCard.type === 'question';

  return (
    <Animated.View
      style={[
        styles.heroCardContainer,
        {
          opacity: overlayOpacity,
          transform: [{ scale: cardScale }, { translateY: cardTranslateY }],
        },
        { pointerEvents: 'box-none' },
      ]}
    >
      <View style={styles.flipContainer}>
        <Animated.View
          style={[
            styles.flipCard,
            {
              opacity: frontOpacity,
              transform: [{ perspective: 1000 }, { rotateY: frontTransform }],
            },
          ]}
        >
          <GameCard cardType={heroType} onPress={() => {}} />
        </Animated.View>

        <Animated.View
          style={[
            styles.flipCard,
            styles.flipCardBack,
            {
              opacity: backOpacity,
              transform: [{ perspective: 1000 }, { rotateY: backTransform }],
            },
          ]}
        >
          {isQuestion ? (
            <QuestionCardDisplay card={currentCard} revealCorrect={revealCorrect} />
          ) : (
            <EffectCardDisplay card={currentCard} />
          )}
        </Animated.View>
      </View>

      <View style={styles.buttonsContainer}>
        {showRevealButton && (
          <TouchableOpacity style={styles.button} onPress={onRevealCorrect}>
            <Text style={styles.buttonText}>{uiText.buttons.revealAnswer}</Text>
          </TouchableOpacity>
        )}
        {isFlipped && (
          <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={onReset}>
            <Text style={styles.buttonText}>{uiText.buttons.back}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  heroCardContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -210,
    marginTop: -130,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  flipContainer: {
    width: 420,
    height: 260,
    position: 'relative',
  },
  flipCard: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  },
  flipCardBack: {
    position: 'absolute',
  },
  buttonsContainer: {
    marginTop: 40,
    gap: 15,
    alignItems: 'center',
  },
  button: {
    backgroundColor: uiColors.button.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    minWidth: 200,
  },
  resetButton: {
    backgroundColor: uiColors.button.secondary,
  },
  buttonText: {
    color: uiColors.text.onDark,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
