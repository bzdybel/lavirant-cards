import penaltiesData from '../assets/cards/pentalties.json';
import questionsData from '../assets/cards/questions.json';
import rewardsData from '../assets/cards/rewards.json';
import { Card, CardType, EffectCard, QuestionCard } from '../types/Card';
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
    // Load questions
    const questions = (questionsData as unknown as QuestionCard[]);

    // Load penalties and convert to EffectCard format
    const penaltiesRaw = (penaltiesData as any[]);
    const penalties: EffectCard[] = penaltiesRaw.map((p) => ({
      type: 'penalty' as const,
      id: p.id,
      text: `${p.title}: ${p.content}`,
    }));

    // Load rewards and convert to EffectCard format
    const rewardsRaw = (rewardsData as any[]);
    const rewards: EffectCard[] = rewardsRaw.map((r) => ({
      type: 'reward' as const,
      id: r.id,
      text: `${r.title}: ${r.content}`,
    }));

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
    switch (type) {
      case 'question':
        const questions = (questionsData as unknown as QuestionCard[]);
        this.questionDeck = shuffle([...questions]);
        this.questionDrawn.clear();
        break;
      case 'reward':
        const rewardsRaw = (rewardsData as any[]);
        const rewards: EffectCard[] = rewardsRaw.map((r) => ({
          type: 'reward' as const,
          id: r.id,
          text: `${r.title}: ${r.content}`,
        }));
        this.rewardDeck = shuffle([...rewards]);
        this.rewardDrawn.clear();
        break;
      case 'penalty':
        const penaltiesRaw = (penaltiesData as any[]);
        const penalties: EffectCard[] = penaltiesRaw.map((p) => ({
          type: 'penalty' as const,
          id: p.id,
          text: `${p.title}: ${p.content}`,
        }));
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
