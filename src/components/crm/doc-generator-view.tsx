"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Upload, Copy, Download, Loader2, ShieldCheck, Zap, UserCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { gerarDocumentoIA } from "@/ai/veredito-ai-engine";
import { cn } from "@/lib/utils";

export default function DocGeneratorView() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Lazy loading do pdf.js via script dinâmico para evitar super keyword error
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.js';
    script.onload = () => {
      const pdfjs: any = (window as any).pdfjsLib;
      pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';
    };
    document.head.appendChild(script);
  }, []);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const pdfjs: any = (window as any).pdfjsLib;
    if (!pdfjs) {
      toast({ title: "Aguarde", description: "Motor de extração PDF carregando...", variant: "default" });
      return;
    }

    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      let text = '';
      // Focamos nas primeiras páginas (preâmbulo) para extração cirúrgica
      const pagesToScan = Math.min(pdf.numPages, 5);
      for (let i = 1; i <= pagesToScan; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ') + '\n';
      }
      setInput(text);
      toast({ title: "PDF Processado", description: "Texto extraído com sucesso. Clique em Gerar Minuta." });
    } catch (err) {
      toast({ title: "Erro no PDF", description: "Não foi possível ler o arquivo.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const res = await gerarDocumentoIA({ dadosBrutos: input });
      if (res.success) {
        setResult(res);
        toast({ title: "Sucesso", description: "Procuração preenchida com precisão V51." });
      } else {
        throw new Error(res.error);
      }
    } catch (err: any) {
      toast({ title: "Falha na IA", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToWord = () => {
    if (!result) return;
    const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    const c = result.cliente;
    const b = result.banco;
    const p = result.procurador;

    const text = `PROCURAÇÃO “AD JUDICIA”

${c.nome || '[NOME DO CLIENTE]'}, ${c.nacionalidade || 'brasileiro(a)'}, ${c.estadoCivil || '[ESTADO CIVIL]'}, ${c.profissao || '[PROFISSÃO]'}, portador do RG sob Nº ${c.rg || '[RG]'} e devidamente inscrito no CPF sob Nº ${c.cpf || '[CPF]'}, residente e domiciliado à ${c.endereco || '[ENDEREÇO COMPLETO]'}, com endereço eletrônico: ${c.email || '[EMAIL]'}, neste ato nomeia como seu procurador:

${p.nome}, brasileiro, advogado, inscrito na OAB/SP sob o número ${p.oab}, com endereço profissional na ${p.endereco}, e endereço eletrônico: ${p.email}.

PODERES: Por este instrumento particular de mandato, o(a) outorgante retro referenciada nomeia e constitui seu bastante procurador o advogado também acima qualificado, a quem confere amplos poderes para o foro em geral, com a cláusula “AD JUDICIA”, em qualquer Juízo, Instância ou Tribunal, podendo propor contra quem de direito as ações competentes e defendê-la nas contrárias, seguindo umas e outras, até final decisão, usando os recursos legais e acompanhando-os, conferindo-lhes, ainda, poderes especiais para desistir, transigir, firmar compromissos ou acordos, receber e dar quitação, agindo em conjunto ou separadamente e independente da ordem de nomeação, podendo substabelecer esta em outrem, com ou sem reservas de iguais poderes, especialmente para, na defesa dos interesses do(a) outorgante, agir nos autos da AÇÃO DE REVISÃO CONTRATUAL COM PEDIDO DE TUTELA DE URGÊNCIA promovida contra o ${b.nome}, inscrito no CNPJ nº ${b.cnpj}.

São Paulo, ${today}.

____________________________________________________
${c.nome || '[NOME DO CLIENTE]'}`;

    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", description: "Minuta pronta para colar no Microsoft Word." });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase flex items-center gap-3">
            <UserCheck className="text-primary" /> Gerador de Documentos V15.0 Elite
          </h2>
          <p className="text-zinc-500 text-sm italic">Fidelidade Judicial W1 Capital: Extração inteligente e preenchimento automático.</p>
        </div>
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <Button variant="outline" className="gap-2 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800" asChild>
              <span><Upload size={16} /> Subir Contrato (PDF)</span>
            </Button>
            <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} disabled={loading} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Card className="bg-zinc-900/50 border-zinc-800 shadow-inner">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">Entrada de Dados Brutos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Cole aqui o texto do contrato ou arraste o PDF para extração automática..."
                className="min-h-[450px] bg-black border-zinc-800 text-[11px] font-mono leading-relaxed focus:ring-primary/50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button onClick={handleGenerate} className="w-full bg-primary hover:bg-primary/80 font-black tracking-tighter h-12" disabled={loading || !input}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Zap size={16} className="mr-2" />}
                GERAR PROCURAÇÃO AUTOMÁTICA
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className={cn(
            "min-h-[600px] transition-all duration-700 relative overflow-hidden",
            result ? "bg-white text-black shadow-2xl scale-[1.01]" : "bg-zinc-900/20 border-zinc-800 text-zinc-700 border-dashed"
          )}>
            <CardHeader className="border-b border-zinc-100 flex flex-row items-center justify-between bg-zinc-50/50">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} className={result ? "text-green-600" : "text-zinc-400"} /> Preview Oficial (Fidelidade Word)
              </CardTitle>
              {result && (
                <Button variant="ghost" size="sm" onClick={copyToWord} className="h-7 gap-2 text-[10px] font-bold border border-zinc-200">
                  <Copy size={12}/> Copiar p/ Word
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-12 font-serif text-[13px] leading-relaxed">
              {!result ? (
                <div className="h-full flex flex-col items-center justify-center opacity-10 py-40">
                  <FileText size={80} className="mb-4" />
                  <p className="font-sans text-[10px] font-black tracking-widest uppercase">Aguardando dados para preenchimento...</p>
                </div>
              ) : (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <p className="text-center font-bold mb-12 uppercase tracking-tighter underline">PROCURAÇÃO “AD JUDICIA”</p>
                  
                  <p className="mb-8 text-justify">
                    <strong>{result.cliente.nome || '[NOME DO CLIENTE]'}</strong>, {result.cliente.nacionalidade || 'brasileiro(a)'}, {result.cliente.estadoCivil || '[ESTADO CIVIL]'}, {result.cliente.profissao || '[PROFISSÃO]'}, portador do RG sob Nº {result.cliente.rg || '[RG]'} e devidamente inscrito no CPF sob Nº {result.cliente.cpf || '[CPF]'}, residente e domiciliado à {result.cliente.endereco || '[ENDEREÇO COMPLETO]'}, com endereço eletrônico: {result.cliente.email || '[EMAIL]'}, neste ato nomeia como seu procurador:
                  </p>

                  <p className="mb-8 text-justify">
                    <strong>{result.procurador.nome}</strong>, brasileiro, advogado, inscrito na OAB/SP sob o número {result.procurador.oab}, com endereço profissional na {result.procurador.endereco}, e endereço eletrônico: {result.procurador.email}.
                  </p>

                  <p className="mb-12 text-justify">
                    <strong>PODERES:</strong> Por este instrumento particular de mandato, o(a) outorgante retro referenciada nomeia e constitui seu bastante procurador o advogado também acima qualificado, a quem confere amplos poderes para o foro em geral, com a cláusula “AD JUDICIA”, em qualquer Juízo, Instância ou Tribunal, podendo propor contra quem de direito as ações competentes e defendê-la nas contrárias, seguindo umas e outras, até final decisão, usando os recursos legais e acompanhando-os, conferindo-lhes, ainda, poderes especiais para desistir, transigir, firmar compromissos ou acordos, receber e dar quitação, agindo em conjunto ou separadamente e independente da ordem de nomeação, podendo substabelecer esta em outrem, com ou sem reservas de iguais poderes, especialmente para, na defesa dos interesses do(a) outorgante, agir nos autos da <span className="underline font-bold">AÇÃO DE REVISÃO CONTRATUAL COM PEDIDO DE TUTELA DE URGÊNCIA</span> promovida contra o <strong>{result.banco.nome}</strong>, inscrito no CNPJ nº <strong>{result.banco.cnpj}</strong>.
                  </p>

                  <div className="mt-20 text-center">
                    <p className="mb-16">São Paulo, {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}.</p>
                    <div className="border-t border-black w-64 mx-auto mb-2" />
                    <p className="font-bold uppercase text-[12px]">{result.cliente.nome || '[NOME DO CLIENTE]'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
