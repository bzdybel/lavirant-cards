import { EffectCardDisplay, QuestionCardDisplay } from '@/src/components/CardDisplay';
import { GameCard } from '@/src/components/GameCard';
import { uiText } from '@/src/content/ui';
import { uiColors } from '@/src/theme/ui';
import type { Card, CardType } from '@/src/types/Card';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

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
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

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

  const [measuredHeight, setMeasuredHeight] = React.useState<number | null>(null);

  React.useEffect(() => {
    setMeasuredHeight(null);
  }, [currentCard.id, revealCorrect]);

  const fallbackAspect = currentCard.type === 'question' ? 0.82 : 0.62;

  // The hero animation scales the card up (see useHomeCardController: HERO_SCALE).
  // Compute base size so the *scaled* card still has comfortable side padding.
  const maxHeroScale = 1.08;
  const sidePadding = screenWidth < 360 ? 20 : 32;
  const horizontalPadding = sidePadding * 2;
  const maxCardWidth = 420;
  const availableWidth = screenWidth - horizontalPadding;
  const maxBaseWidth = Math.min(Math.max(availableWidth / maxHeroScale, 240), maxCardWidth);

  // Keep enough vertical space for buttons and translations.
  // (Tune smaller so tall question cards can actually grow.)
  const reservedVertical = (screenHeight < 700 ? 140 : 190);
  const maxBaseHeight = Math.max(240, (screenHeight - reservedVertical) / maxHeroScale);

  const desiredHeight = measuredHeight ?? maxBaseWidth * fallbackAspect;
  const baseHeight = Math.min(Math.max(desiredHeight, 240), maxBaseHeight);
  // Keep width as large as possible; height expands to fit content.
  const baseWidth = maxBaseWidth;

  const isHeightClamped = desiredHeight > maxBaseHeight;

  const onBackContentHeightChange = React.useCallback((nextHeight: number) => {
    const rounded = Math.ceil(nextHeight);
    setMeasuredHeight((prev) => {
      if (prev == null) return rounded;
      if (Math.abs(prev - rounded) <= 2) return prev;
      return rounded;
    });
  }, []);

  const cardSize = { width: baseWidth, height: baseHeight };

  const buttonsMarginTop = screenHeight < 700 ? 18 : 40;

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
      <View style={[styles.flipContainer, cardSize]}>
        <Animated.View
          style={[
            styles.flipCard,
            {
              opacity: frontOpacity,
              transform: [{ perspective: 1000 }, { rotateY: frontTransform }],
            },
          ]}
        >
          <GameCard cardType={heroType} onPress={() => {}} size={cardSize} />
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
            <QuestionCardDisplay
              card={currentCard}
              revealCorrect={revealCorrect}
              size={cardSize}
              onContentHeightChange={onBackContentHeightChange}
              enableScrollOnOverflow={isHeightClamped}
            />
          ) : (
            <EffectCardDisplay card={currentCard} size={cardSize} onContentHeightChange={onBackContentHeightChange} />
          )}
        </Animated.View>
      </View>

      <View style={[styles.buttonsContainer, { marginTop: buttonsMarginTop }]}>
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  flipContainer: {
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
