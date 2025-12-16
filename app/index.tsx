import { GameCard } from '@/src/components/GameCard';
import { useGameStore } from '@/src/store/gameStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const drawCard = useGameStore((state) => state.drawCard);

  const handleDrawCard = (type: 'question' | 'reward' | 'penalty') => {
    drawCard(type);
    router.push('/card');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Wybierz typ karty
      </Text>
      
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
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  cardsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 30,
  },
  cardItem: {
    marginBottom: 20,
  },
});
