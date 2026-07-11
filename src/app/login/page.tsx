"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Lock, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        if (authError.message.includes('Email not confirmed')) {
          toast({ title: "Acesso Pendente", description: "Por favor, confirme seu e-mail na caixa de entrada.", variant: "destructive" });
        } else {
          toast({ title: "Erro de Acesso", description: "Credenciais inválidas ou conta não localizada.", variant: "destructive" });
        }
        return;
      }

      if (data.user) {
        // Grava cookie de identidade para o servidor
        document.cookie = `lexis_master_email=${data.user.email}; path=/; samesite=lax`;
        window.location.href = '/';
      }
    } catch (err) {
      toast({ title: "Falha Crítica", description: "Ocorreu um erro no servidor de autenticação.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2f2] flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-md border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
        <CardHeader className="bg-black text-white p-8 border-b-4 border-black text-center">
          <div className="w-16 h-16 bg-white mx-auto flex items-center justify-center mb-4 rotate-3 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            <ShieldCheck size={40} className="text-black" />
          </div>
          <CardTitle className="text-3xl font-black uppercase tracking-tighter">LexisPredict</CardTitle>
          <p className="text-[10px] font-bold opacity-60 uppercase tracking-[0.2em] mt-2">W1 Capital • Intelligence Unit</p>
        </CardHeader>
        <CardContent className="p-10 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-black">Credencial de Gabinete</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={18} />
                <Input 
                  type="email" 
                  placeholder="email@w1.capital" 
                  className="border-2 border-black pl-10 h-12 font-bold focus:ring-0 focus:ring-offset-0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-black">Chave de Segurança</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={18} />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="border-2 border-black pl-10 h-12 font-bold focus:ring-0 focus:ring-offset-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white hover:bg-black/90 h-14 font-black uppercase text-xs border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Desbloquear Acesso'}
            </Button>
          </form>
          <div className="text-center pt-4">
            <p className="text-[10px] font-black uppercase text-black/40">
              Não possui instância? <Link href="/signup" className="text-black underline hover:bg-black hover:text-white px-1">Provisionar SaaS</Link>
            </p>
          </div>
        </CardContent>
      </Card>
      <footer className="fixed bottom-6 text-center w-full text-[9px] font-black uppercase tracking-widest text-black/30">
        © 2026 W1 Capital. Todos os direitos reservados.
      </footer>
    </div>
  );
}