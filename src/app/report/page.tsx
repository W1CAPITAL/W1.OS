
"use client";

import { useEffect, useState } from "react";
import { getStoredCases, getStoredNotes, CaseNote } from "@/lib/server-db";
import { Button } from "@/components/ui/button";
import { Printer, ChevronLeft, ShieldCheck, BadgeCheck, FileText, Activity, Users, Scale } from "lucide-react";
import Link from "next/link";

export default function UnifiedReportPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [notes, setNotes] = useState<CaseNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [c, n] = await Promise.all([getStoredCases(), getStoredNotes()]);
      setCases(c || []);
      setNotes(n || []);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div className="p-20 text-center text-black font-black uppercase tracking-widest animate-pulse">Compilando Relatório Unificado W1 Capital...</div>;

  const stats = {
    total: cases.length,
    vencidos: cases.filter(c => c.status === 'Vencido').length,
    atencao: cases.filter(c => c.status === 'Atenção' || c.status === 'É Hoje').length,
    noPrazo: cases.filter(c => c.status === 'No Prazo').length,
    arquivados: cases.filter(c => c.status === 'Arquivado').length,
    taxaRisco: cases.length ? Math.round(((cases.filter(c => c.status === 'Vencido' || c.status === 'Atenção').length) / cases.length) * 100) : 0
  };

  const courtData = cases.reduce((acc: any, c) => {
    acc[c.tribunal] = (acc[c.tribunal] || 0) + 1;
    return acc;
  }, {});

  const attorneyData = cases.reduce((acc: any, c) => {
    acc[c.advogado] = (acc[c.advogado] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto p-12 bg-white text-black min-h-screen shadow-2xl print:shadow-none print:p-0">
      {/* HEADER PRINT CONTROL */}
      <div className="flex justify-between items-center mb-12 print:hidden border-b-2 border-black pb-6">
        <Button variant="outline" asChild size="sm" className="border-2 border-black font-black uppercase text-[10px]">
          <Link href="/"><ChevronLeft className="mr-2 h-4 w-4" /> Voltar ao Gabinete</Link>
        </Button>
        <Button onClick={() => window.print()} className="bg-black hover:bg-black/90 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-[10px]">
          <Printer className="mr-2 h-4 w-4" /> Salvar PDF Oficial (Word Style)
        </Button>
      </div>

      {/* DOCUMENT HEADER */}
      <div className="border-b-4 border-black pb-8 mb-12 text-center">
        <div className="flex justify-center mb-6"><ShieldCheck size={64} className="text-black" /></div>
        <h1 className="text-5xl font-black tracking-tighter uppercase leading-none mb-2">Relatório Jurídico Consolidado</h1>
        <p className="text-sm font-black mt-2 tracking-[0.3em] uppercase opacity-60">W1 CAPITAL • GESTÃO DE ATIVOS E PROCESSOS</p>
        <div className="flex justify-between mt-12 text-[10px] font-black uppercase border-y-2 border-black/5 py-4">
          <span className="flex items-center gap-2"><BadgeCheck size={12} /> Emissor: Davi Alves Figueredo</span>
          <span>Data de Emissão: {new Date().toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      {/* SECTION 1: KPI ANALYTICS */}
      <section className="mb-16">
        <h2 className="bg-black text-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
          <Activity size={14} /> 01. Panorama Operacional (Real-Time)
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="border-2 border-black p-6">
            <p className="text-[9px] font-black opacity-40 uppercase mb-1">Total de Processos</p>
            <p className="text-4xl font-black tracking-tighter">{stats.total}</p>
          </div>
          <div className="border-2 border-black p-6 bg-red-50">
            <p className="text-[9px] font-black text-red-600 uppercase mb-1">Vencidos/Críticos</p>
            <p className="text-4xl font-black text-red-600 tracking-tighter">{stats.vencidos}</p>
          </div>
          <div className="border-2 border-black p-6 bg-amber-50">
            <p className="text-[9px] font-black text-amber-600 uppercase mb-1">Taxa de Risco</p>
            <p className="text-4xl font-black text-amber-600 tracking-tighter">{stats.taxaRisco}%</p>
          </div>
          <div className="border-2 border-black p-6">
            <p className="text-[9px] font-black opacity-40 uppercase mb-1">Processos Ativos</p>
            <p className="text-4xl font-black tracking-tighter">{stats.noPrazo + stats.atencao}</p>
          </div>
        </div>
      </section>

      {/* SECTION 2: ANALYTICS HUB DATA */}
      <section className="mb-16">
        <h2 className="bg-black text-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
          <Scale size={14} /> 02. Inteligência de Distribuição
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xs font-black uppercase mb-6 flex items-center gap-2"><ChevronLeft size={12}/> Concentração por Tribunal</h3>
            <div className="space-y-4">
              {Object.entries(courtData).sort((a: any, b: any) => b[1] - a[1]).slice(0, 8).map(([name, count]: any) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span>{name}</span>
                    <span>{count} processos</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                    <div className="h-full bg-black transition-all" style={{ width: `${(count / stats.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase mb-6 flex items-center gap-2"><Users size={12}/> Carga Operacional por Advogado</h3>
            <div className="space-y-4">
              {Object.entries(attorneyData).sort((a: any, b: any) => b[1] - a[1]).slice(0, 8).map(([name, count]: any) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span>{name}</span>
                    <span>{count} processos</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                    <div className="h-full bg-black transition-all" style={{ width: `${(count / stats.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: NOTES & UPDATES */}
      <section className="mb-16 page-break-before">
        <h2 className="bg-black text-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
          <FileText size={14} /> 03. Dossiê de Anotações & Evidências
        </h2>
        {notes.length === 0 ? (
          <p className="text-[11px] italic text-black/40 border-2 border-dashed border-black/10 p-12 text-center uppercase font-black">Nenhuma anotação estratégica vinculada à auditoria.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {notes.map(note => (
              <div key={note.id} className="border-l-8 border-black bg-black/5 p-8 break-inside-avoid shadow-sm">
                <div className="flex justify-between items-start mb-4 border-b border-black/10 pb-2">
                  <h3 className="text-sm font-black uppercase tracking-tight">{note.title}</h3>
                  <span className="text-[10px] font-mono font-bold opacity-40">{new Date(note.created_at).toLocaleString('pt-BR')}</span>
                </div>
                <p className="text-[11px] text-black/80 leading-relaxed whitespace-pre-wrap mb-6">{note.content}</p>
                {note.image_url && (
                  <div className="border-2 border-black rounded-lg overflow-hidden max-w-2xl mx-auto">
                     <img src={note.image_url} alt="Evidência" className="w-full h-auto grayscale" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER SIGNATURE */}
      <div className="mt-24 border-t-4 border-black pt-10 text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-black/40 mb-4">Documento Gerado via LexisPredict v240.0 Elite</p>
        <p className="text-2xl font-black uppercase text-black tracking-tighter">Davi Alves Figueredo</p>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">W1 CAPITAL • DIRETOR DE OPERAÇÕES JURÍDICAS</p>
        <div className="mt-10 max-w-2xl mx-auto p-6 border-2 border-black/5 bg-black/5 text-[8px] uppercase font-bold tracking-tighter leading-relaxed">
          ESTE RELATÓRIO CONTÉM INFORMAÇÕES ESTRATÉGICAS E CONFIDENCIAIS DE PROPRIEDADE DA W1 CAPITAL. 
          QUALQUER REPRODUÇÃO NÃO AUTORIZADA ESTÁ SUJEITA A SANÇÕES ADMINISTRATIVAS E PENAIS. 
          SISTEMA AUDITADO E PROTEGIDO POR GOVERNANÇA DE DADOS SUPABASE POSTGRESQL.
        </div>
      </div>
    </div>
  );
}
