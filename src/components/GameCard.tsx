import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width * 0.8, 380);
const CARD_HEIGHT = CARD_WIDTH * 0.62; // Horizontal card (420x260)

interface GameCardProps {
  onPress?: () => void;
  cardType?: 'question' | 'reward' | 'penalty';
}

export const GameCard: React.FC<GameCardProps> = ({ onPress, cardType = 'question' }) => {
  const getCardLabel = () => {
    switch (cardType) {
      case 'question':
        return 'PYTANIE';
      case 'reward':
        return 'NAGRODA';
      case 'penalty':
        return 'KARA';
      default:
        return 'PYTANIE';
    }
  };

  const getCardColor = () => {
    switch (cardType) {
      case 'reward':
        return '#0f3324'; // Dark green
      case 'penalty':
        return '#331a1a'; // Dark red
      default:
        return '#0f2433'; // Dark blue
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View style={styles.cardContainer}>
          <View style={[styles.card, { backgroundColor: getCardColor() }]}>
            <View style={styles.cardBorder}>
              <View style={styles.cardContent}>
                <View style={styles.leftSection}>
                  <Text style={styles.categoryLabel}>{getCardLabel()}</Text>
                </View>

                <View style={styles.rightSection}>
                  <Text style={styles.tapText}>TAP</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: '#0f2433',
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
  cardBorder: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    padding: 24,
    position: 'relative',
  },

  cardContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 18,
    fontWeight: '400',
    color: '#c9a24d',
    letterSpacing: 4, 
  },
  tapText: {
    fontSize: 9,
    color: '#c9a24d',
    letterSpacing: 2,
    fontWeight: '400',
    textAlign: 'center',
    transform: [{ rotate: '90deg' }],
  },
});
