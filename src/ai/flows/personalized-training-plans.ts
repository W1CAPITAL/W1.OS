// filename: src/ai/flows/personalized-training-plans.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized training plans based on user input.
 *
 * - generateTrainingPlan - A function that generates a personalized training plan.
 * - TrainingPlanInput - The input type for the generateTrainingPlan function.
 * - TrainingPlanOutput - The return type for the generateTrainingPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrainingPlanInputSchema = z.object({
  currentLevel: z.number().describe('The user\u0027s current level.'),
  availableTime: z
    .string()
    .describe(
      'The amount of time the user has available for training (e.g., \u002730 minutes per day\u0027, \u00271 hour every other day\u0027).'
    ),
  fitnessGoals: z
    .string()
    .describe(
      'The user\u0027s fitness goals (e.g., \u0027increase strength\u0027, \u0027improve endurance\u0027, \u0027lose weight\u0027).'
    ),
});

export type TrainingPlanInput = z.infer<typeof TrainingPlanInputSchema>;

const TrainingPlanOutputSchema = z.object({
  trainingPlan: z
    .string()
    .describe('A personalized training plan based on the user\u0027s input.'),
});

export type TrainingPlanOutput = z.infer<typeof TrainingPlanOutputSchema>;

export async function generateTrainingPlan(
  input: TrainingPlanInput
): Promise<TrainingPlanOutput> {
  return generateTrainingPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTrainingPlanPrompt',
  input: {schema: TrainingPlanInputSchema},
  output: {schema: TrainingPlanOutputSchema},
  prompt: `You are an expert personal trainer. Generate a personalized training plan for the user based on their current level, available time, and fitness goals.

Current Level: {{{currentLevel}}}
Available Time: {{{availableTime}}}
Fitness Goals: {{{fitnessGoals}}}

Training Plan:`,
});

const generateTrainingPlanFlow = ai.defineFlow(
  {
    name: 'generateTrainingPlanFlow',
    inputSchema: TrainingPlanInputSchema,
    outputSchema: TrainingPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
