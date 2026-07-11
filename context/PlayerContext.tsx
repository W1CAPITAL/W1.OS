"use client";

import React, { createContext, useContext } from 'react';
import { INITIAL_PLAYER_STATE, Stat } from '@/lib/constants';

export interface Workout {
  id: string;
  activity: string;
  duration: number; // in minutes
  distance?: number; // in kilometers
  intensity: 'low' | 'medium' | 'high';
  date: string;
  gains: {
    xp: number;
    stats: Partial<Record<Stat, number>>;
  };
}

export interface PlayerState {
  level: number;
  xp: number;
  xpToNextLevel: number;
  stats: Record<Stat, number>;
  workoutHistory: Workout[];
  completedQuests: string[];
}

interface PlayerContextType {
  player: PlayerState;
  logWorkout: (data: { activity: string; duration: number; intensity: 'low' | 'medium' | 'high', distance?: number }) => void;
  resetProgress: () => void;
}

// This context is now just for type safety and providing a default value.
// The actual implementation is in PlayerClientContext.tsx
export const PlayerContext = createContext<PlayerContextType>({
    player: INITIAL_PLAYER_STATE,
    logWorkout: () => console.error('PlayerProvider not yet initialized'),
    resetProgress: () => console.error('PlayerProvider not yet initialized'),
});

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer deve ser usado dentro de um PlayerProvider');
  }
  return context;
}
