export type CardType = 'question' | 'reward' | 'penalty';

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuestionCard {
  type: 'question';
  id: string;
  number: number;
  question: string;
  answers: Answer[];
}

export interface EffectCard {
  type: 'reward' | 'penalty';
  id: string;
  text: string;
}

export type Card = QuestionCard | EffectCard;
