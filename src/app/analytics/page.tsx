
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Users, Scale, Download, RefreshCcw
} from 'lucide-react';
import { getStoredCases } from '@/lib/server-db';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AnalyticsPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await getStoredCases();
    setCases(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const total = cases.length || 1;
    const courtData = cases.reduce((acc: any, c) => {
      acc[c.tribunal || 'Outros'] = (acc[c.tribunal || 'Outros'] || 0) + 1;
      return acc;
    }, {});
    const attorneyData = cases.reduce((acc: any, c) => {
      acc[c.advogado || 'Não Atribuído'] = (acc[c.advogado || 'Não Atribuído'] || 0) + 1;
      return acc;
    }, {});
    
    return { total: cases.length, courtData, attorneyData };
  }, [cases]);

  return (
    <div className="flex h-screen bg-[#f3f2f2] text-black overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-72 bg-white/50 backdrop-blur-md">
        <header className="h-20 border-b-2 border-black bg-white flex items-center justify-between px-10 shrink-0 z-10 shadow-sm">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Analytics Hub</h1>
            <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">W1 Capital • Business Intelligence</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={load} className="border-2 border-black">
              <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            </Button>
            <Button onClick={() => window.print()} className="bg-black text-white hover:bg-black/90 font-black uppercase text-xs h-12 px-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Download size={16} className="mr-2" /> Exportar Dados
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-10 space-y-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
              <CardHeader className="border-b-2 border-black bg-black/5">
                <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
                  <Scale size={18} /> Concentração por Tribunal
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {Object.entries(stats.courtData).sort((a: any, b: any) => b[1] - a[1]).map(([court, count]: any) => (
                    <div key={court} className="group cursor-default">
                      <div className="flex justify-between text-[10px] font-black uppercase mb-1.5">
                        <span>{court}</span>
                        <span>{count} processos ({Math.round((count / (stats.total || 1)) * 100)}%)</span>
                      </div>
                      <div className="h-4 w-full bg-black/5 border-2 border-black rounded-none overflow-hidden">
                        <div 
                          className="h-full bg-black transition-all duration-1000 group-hover:bg-blue-600" 
                          style={{ width: `${(count / (stats.total || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
              <CardHeader className="border-b-2 border-black bg-black/5">
                <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
                  <Users size={18} /> Carga por Advogado
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {Object.entries(stats.attorneyData).sort((a: any, b: any) => b[1] - a[1]).map(([name, count]: any) => (
                    <div key={name} className="group cursor-default">
                      <div className="flex justify-between text-[10px] font-black uppercase mb-1.5">
                        <span>{name}</span>
                        <span>{count} processos ({Math.round((count / (stats.total || 1)) * 100)}%)</span>
                      </div>
                      <div className="h-4 w-full bg-black/5 border-2 border-black rounded-none overflow-hidden">
                        <div 
                          className="h-full bg-black transition-all duration-1000 group-hover:bg-emerald-600" 
                          style={{ width: `${(count / (stats.total || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <footer className="h-12 bg-white border-t-2 border-black flex items-center justify-center px-10 shrink-0 text-[9px] font-black uppercase">
          <p>2026 W1 Capital. Todos os direitos reservados. Relatório Consolidado • FUNDADOR DAVI ALVES FIGUEREDO</p>
        </footer>
      </main>
    </div>
  );
}
