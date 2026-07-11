
'use server';
/**
 * @fileOverview Gerador de Documentos IA v2.6 Elite - Get Assessoria
 * Extração de 8 campos críticos e preenchimento de Procuração Ad Judicia.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DocumentInputSchema = z.object({
  dadosBrutos: z.string().describe('Texto bruto ou PDF extraído para gerar o documento.'),
  preferredModel: z.enum(['gemini', 'grok', 'openrouter']).optional().default('openrouter')
});

const DocumentOutputSchema = z.object({
  conteudoFormatado: z.string(),
  metadata: z.any().optional()
});

export const documentFlow = ai.defineFlow(
  {
    name: 'documentFlow',
    inputSchema: DocumentInputSchema,
    outputSchema: DocumentOutputSchema,
  },
  async input => {
    const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    
    const systemPrompt = `Você é um Assistente Jurídico Sênior da Get Assessoria (W1 Capital).
Sua tarefa é preencher a procuração "Ad Judicia" com precisão cirúrgica.

REGRAS DE OURO:
1. Extraia: Nome, Nacionalidade, Estado Civil, Profissão, RG, CPF, Endereço e E-mail.
2. Se faltar algo, use [INSERIR DADO].
3. Mantenha DIEGO GOMES DIAS e o CNPJ do Banco Votorantim (59.588.111/0001-03) fixos.
4. Use tags de formato: [CENTER] para centralizar, ** para negrito.

MODELO OBRIGATÓRIO:
[CENTER]**PROCURAÇÃO “AD JUDICIA”**[/CENTER]

**[NOME DO CLIENTE]**, [Nacionalidade], [Estado Civil], [Profissão], portador do RG sob Nº [RG] e devidamente inscrito no CPF sob Nº [CPF], residente e domiciliado à [Endereço Completo], com endereço eletrônico: [Email], neste ato nomeia como seu procurador:

**DIEGO GOMES DIAS**, brasileiro, advogado, inscrito na OAB/SP sob o número 370.898, com endereço profissional na Av. São Miguel, nº 4810 – Jardim Cotinha – São Paulo – SP – CEP: 03870-100, e endereço eletrônico: diego_gomesdias@yahoo.com.br.

**PODERES:** Por este instrumento particular de mandato, a outorgante retro referenciada nomeia e constitui seu bastante procurador o advogado também acima qualificado... agir nos autos da AÇÃO DE REVISÃO CONTRATUAL COM PEDIDO DE TUTELA DE URGÊNCIA promovida contra o **BANCO VOTORANTIM S/A**, inscrito no CNPJ nº **59.588.111/0001-03**.

[CENTER]São Paulo, ${today}.[/CENTER]

[CENTER]____________________________________________________[/CENTER]
[CENTER]**[NOME DO CLIENTE]**[/CENTER]`;

    try {
      if (input.preferredModel === 'openrouter') {
        const apiKey = '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';
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://lexispredict.w1.capital',
            'X-Title': 'LexisPredict Docs Elite'
          },
          body: JSON.stringify({
            model: 'anthropic/claude-3.5-sonnet',
            messages: [
              { role: 'system', content: 'Retorne apenas o texto formatado da procuração no campo "documento" de um JSON.' },
              { role: 'user', content: `Dados do cliente: ${input.dadosBrutos}` }
            ],
            response_format: { type: 'json_object' }
          })
        });
        
        const data = await response.json();
        const content = JSON.parse(data.choices[0].message.content);
        return { conteudoFormatado: content.documento || content };
      }
      
      // Fallback para Gemini
      const { output } = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: `${systemPrompt}\n\nDados brutos: ${input.dadosBrutos}`
      });
      
      return { conteudoFormatado: output.text };
    } catch (e: any) {
      console.error("Erro no Gerador de Docs:", e);
      throw new Error(`Falha na geração: ${e.message}`);
    }
  }
);
