"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { usePlayer } from "@/context/PlayerContext";
import { ScrollArea } from "./ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Dumbbell, Flame, Play, Square, RefreshCw, Coffee, Check } from "lucide-react";
import { Badge } from "./ui/badge";
import { WORKOUT_QUESTS } from "@/lib/constants";
import { Progress } from "./ui/progress";
import Image from "next/image";

type WorkoutState = 'idle' | 'exercising' | 'resting' | 'finished';

const REST_DURATION = 30; // 30 segundos de descanso

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

export default function SystemLog() {
  const { logWorkout, player } = usePlayer();
  const [workoutState, setWorkoutState] = useState<WorkoutState>('idle');
  const [currentQuestIndex, setCurrentQuestIndex] = useState(0);
  const [restTimer, setRestTimer] = useState(REST_DURATION);

  const currentQuest = WORKOUT_QUESTS[currentQuestIndex];

  // Efeito para o cronômetro de descanso
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (workoutState === 'resting' && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(t => t - 1);
      }, 1000);
    } else if (workoutState === 'resting' && restTimer <= 0) {
      const nextIndex = currentQuestIndex + 1;
      if (nextIndex < WORKOUT_QUESTS.length) {
        setCurrentQuestIndex(nextIndex);
        setWorkoutState('exercising');
        setRestTimer(REST_DURATION);
      } else {
        setWorkoutState('finished');
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [workoutState, restTimer, currentQuestIndex]);

  // Efeito para registrar o treino ao finalizar
  useEffect(() => {
    if (workoutState === 'finished') {
      logWorkout({
        activity: "Treino Diário Guiado",
        duration: WORKOUT_QUESTS.length * 2, // Duração estimada em minutos
        intensity: "medium",
      });
    }
  }, [workoutState, logWorkout]);

  const startGuidedWorkout = () => {
    setCurrentQuestIndex(0);
    setRestTimer(REST_DURATION);
    setWorkoutState('exercising');
  };
  
  const markExerciseAsDone = () => {
    setWorkoutState('resting');
  };

  const resetWorkout = () => {
    setWorkoutState('idle');
    setCurrentQuestIndex(0);
    setRestTimer(REST_DURATION);
  };
  
  const renderIdleState = () => (
    <Card className="border-accent/20 shadow-lg shadow-accent/10">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-accent">Pronto para Treinar?</CardTitle>
        <CardDescription>Complete suas missões diárias com nosso treino guiado.</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
         <div className="text-left bg-card p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">Missões de Hoje:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
              {WORKOUT_QUESTS.map(q => <li key={q.id}>{q.title}</li>)}
            </ul>
        </div>
        <Button size="lg" className="w-full bg-accent hover:bg-accent/90" onClick={startGuidedWorkout}>
            <Play className="mr-2 h-5 w-5" /> Iniciar Treino Guiado
        </Button>
      </CardContent>
    </Card>
  );

  const renderWorkoutState = () => (
    <Card className="border-accent/20 shadow-lg shadow-accent/10 overflow-hidden">
        <CardHeader className="text-center pb-2">
            <CardTitle className="font-headline text-2xl text-accent">
            {currentQuest.title}
            </CardTitle>
            <CardDescription>
                Exercício {currentQuestIndex + 1} de {WORKOUT_QUESTS.length}
            </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                <Image 
                    src={currentQuest.imageUrl} 
                    alt={`Ilustração para ${currentQuest.title}`}
                    width={400}
                    height={225}
                    className="object-cover"
                    data-ai-hint={currentQuest.imageHint}
                />
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="w-full" onClick={markExerciseAsDone}>
                    <Check className="mr-2 h-5 w-5" /> Concluído
                </Button>
            </div>
            <Button size="sm" variant="destructive" className="w-full mt-2" onClick={resetWorkout}>
                <Square className="mr-2 h-5 w-5" /> Parar e Descartar
            </Button>
        </CardContent>
    </Card>
  );

  const renderRestState = () => {
    const restProgress = ((REST_DURATION - restTimer) / REST_DURATION) * 100;
    const nextQuest = WORKOUT_QUESTS[currentQuestIndex + 1];

    return (
        <Card className="border-primary/20 shadow-lg shadow-primary/10 flex flex-col items-center justify-center text-center p-6">
            <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Hora do Descanso</CardTitle>
                <CardDescription>
                    {nextQuest ? `Próximo: ${nextQuest.title}`: "Finalizando..."}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 w-full">
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                    <Coffee className="w-12 h-12 text-blue-400" />
                    <p className="absolute font-mono text-6xl font-bold">{formatTime(restTimer)}</p>
                </div>
                <Progress value={restProgress} className="h-2 [&>div]:bg-primary" />
            </CardContent>
        </Card>
    );
  };

  const renderFinishedState = () => (
     <Card className="border-green-500/50 shadow-lg shadow-green-500/10">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl text-green-500">Treino Concluído!</CardTitle>
        <CardDescription>Você completou todas as missões. Bom trabalho, caçador!</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p>Seu progresso foi salvo. Volte amanhã para novos desafios.</p>
        <Button size="lg" className="w-full" onClick={resetWorkout}>
            <RefreshCw className="mr-2 h-5 w-5" /> Iniciar Novo Treino
        </Button>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch(workoutState) {
      case 'idle': return renderIdleState();
      case 'exercising': return renderWorkoutState();
      case 'resting': return renderRestState();
      case 'finished': return renderFinishedState();
      default: return null;
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      {renderContent()}
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Mensagens do Sistema</CardTitle>
          <CardDescription>Registro de suas atividades e ganhos recentes.</CardDescription>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4 pr-4">
                {player.workoutHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center">Nenhuma atividade registrada ainda.</p>
                ) : (
                  player.workoutHistory.map((workout) => (
                    <div key={workout.id} className="flex items-start gap-4 text-sm">
                      <Dumbbell className="h-5 w-5 mt-1 text-primary shrink-0" />
                      <div className="flex-grow">
                        <p className="font-semibold">{workout.activity}</p>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Badge variant="secondary">{workout.duration} min</Badge>
                          <Badge variant="secondary" className="capitalize">{workout.intensity}</Badge>
                          <span className="text-xs">{formatDistanceToNow(new Date(workout.date), { addSuffix: true, locale: ptBR })}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-accent flex-wrap">
                          <Flame className="h-4 w-4" />
                          <span className="text-xs font-semibold">+{workout.gains.xp} XP</span>
                          {Object.entries(workout.gains.stats).map(([stat, value]) => (
                              <span key={stat} className="text-xs font-semibold capitalize">+{value} {stat}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
