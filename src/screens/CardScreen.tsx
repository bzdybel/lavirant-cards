import React from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { EffectCard, QuestionCard } from '../types/Card';

export function CardScreen({ navigation }: any) {
  const currentCard = useGameStore((state) => state.currentCard);

  if (!currentCard) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text>No card loaded</Text>
      </View>
    );
  }

  const isQuestion = currentCard.type === 'question';
  const questionCard = currentCard as QuestionCard;
  const effectCard = currentCard as EffectCard;

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <View style={{ marginBottom: 20 }}>
        {isQuestion ? (
          <>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Question #{questionCard.number}
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 20 }}>{questionCard.text}</Text>

            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>Answers:</Text>
            {questionCard.answers.map((answer) => (
              <View
                key={answer.id}
                style={{
                  marginBottom: 10,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 5,
                }}
              >
                <Button
                  title={answer.text}
                  onPress={() => {
                    // Answer selection logic can be added here
                    navigation.navigate('Draw');
                  }}
                />
              </View>
            ))}
          </>
        ) : (
          <>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              {currentCard.type === 'reward' ? 'Reward' : 'Penalty'}
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 20 }}>{effectCard.text}</Text>
          </>
        )}
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="Back to Draw" onPress={() => navigation.navigate('Draw')} />
      </View>
    </ScrollView>
  );
}
