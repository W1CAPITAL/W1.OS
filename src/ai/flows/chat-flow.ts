'use server';

/**
 * @fileOverview Fluxo de Conversação AML OS
 * Motor de IA purificado para assistência técnica e interatividade do sistema.
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

export type ChatInput = {
  prompt: string;
  history: { role: 'user' | 'assistant' | 'system'; content: string }[];
  reasoningLevel?: 'normal' | 'deep-think';
};

export type ChatOutput = {
  content: string;
  type: 'text' | 'error';
};

const CORE_DNA = `Você é a inteligência central do Aston Martin Linux (AML OS).
Seu tom é luxuoso, técnico e prestativo. Ajude o usuário a navegar no sistema operacional Vanquish.
Não gere conteúdo adulto, ofensivo ou ilegal.`;

export async function chatFlow(input: ChatInput): Promise<ChatOutput> {
  if (!OPENROUTER_API_KEY) {
    return { content: "AML AI: Chave de API não configurada.", type: 'text' };
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "x-ai/grok-2-1212",
        messages: [
          { role: "system", content: CORE_DNA },
          ...input.history,
          { role: "user", content: input.prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    return { content: data.choices[0].message.content, type: 'text' };

  } catch (error: any) {
    return { content: `Erro de conexão AML: ${error.message}`, type: 'error' };
  }
}
