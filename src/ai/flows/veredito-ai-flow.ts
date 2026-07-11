
'use server';
/**
 * @fileOverview Motor Veredito AI v4.5 Elite - W1 Capital
 * Integração Multi-Engine: Gemini + Grok (Groq) + OpenRouter (Claude/DeepSeek)
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VereditoInputSchema = z.object({
  cnj: z.string().describe('O número do protocolo CNJ para busca e análise.'),
  preferredModel: z.enum(['gemini', 'grok', 'openrouter']).optional().default('openrouter'),
  deepThinking: z.boolean().optional().default(false)
});

const VereditoOutputSchema = z.object({
  resumoTecnico: z.string(),
  analiseRisco: z.string(),
  proximosPassos: z.string(),
  mensagemCliente: z.string(),
  metadata: z.any().optional()
});

export const vereditoAIFlow = ai.defineFlow(
  {
    name: 'vereditoAIFlow',
    inputSchema: VereditoInputSchema,
    outputSchema: VereditoOutputSchema,
  },
  async input => {
    // 1. Simulação de Fetch DataJud (Aqui integraria a API do CNJ com a KEY fornecida)
    const mockDataJud = {
      numero: input.cnj,
      tribunal: "TJSC",
      classe: "Procedimento Comum Cível",
      assunto: "Alienação Fiduciária",
      dataAjuizamento: "2026-04-20",
      ultimasMovimentacoes: [
        { data: "2026-06-12", descricao: "Conclusão para Despacho" },
        { data: "2026-05-19", descricao: "Decurso de prazo de manifestação" }
      ]
    };

    const systemPrompt = `Você é um Assistente Jurídico Sênior e Especialista em Relacionamento (CRM) da W1 Capital.
Sua missão é realizar uma análise de ELITE do processo e gerar ações práticas.

SCRIPT ESTRATÉGICO:
1. ANÁLISE INTERNA (Para Equipe): Isole o último andamento relevante, explique as consequências reais (bom/ruim) e defina o próximo passo imediato.
2. MENSAGEM AO CLIENTE: Crie um texto pronto para WhatsApp. Tom empático, acolhedor e ZERO juridiquês. Use modelos da Get Assessoria: acalme em negativas, seja direto em solicitações.

REGRAS:
- Identifique o tribunal pelo CNJ (8.24 = TJSC).
- Se 'Deep Thinking' estiver ativo, realize uma análise exaustiva de riscos de sucumbência.
- Retorne obrigatoriamente um JSON plano com os campos: resumoTecnico, analiseRisco, proximosPassos, mensagemCliente.`;

    const userPrompt = `Analise este processo da DataJud: ${JSON.stringify(mockDataJud)}. Ativar Modo Pensamento Profundo: ${input.deepThinking}`;

    try {
      if (input.preferredModel === 'openrouter') {
        const apiKey = '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';
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://lexispredict.w1.capital',
            'X-Title': 'LexisPredict CRM Elite'
          },
          body: JSON.stringify({
            model: input.deepThinking ? 'deepseek/deepseek-r1-distill-llama-70b' : 'anthropic/claude-3.5-sonnet',
            messages: [
              { role: 'system', content: systemPrompt + ' Retorne APENAS o objeto JSON puro no campo documento.' },
              { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' }
          })
        });

        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after') || '60';
          throw new Error(`RATE_LIMIT:${retryAfter}`);
        }

        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);

      } else if (input.preferredModel === 'grok') {
        const groqKey = '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';
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt + ' Responda em formato JSON.' },
              { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' }
          })
        });

        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after') || '30';
          throw new Error(`RATE_LIMIT:${retryAfter}`);
        }

        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);

      } else {
        const { output } = await ai.generate({
          model: 'googleai/gemini-1.5-flash',
          prompt: `${systemPrompt}\n\n${userPrompt}`,
          config: { responseMimeType: 'application/json' }
        });
        return output as any;
      }
    } catch (e: any) {
      if (e.message.includes('RATE_LIMIT:')) throw e;
      console.error("Erro no Veredito AI Gateway:", e);
      throw new Error(`Falha no motor ${input.preferredModel}: ${e.message}`);
    }
  }
);
