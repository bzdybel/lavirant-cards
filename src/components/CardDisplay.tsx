import { uiText } from '@/src/content/ui';
import { uiColors } from '@/src/theme/ui';
import { EffectCard, QuestionCard } from '@/src/types/Card';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width * 0.9, 420);
const CARD_HEIGHT = CARD_WIDTH * 0.62;

interface QuestionCardDisplayProps {
  card: QuestionCard;
  revealCorrect: boolean;
}

const CardContainer: React.FC<{ children: React.ReactNode; isDark?: boolean }> = ({ children, isDark = false }) => (
  <View style={styles.container}>
    <View style={[styles.card, isDark ? styles.cardBack : styles.cardFront]}>
      {children}
    </View>
  </View>
);

export const QuestionCardDisplay: React.FC<QuestionCardDisplayProps> = ({ card, revealCorrect }) => {
  const correctAnswer = card.answers.find(a => a.isCorrect);
  
  return (
    <CardContainer isDark={revealCorrect}>
      {!revealCorrect ? (
        <View style={styles.cardContent}>
          <Text style={styles.categoryLabel}>{uiText.cards.question}</Text>
          <View style={styles.questionContainer}>
            <Text style={styles.questionText} numberOfLines={4} adjustsFontSizeToFit>
              {card.question}
            </Text>
          </View>
          <View style={styles.answersGrid}>
            {card.answers.map((answer) => (
              <Text key={answer.id} style={styles.answerOption} numberOfLines={2}>
                {answer.id}. {answer.text}
              </Text>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.cardContentCenter}>
          <Text style={styles.correctLabel}>{uiText.question.correctLabel}</Text>
          <View style={styles.correctAnswerContainer}>
            <Text style={styles.correctAnswer} numberOfLines={4} adjustsFontSizeToFit>
              {correctAnswer?.id}. {correctAnswer?.text}
            </Text>
          </View>
        </View>
      )}
    </CardContainer>
  );
};

interface EffectCardDisplayProps {
  card: EffectCard;
}

export const EffectCardDisplay: React.FC<EffectCardDisplayProps> = ({ card }) => {
  const isReward = card.type === 'reward';
  
  return (
    <CardContainer isDark>
      <View style={styles.effectCardContent}>
        <View style={styles.effectHeader}>
          <Text style={styles.brandTitle}>{uiText.app.brand}</Text>
          <Text style={[styles.effectLabel, isReward ? styles.rewardLabel : styles.penaltyLabel]}>
            {isReward ? uiText.cards.reward : uiText.cards.penalty}
          </Text>
          <Text style={styles.effectIcon}>{isReward ? '🎉' : '⚠️'}</Text>
        </View>
        <View style={styles.effectTextContainer}>
          <Text style={styles.effectText} numberOfLines={6} adjustsFontSizeToFit>
            {card.text}
          </Text>
        </View>
      </View>
    </CardContainer>
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
    borderColor: uiColors.card.border,
    shadowColor: uiColors.card.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  cardFront: {
    backgroundColor: uiColors.card.front,
  },
  cardBack: {
    backgroundColor: uiColors.card.back,
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
    color: uiColors.brandGold,
    letterSpacing: 4,
    fontWeight: '400',
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '300',
    color: uiColors.text.onDark,
    textAlign: 'center',
    lineHeight: 26,
  },
  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  answerOption: {
    fontSize: 14,
    color: uiColors.text.onDark,
    width: '48%',
    fontWeight: '400',
    lineHeight: 20,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: uiColors.text.onDark,
    marginBottom: 12,
  },
  correctLabel: {
    fontSize: 16,
    color: uiColors.brandGold,
    marginBottom: 8,
  },
  correctAnswerContainer: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: '90%',
  },
  correctAnswer: {
    fontSize: 20,
    color: uiColors.text.onDark,
    marginTop: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  effectCardContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  effectHeader: {
    alignItems: 'center',
  },
  effectTextContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  effectLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 8,
  },
  rewardLabel: {
    color: uiColors.effectLabel.reward,
  },
  penaltyLabel: {
    color: uiColors.effectLabel.penalty,
  },
  effectIcon: {
    fontSize: 40,
    marginVertical: 8,
  },
  effectText: {
    fontSize: 16,
    color: uiColors.text.onDark,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
});
