"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Play, X, Flame, Loader2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export default function R34View() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!search) return;
    setLoading(true);
    try {
      const slug = search.toLowerCase().replace(/\s+/g, '-');
      const response = await fetch(`https://hentaiocean.com/api?action=hentai&slug=${slug}`);
      const data = await response.json();
      if (data.info && data.info.length > 0) {
        setResult({
          info: data.info[0],
          genres: data.genres.map((g: any) => g.genre)
        });
      } else {
        setResult(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-12 space-y-10 animate-in fade-in duration-700 bg-white min-h-screen relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-[100px] -z-10 opacity-50" />
      
      <header className="flex justify-between items-center relative z-10">
        <div>
          <h2 className="text-4xl font-black text-zinc-800 uppercase flex items-center gap-3 tracking-tighter">
            <Flame className="text-red-600 animate-pulse" /> Hentai Ocean Explorer
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-red-600 text-white border-none font-black text-[9px] px-2 py-0.5">EXPERIMENTAL</Badge>
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
               Protocolo R34 Ativo • W1 Elite Intelligence
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl flex gap-2 relative z-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <Input 
            placeholder="Slug do conteúdo (ex: my-mother-1)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-zinc-50 border-zinc-100 h-14 pl-12 text-sm focus:ring-red-600 focus:border-red-600 rounded-xl"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={loading} className="bg-red-600 hover:bg-red-700 h-14 px-8 font-black uppercase italic shadow-xl katana-btn rounded-xl">
          {loading ? <Loader2 className="animate-spin" /> : 'Sincronizar'}
        </Button>
      </div>

      {result ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in slide-in-from-bottom-4 duration-700 relative z-10">
          <Card className="lg:col-span-1 bg-white border-zinc-100 overflow-hidden shadow-2xl katana-cut group">
            <div className="aspect-[3/4] relative overflow-hidden">
              <img 
                src={`https://hentaiocean.com/assets/cover/${result.info.coverimg}`} 
                alt={result.info.videoname}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                 <Button 
                    onClick={() => setVideoUrl(`https://hentaiocean.com/embed/${result.info.urlname}?la=1`)}
                    className="w-full bg-red-600 hover:bg-white hover:text-red-600 font-black gap-2 h-12 rounded-xl transition-all"
                  >
                    <Play size={18} /> ASSISTIR AGORA
                  </Button>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-2 space-y-10">
            <div>
              <h3 className="text-5xl font-black text-zinc-900 mb-6 uppercase tracking-tighter leading-none">
                {result.info.videoname}
              </h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {result.genres.map((g: string) => (
                  <Badge key={g} variant="outline" className="text-[10px] border-red-200 text-red-600 font-black uppercase px-4 py-1.5 rounded-lg bg-red-50/50">
                    {g}
                  </Badge>
                ))}
              </div>
              <div className="relative">
                <p className="text-zinc-600 text-sm leading-relaxed font-medium italic border-l-4 border-red-600 pl-8 py-2 bg-zinc-50/50 rounded-r-2xl">
                  {result.info.description}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-between group hover:border-red-600/20 transition-all">
                 <div>
                   <p className="text-[10px] font-black text-zinc-400 uppercase mb-1 tracking-[0.2em]">Lançamento Oficial</p>
                   <p className="text-sm font-black text-zinc-800">{result.info.releasedate}</p>
                 </div>
                 <Badge variant="outline" className="h-8 border-zinc-200 text-zinc-400 text-[10px]">DATAJUD SYNC</Badge>
               </div>
               <div className="p-6 bg-red-50/50 border border-red-100 rounded-2xl flex items-center justify-between group hover:border-red-600/40 transition-all">
                 <div>
                   <p className="text-[10px] font-black text-red-400 uppercase mb-1 tracking-[0.2em]">Status de Rede</p>
                   <p className="text-sm font-black text-red-600 uppercase">Sincronizado</p>
                 </div>
                 <ShieldAlert className="text-red-500 animate-pulse" size={20} />
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[50vh] flex flex-col items-center justify-center text-center opacity-10">
          <Flame size={80} className="text-red-600 mb-6" />
          <p className="text-sm font-black uppercase tracking-[0.4em]">Aguardando Sincronia de Slug...</p>
        </div>
      )}

      {/* Video Modal Overlay */}
      {videoUrl && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-500">
          <div className="w-full max-w-6xl relative">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setVideoUrl(null)}
              className="absolute -top-16 right-0 text-white hover:text-red-600 transition-colors"
            >
              <X size={44} />
            </Button>
            <div className="relative w-full h-0 pb-[56.25%] bg-zinc-900 shadow-[0_0_100px_rgba(220,38,38,0.2)] rounded-3xl overflow-hidden border border-zinc-800">
              <iframe 
                src={videoUrl} 
                className="absolute inset-0 w-full h-full"
                frameBorder="0" 
                scrolling="no" 
                allowFullScreen
              />
            </div>
            <div className="mt-8 text-center">
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.5em]">Motor de Transmissão Elite v18.5 • W1 Capital</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
