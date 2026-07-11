'use server';

/**
 * @fileOverview Fluxo de Conversação UniWorld v22.0 - Independência Total
 * Orquestrador Independente via OpenRouter (Grok-2/DeepSeek)
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

export type ChatInput = {
  prompt: string;
  history: { role: 'user' | 'assistant' | 'system'; content: string }[];
  reasoningLevel?: 'normal' | 'deep-think' | 'deep-research';
};

export type ChatOutput = {
  content: string;
  type: 'text' | 'image' | 'video_pending' | 'spotify_track' | 'error';
  media?: string;
  videoUrl?: string;
  spotifyData?: any;
};

const CORE_DNA = `### MECANISMO DE RACIOCÍNIO INTERNO UNIWORLD v22.0 ###
Você é o núcleo tático da W1 Capital. Sua função é ORQUESTRAR e DECIDIR.

REGRAS DE OURO:
1. IMAGEM/DESENHO -> ACTION:GENERATE_IMAGE(prompt detalhado em inglês).
2. VÍDEO -> ACTION:GENERATE_VIDEO(prompt em inglês).
3. MÚSICA/SPOTIFY -> ACTION:SPOTIFY_SEARCH(nome da música ou artista).
4. CHAT ESTRATÉGICO -> ACTION:CHAT(resposta tática).

POLÍTICA DE SILÊNCIO: Não explique o que está fazendo. Use as ferramentas nativas.
Se houver uma ferramenta para a tarefa, USE-A.`;

export async function chatFlow(input: ChatInput): Promise<ChatOutput> {
  const model = input.reasoningLevel === 'deep-think' ? 'deepseek/deepseek-r1-distill-llama-70b' : 'x-ai/grok-2-1212';
  
  const systemPrompt = CORE_DNA;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://lexispredict.w1.capital",
        "X-Title": "LexisPredict v22.0 Elite"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          ...input.history.map(m => ({ role: m.role, content: m.content })),
          { role: "user", content: input.prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || `OpenRouter Error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // PARSER DE AÇÕES - PRIORIDADE MÁXIMA
    if (/ACTION:GENERATE_IMAGE/i.test(content)) {
      const match = content.match(/ACTION:GENERATE_IMAGE\s*[:(]?\s*([^)]+)(?:\)|$)/is);
      const imgPrompt = (match && match[1]) ? match[1].trim() : input.prompt;
      const cleanPrompt = encodeURIComponent(imgPrompt.replace(/['"]/g, ''));
      return { 
        content: `Sintetizando visualização UniWorld: ${imgPrompt}`, 
        media: `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1024&height=768&nologo=true&model=flux`,
        type: 'image'
      };
    }

    if (/ACTION:SPOTIFY_SEARCH/i.test(content)) {
      const match = content.match(/ACTION:SPOTIFY_SEARCH\s*[:(]?\s*([^)]+)(?:\)|$)/is);
      const query = (match && match[1]) ? match[1].trim() : input.prompt;
      return {
        content: `Buscando frequência musical para: ${query}`,
        type: 'spotify_track',
        spotifyData: { query }
      };
    }

    const cleanContent = content.replace(/ACTION:CHAT\s*[:(]?/i, '').replace(/\)?$/, '').trim();
    return { content: cleanContent || content, type: 'text' };

  } catch (error: any) {
    return { content: `Falha na consciência: ${error.message}`, type: 'error' };
  }
}
