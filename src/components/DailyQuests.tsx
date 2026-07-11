"use client";

import { usePlayer } from "@/context/PlayerContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { QUESTS } from "@/lib/constants";
import { CheckCircle2, Circle, Trophy } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

export default function DailyQuests() {
  const { player } = usePlayer();
  const { workoutHistory, completedQuests } = player;

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Missões Diárias</CardTitle>
          <CardDescription>Desafios para guiar seu treino e provar seu valor.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {QUESTS.map((quest) => {
            const isCompleted = completedQuests.includes(quest.id);
            return (
              <div key={quest.id} className={`flex items-start gap-4 p-4 rounded-lg ${isCompleted ? 'bg-primary/10' : 'bg-card'}`}>
                {isCompleted ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 shrink-0" />
                ) : (
                  <Circle className="h-6 w-6 text-muted-foreground mt-1 shrink-0" />
                )}
                <div>
                  <p className={`font-semibold ${isCompleted ? 'text-primary-foreground' : ''}`}>{quest.title}</p>
                  <p className="text-sm text-muted-foreground">{quest.description}</p>
                </div>
                {isCompleted && <Trophy className="h-6 w-6 text-yellow-400 ml-auto shrink-0" />}
              </div>
            );
          })}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Arquivo de Treino</CardTitle>
          <CardDescription>Um registro completo de todas as suas sessões de treino.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[24rem]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Atividade</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workoutHistory.length > 0 ? (
                  workoutHistory.map((workout) => (
                    <TableRow key={workout.id}>
                      <TableCell className="font-medium">{workout.activity}</TableCell>
                      <TableCell><Badge variant="outline">{workout.duration} min</Badge></TableCell>
                      <TableCell>{format(new Date(workout.date), "d MMM, yyyy")}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">Nenhum histórico ainda. Hora de treinar!</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
