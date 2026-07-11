
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  ShieldAlert, Clock, AlertCircle, CheckCircle2, 
  Zap, Scale, Filter, Search, RefreshCcw
} from 'lucide-react';
import { getStoredCases } from '@/lib/server-db';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function UrgencyEnginePage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await getStoredCases();
    setCases(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const criticalCases = useMemo(() => {
    return cases
      .filter(c => c.status === 'Vencido' || c.status === 'Atenção' || c.status === 'É Hoje')
      .sort((a, b) => (a.diasFaltando || 0) - (b.diasFaltando || 0));
  }, [cases]);

  return (
    <div className="flex h-screen bg-[#f3f2f2] text-black overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-72 bg-white/50 backdrop-blur-md">
        <header className="h-20 border-b-2 border-black bg-white flex items-center justify-between px-10 shrink-0 z-10 shadow-sm">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-red-600">Urgency Engine</h1>
            <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">W1 Capital • Algoritmo de Prioridade</p>
          </div>
          <Button variant="outline" size="icon" onClick={loadData} className="border-2 border-black">
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          </Button>
        </header>

        <div className="flex-1 overflow-auto p-10 space-y-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UrgencyStat label="Prazos Vencidos" value={cases.filter(c => c.status === 'Vencido').length} color="bg-red-600" />
            <UrgencyStat label="Atenção Máxima" value={cases.filter(c => c.status === 'Atenção').length} color="bg-orange-500" />
            <UrgencyStat label="Vencimentos Hoje" value={cases.filter(c => c.status === 'É Hoje').length} color="bg-black" />
          </div>

          <Card className="border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden flex flex-col min-h-[400px]">
            <div className="bg-black text-white p-4 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shrink-0">
              <Zap size={14} /> Fila de Prioridade Atômica
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b-2 border-black sticky top-0 z-10">
                  <tr>
                    <th className="p-4 font-black uppercase">Cliente</th>
                    <th className="p-4 font-black uppercase">Tribunal</th>
                    <th className="p-4 font-black uppercase">Responsável</th>
                    <th className="p-4 font-black uppercase text-center">Dias</th>
                    <th className="p-4 font-black uppercase text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black">
                  {loading ? (
                    <tr><td colSpan={5} className="p-20 text-center font-black uppercase animate-pulse">Consultando carga crítica...</td></tr>
                  ) : criticalCases.length > 0 ? (
                    criticalCases.map((c) => (
                      <tr key={c.id} className="hover:bg-black hover:text-white transition-colors group cursor-default">
                        <td className="p-4 font-bold uppercase truncate max-w-[200px]">{c.cliente}</td>
                        <td className="p-4 font-black text-blue-600 group-hover:text-white">{c.tribunal}</td>
                        <td className="p-4 font-bold uppercase">{c.advogado}</td>
                        <td className={cn("p-4 font-black text-center text-sm", (c.diasFaltando || 0) < 0 ? "text-red-600 group-hover:text-red-400" : "")}>
                          {c.diasFaltando}d
                        </td>
                        <td className="p-4 text-center">
                          <Badge className={cn(
                            "text-[9px] font-black uppercase border-2 border-none px-3 py-1",
                            c.status === 'Vencido' ? "bg-red-600 text-white" : 
                            c.status === 'Atenção' ? "bg-orange-500 text-white" : "bg-black text-white"
                          )}>
                            {c.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="p-20 text-center font-black text-black/20 uppercase">Nenhum prazo crítico no momento.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <footer className="h-12 bg-white border-t-2 border-black flex items-center justify-center px-10 shrink-0 text-[9px] font-black uppercase">
          <p>2026 W1 Capital. Todos os direitos reservados. Relatório Consolidado • FUNDADOR DAVI ALVES FIGUEREDO</p>
        </footer>
      </main>
    </div>
  );
}

function UrgencyStat({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className={cn("p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]", color === 'bg-black' ? "bg-black text-white" : "bg-white text-black")}>
      <p className="text-[10px] font-black uppercase opacity-60 mb-1">{label}</p>
      <p className="text-4xl font-black">{value}</p>
    </div>
  );
}
