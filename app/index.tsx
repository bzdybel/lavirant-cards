import { EffectCardDisplay, QuestionCardDisplay } from '@/src/components/CardDisplay';
import { GameCard } from '@/src/components/GameCard';
import { useGameStore } from '@/src/store/gameStore';
import { CardType } from '@/src/types/Card';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CARD_TYPES: CardType[] = ['question', 'reward', 'penalty'];
const ANIMATION_DURATION = 300;

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
      duration: ANIMATION_DURATION * 2,
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
      // Expand from list position to center
      Animated.spring(expandAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // Scale up slightly
      Animated.spring(cardScale, {
        toValue: 1.15,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // Move to center vertically
      Animated.spring(cardTranslateY, {
        toValue: -50,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // Fade in overlay background
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      // Blur background cards
      Animated.timing(backgroundBlur, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();

    // Trigger flip after expansion
    setTimeout(() => {
      animateFlip(1, () => setIsFlipped(true));
    }, ANIMATION_DURATION + 100);
  };

  const handleReset = () => {
    // Make the list card visible immediately (don't wait for reverse springs)
    setSelectedType(null);

    animateFlip(0, () => {
      // Reverse hero animation
      Animated.parallel([
        Animated.spring(expandAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(cardTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundBlur, {
          toValue: 0,
          duration: ANIMATION_DURATION,
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
        <ActivityIndicator size="large" color="#c9a24d" />
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
      {/* Background overlay */}
      <Animated.View 
        style={[
          styles.backgroundOverlay,
          {
            opacity: overlayOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.85],
            }),
            pointerEvents: currentCard ? 'auto' : 'none',
          }
        ]}
      />

      {/* Cards list with blur effect */}
      <Animated.View
        style={{
          flex: 1,
          opacity: backgroundCardOpacity,
          transform: [{ scale: backgroundCardScale }],
        }}
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
                  transform: [{ rotateY: frontTransform }],
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
                  transform: [{ rotateY: backTransform }],
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
                <Text style={styles.buttonText}>Pokaż odpowiedź</Text>
              </TouchableOpacity>
            )}
            {isFlipped && (
              <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
                <Text style={styles.buttonText}>Powrót</Text>
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
    backgroundColor: '#1a1a2e',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#000000',
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
    backgroundColor: '#c9a24d',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    minWidth: 200,
  },
  resetButton: {
    backgroundColor: '#2d4a5e',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
