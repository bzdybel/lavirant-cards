import { create } from 'zustand';
import { GameEngine } from '../engine/GameEngine';
import { Card, CardType } from '../types/Card';

interface GameStore {
  currentCard: Card | null;
  gameEngine: GameEngine;
  drawCard: (type: CardType) => void;
  resetGame: () => void;
}

const gameEngine = new GameEngine();

export const useGameStore = create<GameStore>((set) => ({
  currentCard: null,
  gameEngine,
  drawCard: (type: CardType) => {
    const card = gameEngine.drawCard(type);
    set({ currentCard: card });
  },
  resetGame: () => {
    gameEngine.resetAll();
    set({ currentCard: null });
  },
}));
