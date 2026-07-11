"use client";

import { usePlayer } from "@/context/PlayerContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, HeartPulse, Rabbit, Brain, ShieldQuestion } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./ui/button";

const statIcons: Record<string, ReactNode> = {
  strength: <Dumbbell className="h-4 w-4 text-muted-foreground" />,
  endurance: <HeartPulse className="h-4 w-4 text-muted-foreground" />,
  agility: <Rabbit className="h-4 w-4 text-muted-foreground" />,
  intelligence: <Brain className="h-4 w-4 text-muted-foreground" />,
};

const StatCard = ({ name, value }: { name: string; value: number }) => {
    const statNameMapping: { [key: string]: string } = {
        strength: 'Força',
        endurance: 'Resistência',
        agility: 'Agilidade',
        intelligence: 'Inteligência'
    };

    return (
        <Card className="bg-card/50 shadow-inner">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">{statNameMapping[name] || name}</CardTitle>
                {statIcons[name] || <ShieldQuestion className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold transition-all duration-300">{value}</div>
            </CardContent>
        </Card>
    );
};

export default function StatusWindow() {
  const { player, resetProgress } = usePlayer();
  const progress = (player.xp / player.xpToNextLevel) * 100;

  return (
    <Card className="border-primary/20 shadow-lg shadow-primary/10">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="font-headline text-2xl text-primary">Janela de Status</CardTitle>
            <CardDescription>Suas estatísticas e progressão de caçador atuais.</CardDescription>
          </div>
          <Button variant="destructive" size="sm" onClick={resetProgress}>Resetar</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between font-mono text-sm">
            <span className="font-bold text-lg">NV. {player.level}</span>
            <span className="text-muted-foreground">
              {player.xp} / {player.xpToNextLevel} XP
            </span>
          </div>
          <Progress value={progress} className="h-3 [&>div]:bg-accent" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(player.stats).map(([stat, value]) => (
            <StatCard key={stat} name={stat} value={value} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
