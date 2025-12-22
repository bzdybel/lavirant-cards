import { uiText } from '@/src/content/ui';
import { uiColors } from '@/src/theme/ui';
import { EffectCard, QuestionCard } from '@/src/types/Card';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width * 0.9, 420);
const CARD_HEIGHT = CARD_WIDTH * 0.62;

type CardSize = { width: number; height: number };

function getTypography(size?: CardSize) {
  // Constant typography (no autoshrink). If content doesn't fit, we grow the card.
  // `size` remains available to tune padding if needed later.
  const contentPadding = 28;

  const mainFontSize = 22;
  const mainLineHeight = 30;
  const questionFontSize = 24;
  const questionLineHeight = 32;

  const answerFontSize = 14;
  const answerLineHeight = 20;

  return {
    contentPadding,
    mainFontSize,
    mainLineHeight,
    questionFontSize,
    questionLineHeight,
    answerFontSize,
    answerLineHeight,
  };
}

interface QuestionCardDisplayProps {
  card: QuestionCard;
  revealCorrect: boolean;
  size?: CardSize;
  onContentHeightChange?: (height: number) => void;
  enableScrollOnOverflow?: boolean;
}

const CardContainer: React.FC<{ children: React.ReactNode; isDark?: boolean; size?: CardSize }> = ({
  children,
  isDark = false,
  size,
}) => (
  <View style={[styles.container, size]}>
    <View style={[styles.card, isDark ? styles.cardBack : styles.cardFront]}>
      {children}
    </View>
  </View>
);

export const QuestionCardDisplay: React.FC<QuestionCardDisplayProps> = ({
  card,
  revealCorrect,
  size,
  onContentHeightChange,
  enableScrollOnOverflow,
}) => {
  const correctAnswer = card.answers.find(a => a.isCorrect);
  const answersById = new Map<string, (typeof card.answers)[number]>();
  for (const answer of card.answers) {
    answersById.set(answer.id, answer);
  }
  const answerA = answersById.get('A');
  const answerB = answersById.get('B');
  const answerC = answersById.get('C');
  const answerD = answersById.get('D');

  const typography = getTypography(size);
  const shouldScrollAnswers = Boolean(enableScrollOnOverflow);
  
  return (
    <CardContainer isDark={revealCorrect} size={size}>
      <View style={[styles.cardContent, { padding: typography.contentPadding }]}>
        <View
          style={styles.measureContainer}
          onLayout={(e) => {
            const measured = Math.ceil(e.nativeEvent.layout.height + typography.contentPadding * 2);
            onContentHeightChange?.(measured);
          }}
        >
          <Text style={styles.categoryLabel}>{uiText.cards.question}</Text>

          {!revealCorrect ? (
            <>
              <View style={styles.questionBlock}>
                <Text
                  style={[
                    styles.mainText,
                    { fontSize: typography.questionFontSize, lineHeight: typography.questionLineHeight },
                  ]}
                >
                  {card.question}
                </Text>
              </View>

              <View style={[styles.answersBlock, shouldScrollAnswers && styles.answersBlockScrollable]}>
                {shouldScrollAnswers ? (
                  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.answersScrollContent}>
                    <View style={styles.answersGrid}>
                      <View style={styles.answersRow}>
                        <View style={styles.answerCell}>
                          <Text
                            style={[
                              styles.answerOption,
                              { fontSize: typography.answerFontSize, lineHeight: typography.answerLineHeight },
                            ]}
                          >
                            {answerA ? `A. ${answerA.text}` : ''}
                          </Text>
                        </View>
                        <View style={styles.answerCell}>
                          <Text
                            style={[
                              styles.answerOption,
                              { fontSize: typography.answerFontSize, lineHeight: typography.answerLineHeight },
                            ]}
                          >
                            {answerB ? `B. ${answerB.text}` : ''}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.answersRow}>
                        <View style={styles.answerCell}>
                          <Text
                            style={[
                              styles.answerOption,
                              { fontSize: typography.answerFontSize, lineHeight: typography.answerLineHeight },
                            ]}
                          >
                            {answerC ? `C. ${answerC.text}` : ''}
                          </Text>
                        </View>
                        <View style={styles.answerCell}>
                          <Text
                            style={[
                              styles.answerOption,
                              { fontSize: typography.answerFontSize, lineHeight: typography.answerLineHeight },
                            ]}
                          >
                            {answerD ? `D. ${answerD.text}` : ''}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                ) : (
                  <View style={styles.answersGrid}>
                    <View style={styles.answersRow}>
                      <View style={styles.answerCell}>
                        <Text
                          style={[
                            styles.answerOption,
                            { fontSize: typography.answerFontSize, lineHeight: typography.answerLineHeight },
                          ]}
                        >
                          {answerA ? `A. ${answerA.text}` : ''}
                        </Text>
                      </View>
                      <View style={styles.answerCell}>
                        <Text
                          style={[
                            styles.answerOption,
                            { fontSize: typography.answerFontSize, lineHeight: typography.answerLineHeight },
                          ]}
                        >
                          {answerB ? `B. ${answerB.text}` : ''}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.answersRow}>
                      <View style={styles.answerCell}>
                        <Text
                          style={[
                            styles.answerOption,
                            { fontSize: typography.answerFontSize, lineHeight: typography.answerLineHeight },
                          ]}
                        >
                          {answerC ? `C. ${answerC.text}` : ''}
                        </Text>
                      </View>
                      <View style={styles.answerCell}>
                        <Text
                          style={[
                            styles.answerOption,
                            { fontSize: typography.answerFontSize, lineHeight: typography.answerLineHeight },
                          ]}
                        >
                          {answerD ? `D. ${answerD.text}` : ''}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </>
          ) : (
            <>
              <Text style={styles.subLabel}>{uiText.question.correctLabel}</Text>
              <View style={styles.questionBlock}>
                <Text
                  style={[
                    styles.mainText,
                    { fontSize: typography.questionFontSize, lineHeight: typography.questionLineHeight },
                  ]}
                >
                  {correctAnswer?.id}. {correctAnswer?.text}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </CardContainer>
  );
};

interface EffectCardDisplayProps {
  card: EffectCard;
  size?: CardSize;
  onContentHeightChange?: (height: number) => void;
}

export const EffectCardDisplay: React.FC<EffectCardDisplayProps> = ({ card, size, onContentHeightChange }) => {
  const typography = getTypography(size);

  return (
    <CardContainer isDark size={size}>
      <View style={[styles.cardContent, { padding: typography.contentPadding }]}>
        <View
          style={styles.measureContainer}
          onLayout={(e) => {
            const measured = Math.ceil(e.nativeEvent.layout.height + typography.contentPadding * 2);
            onContentHeightChange?.(measured);
          }}
        >
          <Text style={styles.categoryLabel}>{card.title}</Text>

          <View style={styles.questionBlock}>
            <Text
              style={[styles.mainText, { fontSize: typography.mainFontSize, lineHeight: typography.mainLineHeight }]}
            >
              {card.text}
            </Text>
          </View>
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
    overflow: 'hidden',
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
    justifyContent: 'flex-start',
  },
  measureContainer: {
    justifyContent: 'flex-start',
    gap: 14,
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
  questionBlock: {
    justifyContent: 'center',
  },
  mainText: {
    fontSize: 24,
    fontWeight: '600',
    color: uiColors.text.onDark,
    textAlign: 'center',
    lineHeight: 32,
  },
  answersBlock: {
    gap: 0,
  },
  answersBlockScrollable: {
    flex: 1,
    minHeight: 0,
  },
  answersScrollContent: {
    paddingBottom: 2,
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
    flexShrink: 1,
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
