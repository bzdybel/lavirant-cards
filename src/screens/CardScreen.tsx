import React, { useState } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { EffectCard, QuestionCard } from '../types/Card';

export function CardScreen({ navigation }: any) {
  const currentCard = useGameStore((state) => state.currentCard);
  const [revealCorrect, setRevealCorrect] = useState<boolean>(false);

  if (!currentCard) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 16 }}>No card loaded</Text>
      </View>
    );
  }

  const isQuestion = currentCard.type === 'question';
  const questionCard = currentCard as QuestionCard;
  const effectCard = currentCard as EffectCard;

  const handleReveal = () => setRevealCorrect(true);

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
      <View style={{ marginBottom: 30 }}>
        {isQuestion ? (
          <>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' }}>
              Question #{questionCard.number}
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 30, color: '#555', lineHeight: 28 }}>
              {questionCard.question}
            </Text>

            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' }}>
              Answers
            </Text>
            {questionCard.answers.map((answer) => {
              const isCorrect = answer.isCorrect;
              const isHighlighted = revealCorrect && isCorrect;
              const borderColor = isHighlighted ? '#4CAF50' : '#ccc';
              const backgroundColor = isHighlighted ? '#f1f8f4' : '#fff';

              return (
                <View
                  key={answer.id}
                  style={{
                    marginBottom: 12,
                    padding: 0,
                    borderWidth: isHighlighted ? 3 : 2,
                    borderColor,
                    borderRadius: 8,
                    backgroundColor,
                    overflow: 'hidden',
                  }}
                >
                  <View style={{ padding: 12 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#333',
                        marginBottom: 8,
                        fontWeight: '500',
                      }}
                    >
                      {answer.id}. {answer.text}
                    </Text>
                    {isHighlighted && (
                      <Text
                        style={{
                          fontSize: 12,
                          color: '#4CAF50',
                          fontWeight: 'bold',
                        }}
                      >
                        ✓ Correct
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}

            <View style={{ marginTop: 10 }}>
              {!revealCorrect ? (
                <Button title="Show Correct Answer" onPress={handleReveal} color="#2196F3" />
              ) : (
                <Button
                  title="Next Question"
                  onPress={() => {
                    setRevealCorrect(false);
                    navigation.navigate('Draw');
                  }}
                  color="#4CAF50"
                />
              )}
            </View>
          </>
        ) : (
          <>
            <View
              style={{
                backgroundColor: currentCard.type === 'reward' ? '#e8f5e9' : '#ffebee',
                borderWidth: 2,
                borderColor: currentCard.type === 'reward' ? '#4CAF50' : '#f44336',
                borderRadius: 12,
                padding: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  marginBottom: 12,
                  color: currentCard.type === 'reward' ? '#2e7d32' : '#c62828',
                }}
              >
                {currentCard.type === 'reward' ? '🎉 Reward' : '⚠️ Penalty'}
              </Text>
              <Text style={{ fontSize: 18, color: '#333', lineHeight: 28 }}>
                {effectCard.text}
              </Text>
            </View>
          </>
        )}
      </View>

      <View style={{ marginTop: 30, marginBottom: 20 }}>
        <Button
          title="Back to Draw"
          onPress={() => navigation.navigate('Draw')}
          color="#666"
        />
      </View>
    </ScrollView>
  );
}
