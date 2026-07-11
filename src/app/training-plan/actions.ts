'use server';

import { generateTrainingPlan as generateTrainingPlanFlow, TrainingPlanInput } from '@/ai/flows/personalized-training-plans';

export async function getTrainingPlan(input: TrainingPlanInput) {
  try {
    const result = await generateTrainingPlanFlow(input);
    return { success: true, plan: result.trainingPlan };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Falha ao gerar o plano de treino. Por favor, tente novamente.' };
  }
}
