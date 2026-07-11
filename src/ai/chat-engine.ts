'use server';

/**
 * MOTOR DE INTELIGÊNCIA UNIWORLD v20.0 ELITE
 * Arquitetura: Independent OpenRouter Orchestrator
 */

import { chatFlow, type ChatInput, type ChatOutput } from '@/ai/flows/chat-flow';

export type ReasoningLevel = 'normal' | 'deep-think' | 'deep-research';

export async function processarIA(prompt: string, historico: any[], level: ReasoningLevel = 'normal'): Promise<ChatOutput> {
  try {
    const input: ChatInput = {
      prompt,
      history: historico.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : m.role,
        content: m.content
      })),
      reasoningLevel: level
    };
    
    return await chatFlow(input);
  } catch (error: any) {
    console.error("Erro no motor UniWorld v20:", error);
    return { 
      content: `O motor UniWorld falhou: ${error.message}.`, 
      type: 'error' 
    };
  }
}
