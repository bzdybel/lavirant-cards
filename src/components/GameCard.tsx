import { uiText } from '@/src/content/ui';
import { uiColors } from '@/src/theme/ui';
import React from 'react';
import { Dimensions, ImageBackground, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CardType } from '../types/Card';

const { width } = Dimensions.get('window');
const DEFAULT_CARD_WIDTH = Math.min(width * 0.8, 380);
const DEFAULT_CARD_HEIGHT = DEFAULT_CARD_WIDTH * 0.62;

type CardVisualConfig = {
  label: string;
  backgroundColor: string;
  backgroundImage?: ImageSourcePropType;
};

const CARD_CONFIG: Record<CardType, CardVisualConfig> = {
  question: {
    label: uiText.cards.question,
    backgroundColor: uiColors.cardTypeBackground.question,
    backgroundImage: require('../../assets/images/question-bg.webp'),
  },
  reward: {
    label: uiText.cards.reward,
    backgroundColor: uiColors.cardTypeBackground.reward,
    backgroundImage: require('../../assets/images/reward-bg.webp'),
  },
  penalty: {
    label: uiText.cards.penalty,
    backgroundColor: uiColors.cardTypeBackground.penalty,
    backgroundImage: require('../../assets/images/penalty-bg.webp'),
  },
  penaltyGroup: {
    label: uiText.cards.penaltyGroup,
    backgroundColor: uiColors.cardTypeBackground.penaltyGroup,
    backgroundImage: require('../../assets/images/penalty-bg.webp'),
  },
};

interface GameCardProps {
  onPress?: () => void;
  cardType?: CardType;
  size?: { width: number; height: number };
}

export const GameCard: React.FC<GameCardProps> = ({ onPress, cardType = 'question', size }) => {
  const config = CARD_CONFIG[cardType];
  const containerSize = size ?? { width: DEFAULT_CARD_WIDTH, height: DEFAULT_CARD_HEIGHT };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[styles.container, containerSize]}>
      <View style={[styles.card, { backgroundColor: config.backgroundColor }]}>
        {config.backgroundImage ? (
          <ImageBackground source={config.backgroundImage} resizeMode="cover" style={styles.backgroundImage}>
            <View style={styles.backgroundOverlay} />
          </ImageBackground>
        ) : null}

        <View style={styles.cardContent}>
          <Text style={styles.categoryLabel}>{config.label}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: uiColors.card.border,
    backgroundColor: uiColors.card.front,
    shadowColor: uiColors.card.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    ...StyleSheet.absoluteFillObject,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: uiColors.overlayBackground,
    opacity: 0.25,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 14,
  },
  categoryLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: uiColors.brandGold,
    letterSpacing: 4,
    textAlign: 'center',
  },
  tapText: {
    fontSize: 11,
    color: uiColors.brandGold,
    letterSpacing: 2,
    fontWeight: '700',
    textAlign: 'center',
  },
});
