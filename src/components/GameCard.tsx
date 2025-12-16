import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CardType } from '../types/Card';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width * 0.8, 380);
const CARD_HEIGHT = CARD_WIDTH * 0.62;

const CARD_CONFIG: Record<CardType, { label: string; color: string }> = {
  question: { label: 'PYTANIE', color: '#0f2433' },
  reward: { label: 'NAGRODA', color: '#0f3324' },
  penalty: { label: 'KARA', color: '#331a1a' },
};

const COLORS = {
  gold: '#c9a24d',
  shadow: '#000',
};

interface GameCardProps {
  onPress?: () => void;
  cardType?: CardType;
}

export const GameCard: React.FC<GameCardProps> = ({ onPress, cardType = 'question' }) => {
  const config = CARD_CONFIG[cardType];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.container}>
      <View style={[styles.card, { backgroundColor: config.color }]}>
        <View style={styles.cardContent}>
          <Text style={styles.categoryLabel}>{config.label}</Text>
          <Text style={styles.tapText}>TAP</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gold,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
    padding: 24,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  categoryLabel: {
    fontSize: 18,
    fontWeight: '400',
    color: COLORS.gold,
    letterSpacing: 4,
  },
  tapText: {
    fontSize: 9,
    color: COLORS.gold,
    letterSpacing: 2,
    fontWeight: '400',
    transform: [{ rotate: '90deg' }],
  },
});
