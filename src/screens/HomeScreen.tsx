import React from 'react';
import { Button, Text, View } from 'react-native';
import { useGameStore } from '../store/gameStore';

export function HomeScreen({ navigation }: any) {
  const resetGame = useGameStore((state) => state.resetGame);

  const handleStartGame = () => {
    navigation.navigate('Draw');
  };

  const handleResetGame = () => {
    resetGame();
    navigation.navigate('Home');
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
