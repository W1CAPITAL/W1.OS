
"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Users, Search, Phone, ExternalLink } from 'lucide-react';
import { getStoredCases } from '@/lib/server-db';
import { cn } from '@/lib/utils';

export default function WhatsAppHubPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getStoredCases().then(data => setCases(data || []));
  }, []);

  const filtered = cases.filter(c => 
    c.cliente.toLowerCase().includes(search.toLowerCase()) ||
    c.protocolo.includes(search)
  );

  const openWhatsApp = (phone: string, client: string) => {
    const text = encodeURIComponent(`Olá, ${client}. Aqui é da Unidade de Auditoria W1 Capital. Temos uma atualização sobre o seu processo.`);
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="flex h-screen bg-[#f3f2f2] text-black overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-72 bg-white/50 backdrop-blur-md">
        <header className="h-20 border-b-2 border-black bg-white flex items-center justify-between px-10 shrink-0 z-10 shadow-sm">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">WhatsApp Hub</h1>
            <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">W1 Capital • Central de Comunicação</p>
          </div>
        </header>

        <div className="flex-1 overflow-hidden p-10 flex flex-col space-y-6">
          <div className="relative group shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black transition-transform group-hover:scale-110" size={18} />
            <Input 
              placeholder="Buscar cliente para disparo via WhatsApp..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white border-2 border-black h-12 pl-12 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div className="flex-1 overflow-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-2">
            {filtered.map((c) => (
              <Card key={c.id} className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white hover:-translate-y-1 transition-all">
                <CardHeader className="bg-black/5 border-b-2 border-black py-4">
                  <CardTitle className="text-sm font-black uppercase truncate">{c.cliente}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Phone size={14} className="text-emerald-600" />
                    <span>{c.telefone || 'Telefone não cadastrado'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-black/40">
                    <MessageSquare size={14} />
                    <span>Último Retorno: {c.ultimoRetorno || '-'}</span>
                  </div>
                  <Button 
                    onClick={() => openWhatsApp(c.telefone || '', c.cliente)}
                    className="w-full bg-emerald-600 text-white hover:bg-emerald-700 h-12 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase font-black text-[10px]"
                  >
                    <Send size={14} className="mr-2" /> Disparar Mensagem
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <footer className="h-12 bg-white border-t-2 border-black flex items-center justify-center px-10 shrink-0 text-[10px] font-black uppercase">
          <p>2026 W1 Capital. Todos os direitos reservados. Relatório Consolidado • FUNDADOR DAVI ALVES FIGUEREDO</p>
        </footer>
      </main>
    </div>
  );
}
