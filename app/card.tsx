import { useGameStore } from '@/src/store/gameStore';
import { EffectCard, QuestionCard } from '@/src/types/Card';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';

export default function CardScreen() {
  const router = useRouter();
  const currentCard = useGameStore((state) => state.currentCard);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

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

  const handleAnswerSelect = (answerId: string) => {
    if (!selectedAnswer) {
      setSelectedAnswer(answerId);
    }
  };

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
              Select an answer:
            </Text>
            {questionCard.answers.map((answer) => {
              const isSelected = selectedAnswer === answer.id;
              const isCorrect = answer.isCorrect;
              let borderColor = '#ccc';
              let backgroundColor = '#fff';

              if (isSelected && isCorrect) {
                borderColor = '#4CAF50';
                backgroundColor = '#f1f8f4';
              } else if (isSelected && !isCorrect) {
                borderColor = '#f44336';
                backgroundColor = '#fef5f4';
              }

              return (
                <View
                  key={answer.id}
                  style={{
                    marginBottom: 12,
                    padding: 0,
                    borderWidth: isSelected ? 3 : 2,
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
                    {isSelected && (
                      <Text
                        style={{
                          fontSize: 12,
                          color: isCorrect ? '#4CAF50' : '#f44336',
                          fontWeight: 'bold',
                        }}
                      >
                        {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                      </Text>
                    )}
                  </View>
                  {!isSelected && (
                    <Button
                      title="Select"
                      onPress={() => handleAnswerSelect(answer.id)}
                      color="#2196F3"
                    />
                  )}
                  {isSelected && (
                    <Button
                      title="Next Question"
                      onPress={() => {
                        setSelectedAnswer(null);
                        router.push('/draw');
                      }}
                      color={isCorrect ? '#4CAF50' : '#f44336'}
                    />
                  )}
                </View>
              );
            })}
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
          onPress={() => router.push('/draw')}
          color="#666"
        />
      </View>
    </ScrollView>
  );
}
