"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BrainCircuit, Search, Loader2, Zap, ShieldCheck, 
  MessageCircle, Copy, AlertCircle, TrendingUp, Gavel, Scale, Clock
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { executarVereditoAI } from "@/ai/veredito-ai-engine";
import { cn } from "@/lib/utils";

export default function OmniReportView() {
  const [cnj, setCnj] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [cooldown, setCooldown] = useState(0);

  const handleSearch = async () => {
    if (!cnj) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await executarVereditoAI({ cnj });
      if (res.success) {
        setResult(res.analysis);
        toast({ title: "Análise Concluída", description: "Parecer técnico V50 gerado com sucesso." });
      } else if (res.error?.includes('RATE_LIMIT')) {
        const seconds = parseInt(res.error.split(':')[1]);
        setCooldown(seconds);
        toast({ title: "Rate Limit", description: `Aguarde ${seconds}s para a próxima consulta.`, variant: "destructive" });
      } else {
        throw new Error(res.error);
      }
    } catch (err: any) {
      toast({ title: "Erro no Motor", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", description: "Texto pronto para envio." });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-white uppercase flex items-center gap-3">
            <BrainCircuit className="text-primary" /> Veredito AI v5.0 Deep Strategy
          </h2>
          <p className="text-zinc-500 text-xs">Mapeamento 360° DataJud + Estratégia de CRM W1 Capital.</p>
        </div>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800 shadow-2xl overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />
        <CardContent className="p-8 space-y-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <Input 
                placeholder="Insira o protocolo CNJ completo (Ex: 5050432-10.2026...)" 
                value={cnj}
                onChange={(e) => setCnj(e.target.value)}
                className="bg-black border-zinc-800 pl-10 h-12 text-sm focus:ring-primary"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={loading || cooldown > 0}
              className="bg-primary hover:bg-primary/80 h-12 px-8 font-black tracking-tighter"
            >
              {loading ? <Loader2 className="animate-spin" /> : cooldown > 0 ? `RESFRIAR ${cooldown}s` : 'EXECUTAR V50'}
            </Button>
          </div>

          {result && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-6">
                <section>
                  <div className="flex items-center gap-2 text-primary mb-3">
                    <Zap size={16} />
                    <h3 className="text-[10px] font-black uppercase tracking-widest">🎯 1. Visão Estratégica (Equipe)</h3>
                  </div>
                  <div className="bg-black/50 border border-zinc-800 rounded-xl p-6 space-y-4">
                    <div>
                      <p className="text-[9px] text-zinc-500 uppercase font-black mb-1">Resumo Técnico</p>
                      <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">{result.resumoTecnico}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-rose-500 uppercase font-black mb-1">Análise de Risco & Impacto</p>
                      <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">{result.analiseRisco}</p>
                    </div>
                    <div className="pt-4 border-t border-zinc-800/50">
                      <p className="text-[9px] text-emerald-500 uppercase font-black mb-1">Plano de Ação Imediato</p>
                      <p className="text-xs text-white font-bold leading-relaxed">{result.proximosPassos}</p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <MessageCircle size={16} />
                      <h3 className="text-[10px] font-black uppercase tracking-widest">💬 2. Mensagem p/ Cliente (WhatsApp)</h3>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.mensagemCliente)} className="h-7 text-[10px] gap-2 hover:bg-emerald-500/10 hover:text-emerald-400">
                      <Copy size={12} /> Copiar Texto
                    </Button>
                  </div>
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-8 italic text-zinc-300 text-sm leading-relaxed relative whitespace-pre-wrap shadow-inner">
                    <span className="absolute top-4 left-4 text-4xl text-emerald-500/10 font-serif">“</span>
                    {result.mensagemCliente}
                  </div>
                </section>

                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <Clock className="text-zinc-500" size={14} />
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-500 uppercase font-black">📅 3. Gatilho de Retorno</p>
                      <p className="text-xs font-bold text-white">Sugerido em 15 dias úteis</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-zinc-700 text-[10px] text-zinc-400 font-mono">
                    STATUS: SINCRONIZADO
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <footer className="text-center">
        <p className="text-[10px] text-zinc-600 uppercase font-black tracking-[0.3em]">
          © 2024 W1 Capital • Análise Técnica Davi Alves Figueredo
        </p>
      </footer>
    </div>
  );
}
