import { EffectCard, QuestionCard } from '@/src/types/Card';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width * 0.9, 420);
const CARD_HEIGHT = CARD_WIDTH * 0.62; // Horizontal card ratio (420x260)

interface QuestionCardDisplayProps {
  card: QuestionCard;
  revealCorrect: boolean;
}

export const QuestionCardDisplay: React.FC<QuestionCardDisplayProps> = ({ card, revealCorrect }) => {
  const correctAnswer = card.answers.find(a => a.isCorrect);
  
  return (
    <View style={styles.container}>
      {!revealCorrect ? (
        // Front side - Question with all answers
        <View style={[styles.card, styles.cardFront]}>
          <View style={styles.cardContent}>
            <Text style={styles.categoryLabel}>PYTANIE</Text>
            <Text style={styles.questionText}>{card.question}</Text>
            <View style={styles.answersGrid}>
              {card.answers.map((answer) => (
                <Text key={answer.id} style={styles.answerOption}>
                  {answer.id}. {answer.text}
                </Text>
              ))}
            </View>
          </View>
        </View>
      ) : (
        // Back side - Correct answer
        <View style={[styles.card, styles.cardBack]}>
          <View style={styles.cardContentCenter}>
             <Text style={styles.correctLabel}>Poprawna odpowiedź</Text>
            <Text style={styles.correctAnswer}>
              {correctAnswer?.id}. {correctAnswer?.text}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

interface EffectCardDisplayProps {
  card: EffectCard;
}

export const EffectCardDisplay: React.FC<EffectCardDisplayProps> = ({ card }) => {
  const isReward = card.type === 'reward';
  
  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.cardBack]}>
        <View style={styles.cardContentCenter}>
          <Text style={styles.brandTitle}>LA'VIRANT</Text>
          <Text style={[styles.effectLabel, isReward ? styles.rewardLabel : styles.penaltyLabel]}>
            {isReward ? 'NAGRODA' : 'KARA'}
          </Text>
          <Text style={styles.effectIcon}>{isReward ? '🎉' : '⚠️'}</Text>
          <Text style={styles.effectText}>{card.text}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#c9a24d',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  cardFront: {
    backgroundColor: '#0f2433',
  },
  cardBack: {
    backgroundColor: '#132b3d',
  },
  cardContent: {
    flex: 1,
    padding: 32,
    justifyContent: 'space-between',
  },
  cardContentCenter: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 12,
    color: '#c9a24d',
    letterSpacing: 4,
    fontWeight: '400',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '300',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 30,
    marginVertical: 20,
  },
  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  answerOption: {
    fontSize: 16,
    color: '#ffffff',
    width: '48%',
    fontWeight: '400',
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  correctLabel: {
    fontSize: 18,
    color: '#c9a24d',
    marginBottom: 8,
  },
  correctAnswer: {
    fontSize: 24,
    color: '#ffffff',
    marginTop: 8,
    fontWeight: '500',
  },
  effectLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 16,
  },
  rewardLabel: {
    color: '#4CAF50',
  },
  penaltyLabel: {
    color: '#f44336',
  },
  effectIcon: {
    fontSize: 48,
    marginVertical: 16,
  },
  effectText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '400',
    marginTop: 16,
  },
});
