import { create } from 'zustand';
import { GameEngine } from '../engine/GameEngine';
import { Card, CardType } from '../types/Card';

interface GameStore {
  currentCard: Card | null;
  drawCard: (type: CardType) => Card;
  resetGame: () => void;
}

const gameEngine = new GameEngine();

export const useGameStore = create<GameStore>((set) => ({
  currentCard: null,
  drawCard: (type: CardType) => {
    const card = gameEngine.drawCard(type);
    set({ currentCard: card });
    return card;
  },
  resetGame: () => {
    gameEngine.resetAll();
    set({ currentCard: null });
  },
}));
