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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20, fontWeight: 'bold' }}>Draw a Card</Text>
      <Button title="Question" onPress={handleDrawQuestion} />
      <View style={{ marginTop: 10 }}>
        <Button title="Reward" onPress={handleDrawReward} />
      </View>
      <View style={{ marginTop: 10 }}>
        <Button title="Penalty" onPress={handleDrawPenalty} />
      </View>
      <View style={{ marginTop: 20 }}>
        <Button title="Back to Home" onPress={() => router.push('/')} />
      </View>
    </View>
  );
}
