
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Plus, Filter, Check, Trash2, 
  Edit3, History, Database, Loader2, FileText, X,
  RefreshCcw
} from 'lucide-react';
import { getStoredCases, saveCase, deleteCase } from '@/lib/server-db';
import { LegalCase, processarCaso } from '@/lib/case-logic';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter, DialogDescription 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CasesPage() {
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowAddModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const [formData, setForm] = useState({
    cliente: '',
    protocolo: '',
    advogado: '',
    proximoPrazo: '',
    situacao: '',
    observacoes: '',
    ultimoRetorno: '',
    statusManual: 'Automático'
  });

  const load = async () => {
    setLoading(true);
    const data = await getStoredCases();
    setCases(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = processarCaso({
      ...formData,
      id: isEditing ? selectedCase?.id : undefined,
      STATUS: formData.statusManual !== 'Automático' ? formData.statusManual : undefined
    });

    const res = await saveCase(payload);
    if (res.success) {
      toast({ title: isEditing ? "Caso Atualizado" : "Caso Registrado", description: "Sincronizado com Supabase Cloud." });
      setShowAddModal(false);
      load();
    } else {
      toast({ title: "Erro na Nuvem", description: "Falha ao persistir dados no PostgreSQL.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir este processo permanentemente?')) {
      await deleteCase(id);
      load();
      toast({ title: "Registro Removido", description: "Exclusão concluída com sucesso." });
    }
  };

  const handleLogReturn = async (id: string) => {
    const target = cases.find(c => c.id === id);
    if (target) {
      const today = new Date().toLocaleDateString('pt-BR');
      const updated = { ...target, ultimoRetorno: today };
      await saveCase(updated);
      load();
      toast({ title: "Retorno Registrado", description: `Contato com ${target.cliente} marcado para hoje.` });
    }
  };

  const filteredCases = useMemo(() => {
    return cases.filter(c => 
      c.cliente.toLowerCase().includes(search.toLowerCase()) || 
      c.protocolo.includes(search) ||
      c.advogado.toLowerCase().includes(search.toLowerCase())
    );
  }, [cases, search]);

  return (
    <div className="flex h-screen bg-[#f3f2f2] text-black overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-72 bg-white/50 backdrop-blur-md">
        <header className="h-20 border-b-2 border-black bg-white flex items-center justify-between px-10 shrink-0 z-10 shadow-sm">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Gestão de Processos</h1>
            <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">W1 Capital • Terminal de Auditoria</p>
          </div>
          <Button 
            onClick={() => {
              setIsEditing(false);
              setForm({ cliente: '', protocolo: '', advogado: '', proximoPrazo: '', situacao: '', observacoes: '', ultimoRetorno: '', statusManual: 'Automático' });
              setShowAddModal(true);
            }}
            className="bg-black text-white hover:bg-black/90 font-black uppercase text-xs h-12 px-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Plus size={16} className="mr-2" /> Novo Processo
          </Button>
        </header>

        <div className="flex-1 overflow-hidden p-10 flex flex-col space-y-6">
          <div className="flex items-center justify-between gap-4 shrink-0">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black transition-transform group-hover:scale-110" size={18} />
              <Input 
                placeholder="Filtrar por cliente, número CNJ ou advogado responsável..." 
                className="bg-white border-2 border-black h-12 pl-12 text-sm font-bold placeholder:text-black/30 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={load} className="border-2 border-black h-12 font-black uppercase text-xs hover:bg-black hover:text-white transition-all">
              <RefreshCcw size={16} className={loading ? "animate-spin mr-2" : "mr-2"} /> Sincronizar
            </Button>
          </div>

          <Card className="flex-1 overflow-hidden border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white flex flex-col min-h-0">
            <div className="overflow-auto flex-1 min-h-0 custom-scrollbar">
              <div className="min-w-[1200px]">
                <table className="w-full text-left border-collapse text-xs table-fixed">
                  <thead className="bg-black text-white sticky top-0 z-20">
                    <tr>
                      <th className="p-4 w-[250px] font-black uppercase tracking-tighter">Cliente / Protocolo</th>
                      <th className="p-4 w-[180px] font-black uppercase tracking-tighter">Responsável</th>
                      <th className="p-4 w-[150px] font-black uppercase tracking-tighter">Tribunal</th>
                      <th className="p-4 w-[150px] font-black uppercase tracking-tighter">Próximo Prazo</th>
                      <th className="p-4 w-[150px] font-black uppercase tracking-tighter text-center">Status</th>
                      <th className="p-4 w-[120px] font-black uppercase tracking-tighter text-right">Retorno</th>
                      <th className="p-4 w-[200px] font-black uppercase tracking-tighter text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black bg-white">
                    {loading ? (
                      <tr><td colSpan={7} className="p-20 text-center font-black uppercase animate-pulse">Sincronizando base PostgreSQL...</td></tr>
                    ) : filteredCases.length > 0 ? (
                      filteredCases.map((c) => (
                        <tr key={c.id} className="hover:bg-black hover:text-white transition-all duration-200 group">
                          <td className="p-4 align-top">
                            <p className="font-black text-sm uppercase leading-tight truncate">{c.cliente}</p>
                            <p className="text-[10px] font-bold opacity-60 font-mono mt-1">{c.protocolo}</p>
                          </td>
                          <td className="p-4 align-top font-bold uppercase truncate">{c.advogado}</td>
                          <td className="p-4 align-top font-black text-blue-600 group-hover:text-blue-400">{c.tribunal}</td>
                          <td className="p-4 align-top font-bold">{c.proximoPrazo || '-'}</td>
                          <td className="p-4 align-top text-center">
                            <StatusBadge status={c.status} dias={c.diasFaltando} />
                          </td>
                          <td className="p-4 align-top text-right font-mono font-bold text-[10px] opacity-60">
                            {c.ultimoRetorno || '-'}
                          </td>
                          <td className="p-4 align-top text-center">
                            <div className="flex justify-center gap-1">
                              <Button 
                                variant="outline" size="icon" 
                                onClick={() => handleLogReturn(c.id)}
                                className="h-8 w-8 border-2 border-black group-hover:border-white hover:bg-emerald-500 hover:text-white transition-all"
                                title="Registrar Retorno Hoje"
                              >
                                <Check size={14} />
                              </Button>
                              <Button 
                                variant="outline" size="icon" 
                                onClick={() => {
                                  setSelectedCase(c);
                                  setShowNoteModal(true);
                                }}
                                className="h-8 w-8 border-2 border-black group-hover:border-white hover:bg-blue-600 hover:text-white transition-all"
                                title="Ver Observações"
                              >
                                <FileText size={14} />
                              </Button>
                              <Button 
                                variant="outline" size="icon" 
                                onClick={() => {
                                  setIsEditing(true);
                                  setSelectedCase(c);
                                  setForm({
                                    cliente: c.cliente,
                                    protocolo: c.protocolo,
                                    advogado: c.advogado,
                                    proximoPrazo: c.proximoPrazo,
                                    situacao: c.situacao,
                                    observacoes: c.observacoes || '',
                                    ultimoRetorno: c.ultimoRetorno || '',
                                    statusManual: ['Caso Crítico', 'Atenção', 'Encerrado', 'Arquivado'].includes(c.status) ? c.status : 'Automático'
                                  });
                                  setShowAddModal(true);
                                }}
                                className="h-8 w-8 border-2 border-black group-hover:border-white hover:bg-black hover:text-white transition-all"
                                title="Editar"
                              >
                                <Edit3 size={14} />
                              </Button>
                              <Button 
                                variant="outline" size="icon" 
                                onClick={() => handleDelete(c.id)}
                                className="h-8 w-8 border-2 border-black group-hover:border-white hover:bg-red-600 hover:text-white transition-all"
                                title="Excluir"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={7} className="p-20 text-center text-black/20 uppercase font-black tracking-widest text-[10px]">Nenhum registro localizado no servidor.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        <footer className="h-12 bg-white border-t-2 border-black flex items-center justify-between px-10 shrink-0 text-[10px] font-black uppercase">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Database size={12} className="text-emerald-500" /> Sincronia: Supabase Cloud PostgreSQL Active</span>
          </div>
          <p>© 2026 W1 Capital • FUNDADOR DAVI ALVES FIGUEREDO</p>
        </footer>
      </main>

      {/* Modal de Cadastro/Edição */}
      <Dialog open={showModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-2xl max-h-[90vh] overflow-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
              {isEditing ? 'Atualizar Prerrogativas' : 'Registrar Novo Caso Técnico'}
            </DialogTitle>
            <DialogDescription className="sr-only">Formulário de gestão processual</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase">Nome Completo do Cliente</Label>
                <Input value={formData.cliente} onChange={e => setForm({...formData, cliente: e.target.value})} className="border-2 border-black font-bold h-10" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase">Protocolo CNJ (Completo)</Label>
                <Input value={formData.protocolo} onChange={e => setForm({...formData, protocolo: e.target.value})} className="border-2 border-black font-bold h-10" placeholder="0000000-00.2026.8..." required />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase">Advogado Responsável</Label>
                <Input value={formData.advogado} onChange={e => setForm({...formData, advogado: e.target.value})} className="border-2 border-black font-bold h-10" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase">Próximo Prazo (DD/MM/AAAA)</Label>
                <Input value={formData.proximoPrazo} onChange={e => setForm({...formData, proximoPrazo: e.target.value})} className="border-2 border-black font-bold h-10" placeholder="30/06/2026" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase">Status Estratégico</Label>
                <select 
                  value={formData.statusManual} 
                  onChange={e => setForm({...formData, statusManual: e.target.value})}
                  className="w-full h-10 border-2 border-black font-bold text-[10px] px-2 uppercase"
                >
                  <option value="Automático">Automático (Pelo Prazo)</option>
                  <option value="Caso Crítico">Caso Crítico</option>
                  <option value="Atenção">Atenção</option>
                  <option value="Encerrado">Encerrado</option>
                  <option value="Arquivado">Arquivado</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase">Último Retorno (DD/MM/AAAA)</Label>
                <Input value={formData.ultimoRetorno} onChange={e => setForm({...formData, ultimoRetorno: e.target.value})} className="border-2 border-black font-bold h-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase">Observações de Gabinete</Label>
              <Textarea value={formData.observacoes} onChange={e => setForm({...formData, observacoes: e.target.value})} className="border-2 border-black font-bold min-h-[100px]" />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="border-2 border-black font-black uppercase text-xs h-12 px-8">Cancelar</Button>
              <Button type="submit" className="bg-black text-white hover:bg-black/90 font-black uppercase text-xs h-12 px-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Confirmar Sincronia
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização de Observações */}
      <Dialog open={showNoteModal} onOpenChange={setShowNoteModal}>
        <DialogContent className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-2 text-black">
              <FileText size={20} /> Observação Estratégica
            </DialogTitle>
            <DialogDescription className="sr-only">Conteúdo das anotações do caso</DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-6 bg-black/5 border-2 border-black font-bold text-sm text-black leading-relaxed whitespace-pre-wrap">
            {selectedCase?.observacoes || "Nenhuma observação técnica registrada para este processo."}
          </div>
          <div className="mt-6 flex flex-col gap-2">
             <div className="flex justify-between text-[10px] font-black uppercase opacity-60">
                <span>Advogado: {selectedCase?.advogado}</span>
                <span>Cliente: {selectedCase?.cliente}</span>
             </div>
             <Button variant="outline" onClick={() => setShowNoteModal(false)} className="w-full border-2 border-black font-black uppercase text-xs h-12">Fechar Dossiê</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status, dias }: { status: string, dias: number | null }) {
  const styles: Record<string, string> = {
    'Vencido': 'bg-red-600 text-white border-red-700 shadow-none',
    'Atenção': 'bg-orange-500 text-white border-orange-600 shadow-none',
    'No Prazo': 'bg-green-600 text-white border-green-700 shadow-none',
    'É Hoje': 'bg-black text-white border-black animate-pulse shadow-none',
    'Encerrado': 'bg-blue-600 text-white border-blue-700 shadow-none',
    'Arquivado': 'bg-slate-400 text-white border-slate-500 shadow-none',
    'Sem Prazo': 'bg-white text-black border-black/20 shadow-none'
  };

  let texto = status;
  if (dias !== null && status !== 'Arquivado' && status !== 'Encerrado') {
    if (dias < 0) texto += ` (${Math.abs(dias)}d passados)`;
    else if (dias === 0) texto = "Hoje";
    else texto += ` (${dias}d restando)`;
  }

  return (
    <div className={cn("inline-flex items-center rounded-full px-3 py-1 text-[9px] font-black uppercase border-2", styles[status] || styles['Sem Prazo'])}>
      {texto}
    </div>
  );
}
