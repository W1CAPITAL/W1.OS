
"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Plus, Trash2, Save, Image as ImageIcon, X } from 'lucide-react';
import { getStoredNotes, saveNote, type CaseNote } from '@/lib/server-db';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function NotesPage() {
  const [notes, setNotes] = useState<CaseNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const data = await getStoredNotes();
    setNotes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const res = await saveNote({
      title,
      content,
      image_url: imageUrl,
      created_at: new Date().toISOString()
    });

    if (res.success) {
      toast({ title: "Anotação Salva", description: "Sincronizada com o dossiê cloud." });
      setTitle('');
      setContent('');
      setImageUrl('');
      load();
    }
  };

  return (
    <div className="flex h-screen bg-[#f3f2f2] text-black overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-72 bg-white/50 backdrop-blur-md">
        <header className="h-20 border-b-2 border-black bg-white flex items-center justify-between px-10 shrink-0 z-10 shadow-sm">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Notes & Updates</h1>
            <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">W1 Capital • Gestão de Conhecimento</p>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-10 space-y-8">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white max-w-2xl mx-auto">
            <CardHeader className="bg-black/5 border-b-2 border-black">
              <CardTitle className="text-sm font-black uppercase">Nova Atualização Estratégica</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSave} className="space-y-4">
                <Input 
                  placeholder="Título da nota (Ex: Alteração de Prazo TJSP)" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="border-2 border-black font-bold h-12"
                />
                <Textarea 
                  placeholder="Descreva a atualização técnica..." 
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="border-2 border-black font-bold min-h-[120px]"
                />
                <Input 
                  placeholder="URL da Imagem de Evidência (Opcional)" 
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="border-2 border-black font-bold h-10"
                />
                <Button className="w-full bg-black text-white hover:bg-black/90 h-14 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Save size={18} className="mr-2" /> Registrar no Dossiê
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Card key={note.id} className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white hover:-translate-y-1 transition-transform group">
                <CardHeader className="bg-black/5 border-b-2 border-black flex flex-row items-center justify-between py-3">
                  <CardTitle className="text-xs font-black uppercase truncate">{note.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <p className="text-xs font-bold leading-relaxed">{note.content}</p>
                  {note.image_url && (
                    <div className="border-2 border-black rounded-sm overflow-hidden bg-black/5">
                      <img src={note.image_url} alt="Evidência" className="w-full h-auto grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                  )}
                  <p className="text-[10px] font-black uppercase text-black/40">
                    {new Date(note.created_at).toLocaleString('pt-BR')}
                  </p>
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
