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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: 'bold' }}>Lavirant Cards</Text>
      <Button title="Start Game" onPress={handleStartGame} />
      <View style={{ marginTop: 10 }}>
        <Button title="Reset Game" onPress={handleResetGame} />
      </View>
    </View>
  );
}
