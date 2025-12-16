import penaltiesData from '../assets/cards/pentalties.json';
import questionsData from '../assets/cards/questions.json';
import rewardsData from '../assets/cards/rewards.json';
import { Card, CardType, EffectCard, QuestionCard } from '../types/Card';
import { shuffle } from '../utils/shuffle';

type Deck<T = Card> = T[];

export class GameEngine {
  private decks: Record<CardType, Deck> = {
    question: [],
    reward: [],
    penalty: [],
  };

  constructor() {
    this.initializeDecks();
  }

  private loadEffectCards(rawData: any[], type: 'reward' | 'penalty'): EffectCard[] {
    return rawData.map((item) => ({
      type,
      id: item.id,
      text: `${item.title}: ${item.content}`,
    }));
  }

  private initializeDecks(): void {
    this.decks.question = shuffle([...questionsData] as QuestionCard[]);
    this.decks.reward = shuffle(this.loadEffectCards(rewardsData as any[], 'reward'));
    this.decks.penalty = shuffle(this.loadEffectCards(penaltiesData as any[], 'penalty'));
  }

  private drawFromDeck(type: CardType): Card {
    if (this.decks[type].length === 0) {
      this.resetDeck(type);
    }

    const card = this.decks[type].shift();
    if (!card) {
      throw new Error(`No ${type} cards available`);
    }

    if (type === 'question') {
      return { ...card, answers: shuffle([...(card as QuestionCard).answers]) } as QuestionCard;
    }

    return card;
  }

  private resetDeck(type: CardType): void {
    switch (type) {
      case 'question':
        this.decks.question = shuffle([...questionsData] as QuestionCard[]);
        break;
      case 'reward':
        this.decks.reward = shuffle(this.loadEffectCards(rewardsData as any[], 'reward'));
        break;
      case 'penalty':
        this.decks.penalty = shuffle(this.loadEffectCards(penaltiesData as any[], 'penalty'));
        break;
    }
  }

  drawCard(type: CardType): Card {
    return this.drawFromDeck(type);
  }

  resetAll(): void {
    this.initializeDecks();
  }
}
