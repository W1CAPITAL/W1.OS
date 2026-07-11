
"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Search, Zap, ShieldCheck, Loader2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executarVereditoAI } from '@/ai/veredito-ai-engine';

export default function VereditoPage() {
  const [cnj, setCnj] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (!cnj) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await executarVereditoAI({ cnj, deepThinking: true });
      if (res.success) {
        setResult(res.analysis);
        toast({ title: "Análise v18.0 Elite", description: "Parecer gerado com motor Grok-2." });
      } else {
        throw new Error(res.error);
      }
    } catch (error: any) {
      toast({ 
        title: "Erro no Motor AI", 
        description: error.message || "Falha na comunicação com o gateway.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: "Mensagem pronta para envio." });
  };

  return (
    <div className="flex h-screen bg-[#f3f2f2] text-black font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-72 bg-white/50 backdrop-blur-md">
        <header className="h-20 border-b-2 border-black bg-white flex items-center justify-between px-10 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <BrainCircuit size={24} className="text-black" />
            <h1 className="text-2xl font-black uppercase tracking-tighter">Consulta Estratégica 3D</h1>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Gabinete Elite v250.0</p>
        </header>

        <div className="flex-1 overflow-auto p-10 space-y-8 custom-scrollbar">
          <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
            <CardHeader className="bg-black text-white p-6 border-b-2 border-black">
              <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
                <Search size={18} /> Analisador de Processos 360°
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Insira o protocolo CNJ completo (Ex: 5050432-10.2026...)" 
                  className="bg-white border-2 border-black h-14 text-lg font-bold placeholder:text-black/30"
                  value={cnj}
                  onChange={(e) => setCnj(e.target.value)}
                />
                <Button 
                  onClick={handleAnalysis} 
                  disabled={loading}
                  className="bg-black text-white hover:bg-black/90 h-14 px-8 font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Executar Análise'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              <div className="space-y-6">
                <section>
                  <div className="flex items-center gap-2 text-black mb-3">
                    <Zap size={16} />
                    <h3 className="text-[10px] font-black uppercase tracking-widest">🎯 1. Visão Estratégica (Equipe)</h3>
                  </div>
                  <div className="bg-white border-2 border-black p-8 space-y-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <div>
                      <p className="text-[9px] text-black/40 uppercase font-black mb-1">Status Operacional</p>
                      <p className="text-xs font-bold text-black leading-relaxed whitespace-pre-wrap">{result.resumoTecnico}</p>
                    </div>
                    <div className="pt-4 border-t-2 border-black/10">
                      <p className="text-[9px] text-red-600 uppercase font-black mb-1">Análise de Risco & Impacto</p>
                      <p className="text-xs font-bold text-black leading-relaxed">{result.analiseRisco}</p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-black">
                      <ShieldCheck size={16} />
                      <h3 className="text-[10px] font-black uppercase tracking-widest">💬 2. Mensagem Humanizada (WhatsApp)</h3>
                    </div>
                    <Button 
                      variant="outline" size="sm" 
                      onClick={() => copyToClipboard(result.mensagemCliente)}
                      className="h-8 border-2 border-black font-black uppercase text-[9px]"
                    >
                      <Copy size={12} className="mr-2" /> Copiar Texto
                    </Button>
                  </div>
                  <div className="bg-white border-2 border-black p-10 italic text-black font-bold text-sm leading-relaxed relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] min-h-[250px]">
                    <span className="absolute top-4 left-4 text-4xl text-black/10 font-serif">“</span>
                    {result.mensagemCliente}
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>

        <footer className="h-12 bg-white border-t-2 border-black flex items-center justify-center px-8 text-[9px] text-black/40 font-black tracking-[0.2em] uppercase shrink-0">
          W1 Capital • Inteligência de Elite • FUNDADOR DAVI ALVES FIGUEREDO
        </footer>
      </main>
    </div>
  );
}
