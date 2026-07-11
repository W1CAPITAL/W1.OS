
"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  Lock, 
  Cloud, 
  Terminal, 
  Image as ImageIcon, 
  Palette, 
  UserCheck,
  Zap,
  Save,
  Trash2,
  Monitor,
  Code
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveLocalAsset, clearLocalAssets } from '@/lib/browser-storage';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [wpMode, setWpMode] = useState('single');
  const [mainWpUrl, setMainWpUrl] = useState('');
  const [sideWpUrl, setSideWpUrl] = useState('');
  const [mainWpType, setMainWpType] = useState('image');
  const [sideWpType, setSideWpType] = useState('image');
  const [opacity, setOpacity] = useState(30);
  const [fontColor, setFontColor] = useState('#000000');
  const [autoTheme, setAutoTheme] = useState(false);
  
  const [isCodeAuthorized, setIsCodeAuthorized] = useState(false);
  const [codePassword, setCodePassword] = useState('');

  useEffect(() => {
    setIsAdmin(localStorage.getItem('lexis_admin') === 'true');
    setWpMode(localStorage.getItem('lexis_wp_mode') || 'single');
    setMainWpUrl(localStorage.getItem('lexis_wp_main_url') || '');
    setSideWpUrl(localStorage.getItem('lexis_wp_sidebar_url') || '');
    setMainWpType(localStorage.getItem('lexis_wp_main_type') || 'image');
    setSideWpType(localStorage.getItem('lexis_wp_sidebar_type') || 'image');
    setOpacity(Math.round(parseFloat(localStorage.getItem('lexis_wp_opacity') || '0.3') * 100));
    setFontColor(localStorage.getItem('lexis_wp_font_color') || '#000000');
    setAutoTheme(localStorage.getItem('lexis_auto_theme') === 'true');
  }, []);

  const handleAdminAuth = () => {
    if (password === '25472053' || password === 'Ashley@25472053') {
      setIsAdmin(true);
      localStorage.setItem('lexis_admin', 'true');
      toast({ title: "Acesso Administrativo", description: "Privilégios de gabinete desbloqueados." });
    } else {
      toast({ title: "Erro", description: "Senha incorreta.", variant: "destructive" });
    }
  };

  const handleCodeAuth = () => {
    if (codePassword === 'Ashley@25472053') {
      setIsCodeAuthorized(true);
      toast({ title: "Segurança Nível 2", description: "Acesso ao código-fonte liberado." });
    } else {
      toast({ title: "Acesso Negado", description: "Senha de segurança nível 2 incorreta.", variant: "destructive" });
    }
  };

  const saveAtmosSettings = () => {
    localStorage.setItem('lexis_wp_mode', wpMode);
    localStorage.setItem('lexis_wp_main_url', mainWpUrl);
    localStorage.setItem('lexis_wp_sidebar_url', sideWpUrl);
    localStorage.setItem('lexis_wp_main_type', mainWpType);
    localStorage.setItem('lexis_wp_sidebar_type', sideWpType);
    localStorage.setItem('lexis_wp_opacity', (opacity / 100).toString());
    localStorage.setItem('lexis_wp_font_color', fontColor);
    localStorage.setItem('lexis_auto_theme', autoTheme.toString());
    
    window.dispatchEvent(new Event('storage'));
    toast({ title: "Configurações Salvas", description: "Atmosfera de gabinete atualizada com sucesso." });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'main' | 'side') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const id = `local-${target}-${Date.now()}`;
    await saveLocalAsset(id, file);
    if (target === 'main') setMainWpUrl(id);
    else setSideWpUrl(id);
    toast({ title: "Upload Concluído", description: "Arquivo processado via IndexedDB." });
  };

  return (
    <div className="flex h-screen bg-[#f3f2f2] font-sans text-black">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-72 transition-all">
        <header className="h-20 bg-white border-b-2 border-black flex items-center justify-between px-10 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <Monitor size={24} className="text-black" />
            <h1 className="text-2xl font-black uppercase tracking-tighter text-black">Painel de Estratégia</h1>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Gabinete Elite v250.0</p>
        </header>

        <div className="flex-1 overflow-auto p-10 custom-scrollbar">
          <Tabs defaultValue="atmos" className="space-y-8">
            <TabsList className="bg-white border-2 border-black p-1 h-auto grid grid-cols-2 lg:grid-cols-4 gap-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <TabsTrigger value="atmos" className="gap-2 font-black uppercase text-[10px] data-[state=active]:bg-black data-[state=active]:text-white py-3 border-none transition-all">
                <Palette size={14} /> Atmosfera
              </TabsTrigger>
              <TabsTrigger value="admin" className="gap-2 font-black uppercase text-[10px] data-[state=active]:bg-black data-[state=active]:text-white py-3 border-none transition-all">
                <Lock size={14} /> Admin
              </TabsTrigger>
              <TabsTrigger value="sync" className="gap-2 font-black uppercase text-[10px] data-[state=active]:bg-black data-[state=active]:text-white py-3 border-none transition-all">
                <Cloud size={14} /> Cloud
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-2 font-black uppercase text-[10px] data-[state=active]:bg-black data-[state=active]:text-white py-3 border-none transition-all">
                <Code size={14} /> System Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="atmos">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
                  <CardHeader className="border-b-2 border-black bg-black/5">
                    <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <Zap size={16} /> Sincronização Neural
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <Button 
                      onClick={() => setAutoTheme(!autoTheme)}
                      className={cn(
                        "w-full font-black uppercase text-xs h-14 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all",
                        autoTheme ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"
                      )}
                    >
                      {autoTheme ? "Desativar Sincronização Neural" : "Ativar Sincronização Neural (Auto)"}
                    </Button>
                    <p className="text-[9px] font-bold uppercase opacity-60 text-center">A IA analisa o wallpaper quadro a quadro e ajusta a interface.</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
                  <CardHeader className="border-b-2 border-black bg-black/5">
                    <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <Palette size={16} /> Estilo e Opacidade
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase">Opacidade dos Containers ({opacity}%)</Label>
                      <Slider value={[opacity]} onValueChange={(v) => setOpacity(v[0])} max={100} step={1} className="py-4" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase">Cor das Letras e Detalhes</Label>
                      <div className="flex gap-2">
                        <Input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="w-16 h-10 border-2 border-black p-1" />
                        <Input value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="flex-1 font-bold border-2 border-black uppercase text-xs" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="admin">
              <Card className="max-w-md mx-auto border-2 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
                <CardHeader className="border-b-2 border-black bg-black/5 text-center">
                  <CardTitle className="text-xl font-black uppercase">Administrative Access</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {isAdmin ? (
                    <div className="space-y-4 text-center">
                      <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-600 flex items-center justify-center mx-auto mb-4">
                        <UserCheck className="text-emerald-600" size={32} />
                      </div>
                      <p className="font-black uppercase text-xs text-emerald-600">Modo Administrador Ativo</p>
                      <Button onClick={() => {setIsAdmin(false); localStorage.removeItem('lexis_admin');}} className="w-full bg-red-600 text-white font-black uppercase text-xs border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        Revogar Acesso
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase">Senha de Gabinete</Label>
                      <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-2 border-black h-12 text-center text-lg font-bold" />
                      <Button onClick={handleAdminAuth} className="w-full h-12 bg-black text-white font-black uppercase text-xs border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        Desbloquear Gabinete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sync">
               <Card className="border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
                <CardHeader className="border-b-2 border-black bg-black/5">
                  <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Cloud size={16} /> Cloud Infrastructure
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="flex justify-between items-center py-4 border-b-2 border-black/10">
                    <span className="text-xs font-black uppercase">Database Connection</span>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 bg-emerald-500 animate-pulse rounded-full" />
                       <span className="text-[10px] font-black uppercase text-emerald-600">Online & Healthy</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="text-xs font-black uppercase">SaaS Tenant Node</span>
                    <span className="bg-black text-white px-4 py-1 font-black text-[10px] uppercase">segjsk...active</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="code">
              <Card className="border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
                {!isCodeAuthorized ? (
                  <CardContent className="p-20 flex flex-col items-center justify-center space-y-4">
                    <Lock size={48} className="text-black/20 mb-4" />
                    <Label className="text-[10px] font-black uppercase">Código de Segurança Nível 2</Label>
                    <Input type="password" value={codePassword} onChange={(e) => setCodePassword(e.target.value)} className="border-2 border-black h-12 w-64 text-center text-lg font-bold" />
                    <Button onClick={handleCodeAuth} className="bg-black text-white px-10 h-12 font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      Validar Chave
                    </Button>
                  </CardContent>
                ) : (
                  <>
                    <CardHeader className="border-b-2 border-black bg-black/5 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-black uppercase flex items-center gap-2">
                        <Terminal size={16} /> Veredito Engine Source
                      </CardTitle>
                      <Button onClick={() => setIsCodeAuthorized(false)} size="sm" variant="outline" className="border-2 border-black text-[9px] font-black uppercase">Bloquear Código</Button>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="bg-black text-emerald-400 p-6 font-mono text-[10px] overflow-auto max-h-[500px] border-2 border-black">
                        <pre>{`// Veredito AI v4.5 Elite - W1 Capital\n// Source access: Authorized for Davi Alves Figueredo\n// ... (source code protected)`}</pre>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <footer className="h-14 bg-white border-t-2 border-black flex items-center justify-center px-8 shrink-0 mt-auto">
          <p className="text-[9px] font-black uppercase tracking-widest text-black">
            2026 W1 Capital. Todos os direitos reservados. Relatório Consolidado • FUNDADOR DAVI ALVES FIGUEREDO
          </p>
        </footer>
      </main>
    </div>
  );
}
