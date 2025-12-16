import penaltiesData from '../assets/cards/pentalties.json';
import questionsData from '../assets/cards/questions.json';
import rewardsData from '../assets/cards/rewards.json';
import { Card, CardType, EffectCard, QuestionCard } from '../types/Card';
import { shuffle } from '../utils/shuffle';

export type GameEngine = {
  drawCard: (type: CardType) => Card;
  resetAll: () => void;
};

export function createGameEngine(): GameEngine {
  let drawPiles: Record<CardType, Card[]> = {
    question: [],
    reward: [],
    penalty: [],
  };

  let discardPiles: Record<CardType, Card[]> = {
    question: [],
    reward: [],
    penalty: [],
  };

  const loadEffectCards = (rawData: any[], type: 'reward' | 'penalty'): EffectCard[] => {
    return rawData.map((item) => ({
      type,
      id: item.id,
      title: item.title,
      text: item.content,
    }));
  };

  const initializePiles = (): void => {
    drawPiles.question = shuffle([...questionsData] as QuestionCard[]);
    drawPiles.reward = shuffle(loadEffectCards(rewardsData as any[], 'reward'));
    drawPiles.penalty = shuffle(loadEffectCards(penaltiesData as any[], 'penalty'));

    discardPiles.question = [];
    discardPiles.reward = [];
    discardPiles.penalty = [];
  };

  const recycleDiscardIntoDraw = (type: CardType): void => {
    const discard = discardPiles[type];
    if (discard.length === 0) {
      return;
    }
    drawPiles[type] = shuffle([...discard]);
    discardPiles[type] = [];
  };

  const ensureDrawAvailable = (type: CardType): void => {
    if (drawPiles[type].length > 0) {
      return;
    }

    recycleDiscardIntoDraw(type);
    if (drawPiles[type].length > 0) {
      return;
    }

    // Fallback: reload from source data (only if source is empty or corrupted)
    switch (type) {
      case 'question':
        drawPiles.question = shuffle([...questionsData] as QuestionCard[]);
        break;
      case 'reward':
        drawPiles.reward = shuffle(loadEffectCards(rewardsData as any[], 'reward'));
        break;
      case 'penalty':
        drawPiles.penalty = shuffle(loadEffectCards(penaltiesData as any[], 'penalty'));
        break;
    }
  };

  const drawFromPile = (type: CardType): Card => {
    ensureDrawAvailable(type);

    const card = drawPiles[type].shift();
    if (!card) {
      throw new Error(`No ${type} cards available`);
    }

    discardPiles[type].push(card);

    if (type === 'question') {
      const question = card as QuestionCard;
      return { ...question, answers: shuffle([...question.answers]) };
    }

    return card;
  };

  initializePiles();

  return {
    drawCard: drawFromPile,
    resetAll: initializePiles,
  };
}
