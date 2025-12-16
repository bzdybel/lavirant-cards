import { EffectCardDisplay, QuestionCardDisplay } from '@/src/components/CardDisplay';
import { useGameStore } from '@/src/store/gameStore';
import { EffectCard, QuestionCard } from '@/src/types/Card';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CardScreen() {
  const router = useRouter();
  const currentCard = useGameStore((state) => state.currentCard);
  const [revealCorrect, setRevealCorrect] = useState<boolean>(false);

  if (!currentCard) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No card loaded</Text>
      </View>
    );
  }

  const isQuestion = currentCard.type === 'question';
  const questionCard = currentCard as QuestionCard;
  const effectCard = currentCard as EffectCard;

  const handleReveal = () => setRevealCorrect(true);

  const handleNext = () => {
    setRevealCorrect(false);
    router.push('/draw');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.container}>
      <View style={styles.cardContainer}>
        {isQuestion ? (
          <QuestionCardDisplay card={questionCard} revealCorrect={revealCorrect} />
        ) : (
          <EffectCardDisplay card={effectCard} />
        )}
      </View>

      <View style={styles.buttonContainer}>
        {isQuestion && !revealCorrect ? (
          <TouchableOpacity style={styles.revealButton} onPress={handleReveal}>
            <Text style={styles.revealButtonText}>Show Correct Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {isQuestion ? 'Next Question' : 'Continue'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/draw')}
        >
          <Text style={styles.backButtonText}>Back to Draw</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  emptyText: {
    fontSize: 16,
    color: '#fff',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 15,
  },
  revealButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  revealButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
