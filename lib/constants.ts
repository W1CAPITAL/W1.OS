export type Stat = 'strength' | 'endurance' | 'agility' | 'intelligence';

export const STATS: Stat[] = ['strength', 'endurance', 'agility', 'intelligence'];

export const INITIAL_PLAYER_STATE = {
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  stats: {
    strength: 5,
    endurance: 5,
    agility: 5,
    intelligence: 5,
  },
  workoutHistory: [],
  completedQuests: [],
};

export const QUESTS = [
  { id: 'first_workout', title: 'Primeiro Sangue', description: 'Complete sua primeira sessão de treino.' },
  { id: 'one_hour_workout', title: 'Guerreiro Persistente', description: 'Complete um treino de 1 hora.' },
  { id: 'run_10k', title: 'Maratonista', description: 'Corra ou caminhe 10 quilômetros.' },
  { id: 'reach_level_2', title: 'Um Novo Poder', description: 'Alcance o Nível 2.' },
  { id: 'strength_10', title: 'Força em Ascensão', description: 'Alcance 10 de Força.' },
  { id: 'endurance_10', title: 'Vigor Inabalável', description: 'Alcance 10 de Resistência.' },
];

export const WORKOUT_QUESTS = [
  { 
    id: 'pushups_100', 
    title: '100 Flexões',
    imageUrl: 'https://picsum.photos/seed/man-doing-push-up/400/225',
    imageHint: 'man push-up'
  },
  { 
    id: 'situps_100', 
    title: '100 Abdominais',
    imageUrl: 'https://picsum.photos/seed/woman-doing-sit-up/400/225',
    imageHint: 'woman sit-up'
  },
  { 
    id: 'squats_100', 
    title: '100 Agachamentos',
    imageUrl: 'https://picsum.photos/seed/man-doing-squat/400/225',
    imageHint: 'man squat'
  },
  { 
    id: 'run_10k_workout', 
    title: 'Corrida de 10km',
    imageUrl: 'https://picsum.photos/seed/woman-running-outdoors/400/225',
    imageHint: 'woman running'
  },
];
