import { EffectCardDisplay, QuestionCardDisplay } from '@/src/components/CardDisplay';
import { GameCard } from '@/src/components/GameCard';
import { useGameStore } from '@/src/store/gameStore';
import React, { useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const drawCard = useGameStore((state) => state.drawCard);
  const currentCard = useGameStore((state) => state.currentCard);
  const [isFlipped, setIsFlipped] = useState(false);
  const [revealCorrect, setRevealCorrect] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const handleDrawCard = (type: 'question' | 'reward' | 'penalty') => {
    const card = drawCard(type);
    setIsFlipped(false);
    setRevealCorrect(false);
    flipAnim.setValue(0);
    
    // Trigger flip animation after a short delay
    setTimeout(() => {
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsFlipped(true);
      });
    }, 300);
  };

  const handleRevealAnswer = () => {
    if (currentCard?.type === 'question') {
      setRevealCorrect(true);
    }
  };

  const handleReset = () => {
    Animated.timing(flipAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(false);
      setRevealCorrect(false);
      useGameStore.setState({ currentCard: null });
    });
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View style={styles.container}>
      {!currentCard ? (
        <ScrollView 
          contentContainerStyle={styles.cardsContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardItem}>
            <GameCard 
              cardType="question" 
              onPress={() => handleDrawCard('question')} 
            />
          </View>

          <View style={styles.cardItem}>
            <GameCard 
              cardType="reward" 
              onPress={() => handleDrawCard('reward')} 
            />
          </View>

          <View style={styles.cardItem}>
            <GameCard 
              cardType="penalty" 
              onPress={() => handleDrawCard('penalty')} 
            />
          </View>
        </ScrollView>
      ) : (
        <View style={styles.cardDisplayContainer}>
          <View style={styles.flipContainer}>
            {/* Front - GameCard */}
            <Animated.View
              style={[
                styles.flipCard,
                {
                  opacity: frontOpacity,
                  transform: [{ rotateY: frontInterpolate }],
                },
              ]}
            >
              <GameCard cardType={currentCard.type} onPress={() => {}} />
            </Animated.View>

            {/* Back - Card Content */}
            <Animated.View
              style={[
                styles.flipCard,
                styles.flipCardBack,
                {
                  opacity: backOpacity,
                  transform: [{ rotateY: backInterpolate }],
                },
              ]}
            >
              {currentCard.type === 'question' ? (
                <QuestionCardDisplay card={currentCard} revealCorrect={revealCorrect} />
              ) : (
                <EffectCardDisplay card={currentCard} />
              )}
            </Animated.View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            {currentCard.type === 'question' && !revealCorrect && isFlipped && (
              <TouchableOpacity style={styles.button} onPress={handleRevealAnswer}>
                <Text style={styles.buttonText}>Pokaż odpowiedź</Text>
              </TouchableOpacity>
            )}
            
            {isFlipped && (
              <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
                <Text style={styles.buttonText}>Powrót</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
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
  cardsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 30,
  },
  cardItem: {
    marginBottom: 20,
  },
  cardDisplayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
