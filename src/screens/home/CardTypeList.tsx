import { GameCard } from '@/src/components/GameCard';
import type { CardType } from '@/src/types/Card';
import React from 'react';
import { Animated, ScrollView, StyleSheet } from 'react-native';

export function CardTypeList(props: {
  types: CardType[];
  selectedType: CardType | null;
  isBlocked: boolean;
  backgroundCardOpacity: Animated.AnimatedInterpolation<number>;
  backgroundCardScale: Animated.AnimatedInterpolation<number>;
  onSelect: (type: CardType) => void;
}) {
  const { types, selectedType, isBlocked, backgroundCardOpacity, backgroundCardScale, onSelect } = props;

  return (
    <Animated.View
      style={[
        styles.listLayer,
        {
          opacity: backgroundCardOpacity,
          transform: [{ scale: backgroundCardScale }],
        },
      ]}
    >
      <ScrollView
        style={styles.cardsScroll}
        contentContainerStyle={styles.cardsContainer}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isBlocked}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
      >
        {types.map((type) => (
          <Animated.View
            key={type}
            style={[
              styles.cardItem,
              {
                opacity: selectedType === type ? 0 : 1,
              },
            ]}
          >
            <GameCard cardType={type} onPress={() => !isBlocked && onSelect(type)} />
          </Animated.View>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  listLayer: {
    flex: 1,
    zIndex: 10,
  },
  cardsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 60,
    gap: 30,
    paddingTop: 60
  },
  cardsScroll: {
    flex: 1,
  },
  cardItem: {
    marginBottom: 20,
  },
});
