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
  const answersById = new Map(card.answers.map((a) => [a.id, a] as const));
  const answerA = answersById.get('A');
  const answerB = answersById.get('B');
  const answerC = answersById.get('C');
  const answerD = answersById.get('D');
  
  return (
    <CardContainer isDark={revealCorrect}>
      <View style={styles.cardContent}>
        <Text style={styles.categoryLabel}>{uiText.cards.question}</Text>

        {!revealCorrect ? (
          <>
            <View style={styles.mainTextContainer}>
              <Text style={styles.mainText} numberOfLines={4} adjustsFontSizeToFit>
                {card.question}
              </Text>
            </View>

            <View style={styles.answersGrid}>
              <View style={styles.answersRow}>
                <View style={styles.answerCell}>
                  <Text style={styles.answerOption} numberOfLines={2}>
                    {answerA ? `A. ${answerA.text}` : ''}
                  </Text>
                </View>
                <View style={styles.answerCell}>
                  <Text style={styles.answerOption} numberOfLines={2}>
                    {answerB ? `B. ${answerB.text}` : ''}
                  </Text>
                </View>
              </View>

              <View style={styles.answersRow}>
                <View style={styles.answerCell}>
                  <Text style={styles.answerOption} numberOfLines={2}>
                    {answerC ? `C. ${answerC.text}` : ''}
                  </Text>
                </View>
                <View style={styles.answerCell}>
                  <Text style={styles.answerOption} numberOfLines={2}>
                    {answerD ? `D. ${answerD.text}` : ''}
                  </Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.subLabel}>{uiText.question.correctLabel}</Text>
            <View style={styles.mainTextContainer}>
              <Text style={styles.mainText} numberOfLines={4} adjustsFontSizeToFit>
                {correctAnswer?.id}. {correctAnswer?.text}
              </Text>
            </View>
          </>
        )}
      </View>
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
      <View style={styles.cardContent}>
        <Text style={styles.categoryLabel}>{card.title}</Text>

        <View style={styles.mainTextContainer}>
          <Text style={styles.mainText} numberOfLines={6} adjustsFontSizeToFit>
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
    padding: 28,
    justifyContent: 'space-between',
  },
  categoryLabel: {
    fontSize: 20,
    color: uiColors.brandGold,
    letterSpacing: 4,
    fontWeight: '700',
    textAlign: 'center',
  },
  subLabel: {
    fontSize: 16,
    color: uiColors.brandGold,
    fontWeight: '700',
    textAlign: 'center',
  },
  mainTextContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  mainText: {
    fontSize: 20,
    fontWeight: '600',
    color: uiColors.text.onDark,
    textAlign: 'center',
    lineHeight: 28,
  },
  answersGrid: {
    gap: 10,
  },
  answersRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'stretch',
  },
  answerCell: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  answerOption: {
    fontSize: 15,
    color: uiColors.text.onDark,
    fontWeight: '600',
    lineHeight: 21,
    textAlign: 'left',
  },
  typeBadge: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
  },
  rewardBadge: {
    color: uiColors.effectLabel.reward,
  },
  penaltyBadge: {
    color: uiColors.effectLabel.penalty,
  },
});
