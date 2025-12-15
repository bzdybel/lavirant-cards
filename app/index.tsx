import { useGameStore } from '@/src/store/gameStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const resetGame = useGameStore((state) => state.resetGame);

  const handleStartGame = () => {
    router.push('/draw');
  };

  const handleResetGame = () => {
    resetGame();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 40, marginBottom: 30, fontWeight: 'bold', color: '#2196F3' }}>
        Lavirant Cards
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 40, color: '#666', textAlign: 'center' }}>
        Test your knowledge with our comprehensive question bank
      </Text>
      <View style={{ width: '100%', marginBottom: 15 }}>
        <Button title="Start Game" onPress={handleStartGame} color="#4CAF50" />
      </View>
      <View style={{ width: '100%' }}>
        <Button title="Reset Game" onPress={handleResetGame} color="#f44336" />
      </View>
    </View>
  );
}
