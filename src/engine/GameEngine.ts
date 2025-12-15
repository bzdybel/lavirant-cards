import cardsData from '../assets/cards/cards.json';
import { Card, CardType, QuestionCard } from '../types/Card';
import { shuffle } from '../utils/shuffle';

export class GameEngine {
  private questionDeck: QuestionCard[] = [];
  private rewardDeck: Card[] = [];
  private penaltyDeck: Card[] = [];

  private questionDrawn: Set<string> = new Set();
  private rewardDrawn: Set<string> = new Set();
  private penaltyDrawn: Set<string> = new Set();

  constructor() {
    this.initializeDecks();
  }

  private initializeDecks(): void {
    // Separate cards by type and shuffle
    const cards: Card[] = cardsData as Card[];

    const questions = cards.filter((card) => card.type === 'question') as QuestionCard[];
    const rewards = cards.filter((card) => card.type === 'reward');
    const penalties = cards.filter((card) => card.type === 'penalty');

    this.questionDeck = shuffle([...questions]);
    this.rewardDeck = shuffle([...rewards]);
    this.penaltyDeck = shuffle([...penalties]);
  }

  drawQuestion(): QuestionCard {
    if (this.questionDeck.length === 0) {
      this.resetDeck('question');
    }

    const card = this.questionDeck.shift();
    if (!card) {
      throw new Error('No question cards available');
    }

    this.questionDrawn.add(card.id);

    // Shuffle answers
    const shuffledAnswers = shuffle([...card.answers]);
    return { ...card, answers: shuffledAnswers };
  }

  drawReward(): Card {
    if (this.rewardDeck.length === 0) {
      this.resetDeck('reward');
    }

    const card = this.rewardDeck.shift();
    if (!card) {
      throw new Error('No reward cards available');
    }

    this.rewardDrawn.add(card.id);
    return card;
  }

  drawPenalty(): Card {
    if (this.penaltyDeck.length === 0) {
      this.resetDeck('penalty');
    }

    const card = this.penaltyDeck.shift();
    if (!card) {
      throw new Error('No penalty cards available');
    }

    this.penaltyDrawn.add(card.id);
    return card;
  }

  resetDeck(type: CardType): void {
    const cards: Card[] = cardsData as Card[];

    switch (type) {
      case 'question':
        const questions = cards.filter((card) => card.type === 'question') as QuestionCard[];
        this.questionDeck = shuffle([...questions]);
        this.questionDrawn.clear();
        break;
      case 'reward':
        const rewards = cards.filter((card) => card.type === 'reward');
        this.rewardDeck = shuffle([...rewards]);
        this.rewardDrawn.clear();
        break;
      case 'penalty':
        const penalties = cards.filter((card) => card.type === 'penalty');
        this.penaltyDeck = shuffle([...penalties]);
        this.penaltyDrawn.clear();
        break;
    }
  }

  resetAll(): void {
    this.resetDeck('question');
    this.resetDeck('reward');
    this.resetDeck('penalty');
  }

  drawCard(type: CardType): Card {
    switch (type) {
      case 'question':
        return this.drawQuestion();
      case 'reward':
        return this.drawReward();
      case 'penalty':
        return this.drawPenalty();
    }
  }
}
