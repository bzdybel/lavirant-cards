import { EffectCardDisplay, QuestionCardDisplay } from '@/src/components/CardDisplay';
import { GameCard } from '@/src/components/GameCard';
import { uiText } from '@/src/content/ui';
import { useGameStore } from '@/src/store/gameStore';
import { uiColors } from '@/src/theme/ui';
import { CardType } from '@/src/types/Card';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '');
  const full = normalized.length === 3
    ? normalized.split('').map((c) => c + c).join('')
    : normalized;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const CARD_TYPES: CardType[] = ['question', 'reward', 'penalty'];
const HERO_IN_DURATION = 220;
const HERO_OUT_DURATION = 180;
const FLIP_DURATION = 420;
const EASE_OUT = Easing.out(Easing.cubic);
const EASE_IN_OUT = Easing.inOut(Easing.cubic);

export default function HomeScreen() {
  const { drawCard, currentCard } = useGameStore();
  const [isFlipped, setIsFlipped] = useState(false);
  const [revealCorrect, setRevealCorrect] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [selectedType, setSelectedType] = useState<CardType | null>(null);
  const [heroType, setHeroType] = useState<CardType | null>(null);
  
  // Animation values
  const flipAnim = useRef(new Animated.Value(0)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const cardTranslateY = useRef(new Animated.Value(0)).current;
  const backgroundBlur = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const animateFlip = (toValue: number, onComplete?: () => void) => {
    Animated.timing(flipAnim, {
      toValue,
      duration: FLIP_DURATION,
      easing: EASE_IN_OUT,
      useNativeDriver: true,
    }).start(onComplete);
  };

  const handleDrawCard = (type: CardType) => {
    setSelectedType(type);
    setHeroType(type);
    drawCard(type);
    setIsFlipped(false);
    setRevealCorrect(false);
    flipAnim.setValue(0);
    
    // Hero animation: expand card to fullscreen with smooth transitions
    Animated.parallel([
      Animated.timing(expandAnim, {
        toValue: 1,
        duration: HERO_IN_DURATION,
        easing: EASE_OUT,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1.12,
        duration: HERO_IN_DURATION,
        easing: EASE_OUT,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: -48,
        duration: HERO_IN_DURATION,
        easing: EASE_OUT,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: HERO_IN_DURATION,
        easing: EASE_OUT,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundBlur, {
        toValue: 1,
        duration: HERO_IN_DURATION,
        easing: EASE_OUT,
        useNativeDriver: true,
      }),
    ]).start(() => {
      animateFlip(1, () => setIsFlipped(true));
    });
  };

  const handleReset = () => {
    // Make the list card visible immediately (don't wait for reverse springs)
    setSelectedType(null);

    animateFlip(0, () => {
      // Reverse hero animation
      Animated.parallel([
        Animated.timing(expandAnim, {
          toValue: 0,
          duration: HERO_OUT_DURATION,
          easing: EASE_IN_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(cardScale, {
          toValue: 1,
          duration: HERO_OUT_DURATION,
          easing: EASE_IN_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(cardTranslateY, {
          toValue: 0,
          duration: HERO_OUT_DURATION,
          easing: EASE_IN_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: HERO_OUT_DURATION,
          easing: EASE_IN_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundBlur, {
          toValue: 0,
          duration: HERO_OUT_DURATION,
          easing: EASE_IN_OUT,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsFlipped(false);
        setRevealCorrect(false);
        setHeroType(null);
        useGameStore.setState({ currentCard: null });
      });
    });
  };

  const createInterpolation = (outputRange: string[]) => 
    flipAnim.interpolate({ inputRange: [0, 1], outputRange });

  const frontTransform = createInterpolation(['0deg', '180deg']);
  const backTransform = createInterpolation(['180deg', '360deg']);
  const frontOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] });
  const backOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });

  const isQuestion = currentCard?.type === 'question';
  const showRevealButton = isQuestion && !revealCorrect && isFlipped;

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <View pointerEvents="none" style={styles.fancyBackground}>
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
              styles.vignette,
              { backgroundColor: hexToRgba(uiColors.overlayBackground, 0.12) },
            ]}
          />
        </View>
        <ActivityIndicator size="large" color={uiColors.brandGold} />
      </View>
    );
  }

  // Calculate blur and opacity for background cards
  const backgroundCardOpacity = backgroundBlur.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.3],
  });

  const backgroundCardScale = backgroundBlur.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.95],
  });

  return (
    <View style={styles.container}>
      {/* Fancy background (modern, keeps current palette) */}
      <View pointerEvents="none" style={styles.fancyBackground}>
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
            styles.vignette,
            { backgroundColor: hexToRgba(uiColors.overlayBackground, 0.12) },
          ]}
        />
      </View>

      {/* Background overlay */}
      <Animated.View 
        pointerEvents={currentCard ? 'auto' : 'none'}
        style={[
          styles.backgroundOverlay,
          {
            opacity: overlayOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.85],
            }),
          },
        ]}
      />

      {/* Cards list with blur effect */}
      <Animated.View
        style={[
          styles.listLayer,
          {
            opacity: backgroundCardOpacity,
            transform: [{ scale: backgroundCardScale }],
          },
        ]}
      >
        <ScrollView
          style={styles.cardsScroll}
          contentContainerStyle={styles.cardsContainer}
          showsVerticalScrollIndicator={false}
        >
          {CARD_TYPES.map((type) => (
            <Animated.View 
              key={type} 
              style={[
                styles.cardItem,
                {
                  opacity: selectedType === type ? 0 : 1,
                }
              ]}
            >
              <GameCard 
                cardType={type} 
                onPress={() => !currentCard && handleDrawCard(type)} 
              />
            </Animated.View>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Hero card overlay - expanded and centered */}
      {currentCard && heroType && (
        <Animated.View 
          style={[
            styles.heroCardContainer,
            {
              opacity: overlayOpacity,
              transform: [
                { scale: cardScale },
                { translateY: cardTranslateY },
              ],
            }
          ]}
          pointerEvents="box-none"
        >
          <View style={styles.flipContainer}>
            {/* Show the same card being flipped - not a duplicate */}
            <Animated.View
              style={[
                styles.flipCard, 
                { 
                  opacity: frontOpacity, 
                  transform: [{ perspective: 1000 }, { rotateY: frontTransform }],
                }
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
                }
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
              <TouchableOpacity style={styles.button} onPress={() => setRevealCorrect(true)}>
                <Text style={styles.buttonText}>{uiText.buttons.revealAnswer}</Text>
              </TouchableOpacity>
            )}
            {isFlipped && (
              <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
                <Text style={styles.buttonText}>{uiText.buttons.back}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: uiColors.screenBackground,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: uiColors.screenBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  vignette: {
    ...StyleSheet.absoluteFillObject,
  },
  listLayer: {
    flex: 1,
    zIndex: 10,
  },
  cardsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 60,
    gap: 30,
  },
  cardsScroll: {
    flex: 1,
  },
  cardItem: {
    marginBottom: 20,
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
