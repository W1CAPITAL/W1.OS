"use client";

import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { INITIAL_PLAYER_STATE, QUESTS, Stat } from '@/lib/constants';
import { Flame, Trophy } from 'lucide-react';
import { PlayerContext, type PlayerState, type Workout } from './PlayerContext';

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [player, setPlayer] = useState<PlayerState>(INITIAL_PLAYER_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem('playerState');
      if (item) {
        const savedState = JSON.parse(item);
        // Ensure all fields are present, merge with initial state
        setPlayer(prevState => ({ ...prevState, ...savedState }));
      }
    } catch (error) {
      console.error("Falha ao carregar o estado do jogador do localStorage", error);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
        try {
            window.localStorage.setItem('playerState', JSON.stringify(player));
        } catch (error) {
            console.error("Falha ao salvar o estado do jogador no localStorage", error);
        }
    }
  }, [player, isLoaded]);

  const checkQuests = useCallback((newState: PlayerState) => {
    const newCompletedQuests: string[] = [];

    QUESTS.forEach(quest => {
      if (newState.completedQuests.includes(quest.id)) return;

      let completed = false;
      switch (quest.id) {
        case 'first_workout':
          completed = newState.workoutHistory.length >= 1;
          break;
        case 'one_hour_workout':
          completed = newState.workoutHistory.some(w => w.duration >= 60);
          break;
        case 'run_10k':
            completed = newState.workoutHistory.some(w => (w.activity.toLowerCase().includes('corrida') || w.activity.toLowerCase().includes('caminhada')) && (w.distance || 0) >= 10);
            break;
        case 'reach_level_2':
          completed = newState.level >= 2;
          break;
        case 'strength_10':
          completed = newState.stats.strength >= 10;
          break;
        case 'endurance_10':
          completed = newState.stats.endurance >= 10;
          break;
      }
      
      if (completed) {
        newCompletedQuests.push(quest.id);
        toast({
          title: "Missão Completa!",
          description: (
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <span>{quest.title}</span>
            </div>
          ),
        });
      }
    });

    if (newCompletedQuests.length > 0) {
      // Use functional update to avoid race conditions
      setPlayer(p => ({ ...p, completedQuests: [...p.completedQuests, ...newCompletedQuests] }));
    }
  }, [toast]);

  const logWorkout = useCallback((data: { activity: string; duration: number; intensity: 'low' | 'medium' | 'high', distance?:number }) => {
    setPlayer(p => {
      const intensityMultipliers = { low: 1, medium: 1.5, high: 2 };
      const multiplier = intensityMultipliers[data.intensity];

      let xpGain = Math.floor(data.duration * multiplier);
      if (data.distance) {
          xpGain += Math.floor(data.distance * 10);
      }

      const statGains: Partial<Record<Stat, number>> = {};
      
      const activityLower = data.activity.toLowerCase();
      if (activityLower.includes('corrida') || activityLower.includes('cardio') || activityLower.includes('caminhada') || activityLower.includes('natação')) {
        statGains.endurance = (statGains.endurance || 0) + Math.ceil(multiplier * 1.5);
        statGains.agility = (statGains.agility || 0) + Math.ceil(multiplier * 0.5);
      } else if (activityLower.includes('treino diário guiado')) {
        statGains.strength = (statGains.strength || 0) + 1;
        statGains.endurance = (statGains.endurance || 0) + 1;
        statGains.agility = (statGains.agility || 0) + 1;
      } else if (activityLower.includes('musculação') || activityLower.includes('força') || activityLower.includes('academia')) {
        statGains.strength = (statGains.strength || 0) + Math.ceil(multiplier * 2);
      } else if (activityLower.includes('yoga') || activityLower.includes('alongamento')) {
        statGains.agility = (statGains.agility || 0) + Math.ceil(multiplier);
      } else if (activityLower.includes('estudo') || activityLower.includes('leitura')) {
        statGains.intelligence = (statGains.intelligence || 0) + Math.ceil(multiplier);
      } else {
        statGains.strength = (statGains.strength || 0) + 1;
        statGains.endurance = (statGains.endurance || 0) + 1;
      }

      const newWorkout: Workout = {
        id: new Date().toISOString(),
        ...data,
        date: new Date().toISOString(),
        gains: { xp: xpGain, stats: statGains },
      };

      let newPlayerState: PlayerState = {
        ...p,
        xp: p.xp + xpGain,
        stats: {
          strength: p.stats.strength + (statGains.strength || 0),
          endurance: p.stats.endurance + (statGains.endurance || 0),
          agility: p.stats.agility + (statGains.agility || 0),
          intelligence: p.stats.intelligence + (statGains.intelligence || 0),
        },
        workoutHistory: [newWorkout, ...p.workoutHistory],
      };

      let leveledUp = false;
      while (newPlayerState.xp >= newPlayerState.xpToNextLevel) {
        leveledUp = true;
        newPlayerState = {
          ...newPlayerState,
          level: newPlayerState.level + 1,
          xp: newPlayerState.xp - newPlayerState.xpToNextLevel,
          xpToNextLevel: Math.floor(newPlayerState.xpToNextLevel * 1.5),
        };
      }

      if (leveledUp) {
         toast({
          title: "SUBIU DE NÍVEL!",
          description: (
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-accent" />
              <span>Você alcançou o Nível {newPlayerState.level}!</span>
            </div>
          ),
        });
      }
      
      // We need to call checkQuests with the final state
      checkQuests(newPlayerState);

      return newPlayerState;
    });
  }, [checkQuests, toast]);
  
  const resetProgress = useCallback(() => {
    try {
        window.localStorage.removeItem('playerState');
    } catch (error) {
        console.error("Falha ao resetar o estado no localStorage", error);
    }
    setPlayer(INITIAL_PLAYER_STATE);
    toast({
      title: "Progresso Resetado",
      description: "Sua jornada começa de novo.",
    });
  }, [toast]);

  const value = { player, logWorkout, resetProgress };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}
