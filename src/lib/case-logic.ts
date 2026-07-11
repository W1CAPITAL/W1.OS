/**
 * @fileOverview Motor de Inteligência Jurídica - W1 Capital
 * Lógica de processamento de CNJ e Prazos Operacionais
 */

export type ProceduralStatus = 'Vencido' | 'Atenção' | 'No Prazo' | 'Arquivado' | 'Sem Prazo' | 'É Hoje' | 'Encerrado';

export type CaseMovement = {
  id: string;
  data: string;
  descricao: string;
  usuario: string;
};

export type LegalCase = {
  id: string;
  cliente: string;
  protocolo: string;
  advogado: string;
  escritorio: string;
  situacao: string;
  proximoPrazo: string;
  tribunal: string;
  status: ProceduralStatus;
  diasFaltando: number | null;
  linkConsulta: string;
  observacoes?: string;
  ultimoRetorno?: string;
  tags?: string[];
  movimentacoes?: CaseMovement[];
};

export const TRIBUNAIS_CNJ: Record<string, string> = {
  "8.01": "TJAC", "8.02": "TJAL", "8.04": "TJAM", "8.05": "TJBA", 
  "8.06": "TJCE", "8.07": "TJDFT", "8.08": "TJES", "8.09": "TJGO", 
  "8.10": "TJMA", "8.11": "TJMT", "8.12": "TJMS", "8.13": "TJMG", 
  "8.14": "TJPA", "8.15": "TJPB", "8.16": "TJPR", "8.17": "TJPE", 
  "8.18": "TJPI", "8.19": "TJRJ", "8.20": "TJRN", "8.21": "TJRS", 
  "8.22": "TJRO", "8.23": "TJRR", "8.24": "TJSC", "8.25": "TJSE", 
  "8.26": "TJSP", "8.27": "TJTO", "4.01": "TRF1", "4.02": "TRF2", 
  "4.03": "TRF3", "4.04": "TRF4", "4.05": "TRF5", "4.06": "TRF6"
};

export function processarCaso(dados: any): LegalCase {
  const situacao = (dados.SITUACAO || dados.SITUAÇÃO || dados.STATUS || '').toUpperCase();
  const responsavel = (dados.ADVOGADO || dados['ADVOGADO RESPONSÁVEL'] || '').toUpperCase();
  
  let status: ProceduralStatus = 'No Prazo';
  let diasFaltando: number | null = null;
  const dataPrazoOriginal = dados['PRÓXIMO PRAZO'] || dados['PRAZO'] || dados.PROXIMO || '';

  const isEncerrado = ['ENCERRADO', 'ARQUIVADO', 'SUSPENSO', 'FINALIZADO', 'JULGADO'].some(s => situacao.includes(s)) || responsavel.includes('ENCERRADO');

  if (isEncerrado) {
    status = 'Encerrado';
  } else if (dataPrazoOriginal && dataPrazoOriginal !== '-') {
    const parts = dataPrazoOriginal.split('/');
    if (parts.length === 3) {
      const dataPrazo = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      dataPrazo.setHours(0, 0, 0, 0);

      const diffTime = dataPrazo.getTime() - hoje.getTime();
      diasFaltando = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diasFaltando < 0) status = 'Vencido';
      else if (diasFaltando === 0) status = 'É Hoje';
      else if (diasFaltando <= 7) status = 'Atenção';
      else status = 'No Prazo';
    }
  }

  let tribunal = 'Outros';
  const cnjLimpo = (dados.PROTOCOLO || dados.PROCESSO || '').replace(/[^0-9.-]/g, '');
  const match = cnjLimpo.match(/\d{7}-\d{2}.\d{4}.(\d.\d{2}).\d{4}/);
  if (match && TRIBUNAIS_CNJ[match[1]]) tribunal = TRIBUNAIS_CNJ[match[1]];

  return {
    id: dados.id || crypto.randomUUID(),
    cliente: dados.CLIENTE || dados.cliente || 'Desconhecido',
    advogado: responsavel || dados.advogado || 'Não Atribuído',
    escritorio: dados.ESCRITÓRIO || dados.escritorio || 'W1 Capital',
    protocolo: cnjLimpo || 'S/N',
    situacao: situacao,
    proximoPrazo: dataPrazoOriginal,
    tribunal,
    status,
    diasFaltando,
    linkConsulta: `https://www.google.com/search?q=consulta+processo+${cnjLimpo}`,
    ultimoRetorno: dados.ultimoRetorno || dados.RETORNO || '-',
    observacoes: dados.observacoes || dados.OBSERVAÇÕES || '',
    tags: dados.tags || [],
    movimentacoes: dados.movimentacoes || []
  };
}