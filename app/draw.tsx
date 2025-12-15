import { useGameStore } from '@/src/store/gameStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, Text, View } from 'react-native';

export default function DrawScreen() {
  const router = useRouter();
  const drawCard = useGameStore((state) => state.drawCard);

  const handleDrawQuestion = () => {
    drawCard('question');
    router.push('/card');
  };

  const handleDrawReward = () => {
    drawCard('reward');
    router.push('/card');
  };

  const handleDrawPenalty = () => {
    drawCard('penalty');
    router.push('/card');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 32, marginBottom: 40, fontWeight: 'bold', color: '#333' }}>
        Draw a Card
      </Text>
      <View style={{ width: '100%', marginBottom: 15 }}>
        <Button title="📚 Question" onPress={handleDrawQuestion} color="#2196F3" />
      </View>
      <View style={{ width: '100%', marginBottom: 15 }}>
        <Button title="🎉 Reward" onPress={handleDrawReward} color="#4CAF50" />
      </View>
      <View style={{ width: '100%', marginBottom: 30 }}>
        <Button title="⚠️ Penalty" onPress={handleDrawPenalty} color="#f44336" />
      </View>
      <View style={{ width: '100%' }}>
        <Button title="Back to Home" onPress={() => router.push('/')} color="#666" />
      </View>
    </View>
  );
}
