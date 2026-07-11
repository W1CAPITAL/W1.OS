"use client";

import { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";
import { getTrainingPlan } from "./actions";

const planSchema = z.object({
  availableTime: z.string().min(3, "Por favor, descreva seu tempo disponível."),
  fitnessGoals: z.string().min(3, "Por favor, descreva seus objetivos de fitness."),
});

export default function TrainingPlanForm() {
  const { player } = usePlayer();
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof planSchema>>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      availableTime: "",
      fitnessGoals: "",
    },
  });

  async function onSubmit(values: z.infer<typeof planSchema>) {
    setIsLoading(true);
    setGeneratedPlan(null);
    setError(null);
    
    const input = {
      currentLevel: player.level,
      ...values,
    };

    const result = await getTrainingPlan(input);

    if (result.success) {
      setGeneratedPlan(result.plan);
    } else {
      setError(result.error || "Ocorreu um erro desconhecido.");
    }
    
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Seus Detalhes</CardTitle>
          <CardDescription>Forneça algumas informações para gerar seu plano. Seu nível atual é {player.level}.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="availableTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo Disponível</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: '30 minutos por dia, 3 vezes por semana'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fitnessGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metas de Fitness</FormLabel>
                    <FormControl>
                      <Textarea placeholder="ex: 'Aumentar a força e construir músculos'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Gerar Plano
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Erro</CardTitle>
            <CardDescription className="text-destructive">{error}</CardDescription>
          </CardHeader>
        </Card>
      )}

      {generatedPlan && (
        <Card className="border-primary bg-primary/10">
          <CardHeader>
            <CardTitle className="font-headline text-primary">Seu Plano de Treino Gerado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
              {generatedPlan}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
