import penaltiesGroupData from '../assets/cards/penalties-group.json';
import penaltiesData from '../assets/cards/pentalties.json';
import questionsData from '../assets/cards/questions.json';
import rewardsData from '../assets/cards/rewards.json';
import { Card, CardType, EffectCard, QuestionCard } from '../types/Card';
import { shuffle } from '../utils/shuffle';

type RawEffectCard = {
  id: string;
  title: string;
  content: string;
};

type RawQuestionCard = {
  id: string;
  type: string;
  number: number;
  question: string;
  answers: QuestionCard['answers'];
};

export type GameEngine = {
  drawCard: (type: CardType) => Card;
  resetAll: () => void;
};

export function createGameEngine(): GameEngine {
  let drawPiles: Record<CardType, Card[]> = {
    question: [],
    reward: [],
    penalty: [],
    penaltyGroup: [],
  };

  let discardPiles: Record<CardType, Card[]> = {
    question: [],
    reward: [],
    penalty: [],
    penaltyGroup: [],
  };

  const toQuestionCard = (raw: RawQuestionCard): QuestionCard => ({
    id: raw.id,
    type: 'question',
    number: raw.number,
    question: raw.question,
    answers: raw.answers,
  });

  const loadEffectCards = (rawData: RawEffectCard[], type: EffectCard['type']): EffectCard[] => {
    return rawData.map((item) => ({
      type,
      id: item.id,
      title: item.title,
      text: item.content,
    }));
  };

  const initializePiles = (): void => {
    const rawQuestions: RawQuestionCard[] = [...questionsData];
    const rawRewards: RawEffectCard[] = [...rewardsData];
    const rawPenalties: RawEffectCard[] = [...penaltiesData];
    const rawGroupPenalties: RawEffectCard[] = [...penaltiesGroupData];

    drawPiles.question = shuffle(rawQuestions.map(toQuestionCard));
    drawPiles.reward = shuffle(loadEffectCards(rawRewards, 'reward'));
    drawPiles.penalty = shuffle(loadEffectCards(rawPenalties, 'penalty'));
    drawPiles.penaltyGroup = shuffle(loadEffectCards(rawGroupPenalties, 'penaltyGroup'));

    discardPiles.question = [];
    discardPiles.reward = [];
    discardPiles.penalty = [];
    discardPiles.penaltyGroup = [];
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
      case 'question': {
        const rawQuestions: RawQuestionCard[] = [...questionsData];
        drawPiles.question = shuffle(rawQuestions.map(toQuestionCard));
        break;
      }
      case 'reward':
        drawPiles.reward = shuffle(loadEffectCards([...rewardsData], 'reward'));
        break;
      case 'penalty':
        drawPiles.penalty = shuffle(loadEffectCards([...penaltiesData], 'penalty'));
        break;
      case 'penaltyGroup':
        drawPiles.penaltyGroup = shuffle(loadEffectCards([...penaltiesGroupData], 'penaltyGroup'));
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

    if (card.type === 'question') {
      return { ...card, answers: shuffle([...card.answers]) };
    }

    return card;
  };

  initializePiles();

  return {
    drawCard: drawFromPile,
    resetAll: initializePiles,
  };
}
