import React from 'react';
import { Button, Text, View } from 'react-native';
import { useGameStore } from '../store/gameStore';

export function DrawScreen({ navigation }: any) {
  const drawCard = useGameStore((state) => state.drawCard);

  const handleDrawQuestion = () => {
    drawCard('question');
    navigation.navigate('Card');
  };

  const handleDrawReward = () => {
    drawCard('reward');
    navigation.navigate('Card');
  };

  const handleDrawPenalty = () => {
    drawCard('penalty');
    navigation.navigate('Card');
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
        <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  );
}
