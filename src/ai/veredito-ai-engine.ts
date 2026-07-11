'use server';

/**
 * @fileOverview Motor de Inteligência V50 Elite - W1 Capital
 * Provedor: Vercel AI Gateway (Proxy para Grok-2 / Claude / Gemini)
 * API Gateway Key: vck_462E1JjIICSVBXg2dxeUgnJ0Hp9krDiMO8Vizfpr9HjGWmV0hF2gZRmS
 */

const GATEWAY_URL = "https://gateway.ai.cloudflare.com/v1/daviconcentrix/lexispredict"; // Exemplo de estrutura de gateway
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';
const DEFAULT_MODEL = 'x-ai/grok-2-1212';

export async function executarVereditoAI(input: { cnj: string, deepThinking?: boolean }) {
  console.log(`[GATEWAY] Iniciando processamento via Vercel AI Gateway...`);
  
  const systemPrompt = `AJA COMO DIRETOR DE OPERAÇÕES JURÍDICAS SÊNIOR DA W1 CAPITAL.
OBJETIVO: ANALISAR O PROCESSO ${input.cnj} E GERAR AÇÕES PRÁTICAS.

DIVIDA EM:
🎯 1. VISÃO ESTRATÉGICA (Termômetro, Tradução Técnica, Alertas Críticos)
📱 2. MENSAGEM WHATSAPP (Acolhedora, SEM JURIDIQUÊS)
📅 3. GATILHO DE RETORNO

REGRAS: 
- Se houver negativa ou extinção, explique o plano B.
- Use tom empático (Rapport).
- Retorne apenas JSON: { "resumoTecnico": "...", "analiseRisco": "...", "proximosPassos": "...", "mensagemCliente": "...", "retryAfter": 0 }`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://lexispredict.w1.capital",
        "X-Title": "LexisPredict V50 Elite",
        "X-Vercel-AI-Gateway-Key": "vck_462E1JjIICSVBXg2dxeUgnJ0Hp9krDiMO8Vizfpr9HjGWmV0hF2gZRmS"
      },
      body: JSON.stringify({
        model: input.deepThinking ? 'anthropic/claude-3.5-sonnet' : DEFAULT_MODEL,
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: `Analise: ${input.cnj}` }],
        response_format: { type: "json_object" }
      })
    });

    if (response.status === 429) {
      return { success: false, error: `RATE_LIMIT:${response.headers.get('retry-after') || '60'}` };
    }

    const data = await response.json();
    console.log(`[GATEWAY] Análise concluída com sucesso.`);
    return { success: true, analysis: JSON.parse(data.choices[0].message.content) };
  } catch (error: any) {
    console.error(`[GATEWAY] Erro de rede: ${error.message}`);
    return { success: false, error: error.message };
  }
}

export async function gerarDocumentoIA(input: { dadosBrutos: string }) {
  const prompt = `AJA COMO ASSISTENTE JURÍDICO SÊNIOR. TAREFA: EXTRAÇÃO CIRÚRGICA PARA PROCURAÇÃO AD JUDICIA.
Extraia: Nome, Nacionalidade, Estado Civil, Profissão, RG, CPF, Endereço e E-mail.
Injete Banco Votorantim (59.588.111/0001-03).
Retorne JSON: { "cliente": { "nome": "...", ... }, "banco": { "nome": "Votorantim", "cnpj": "59.588.111/0001-03" } }`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`, 
        "Content-Type": "application/json",
        "X-Vercel-AI-Gateway-Key": "vck_462E1JjIICSVBXg2dxeUgnJ0Hp9krDiMO8Vizfpr9HjGWmV0hF2gZRmS"
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [{ role: "system", content: prompt }, { role: "user", content: input.dadosBrutos }],
        response_format: { type: "json_object" }
      })
    });
    const data = await response.json();
    return { success: true, data: JSON.parse(data.choices[0].message.content) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
