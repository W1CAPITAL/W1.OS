"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Plus, Building, Mail, Lock, Loader2, Key } from 'lucide-react';
import Link from 'next/link';

const MASTER_TOKEN = 'Azadsd5a96d5.6as5sa2d652as+94s9';

export default function SignupPage() {
  const [formData, setForm] = useState({
    nome: '',
    empresa: '',
    email: '',
    password: '',
    token: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.token !== MASTER_TOKEN) {
      toast({ title: "Token Inválido", description: "O código de provisionamento mestre está incorreto.", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      const cleanEmail = formData.email.trim().toLowerCase();

      // 1. Criar Empresa
      const { data: empresa, error: empError } = await supabase
        .from('empresas')
        .insert({ nome: formData.empresa })
        .select()
        .single();

      if (empError) throw empError;

      // 2. Criar Usuário Auth
      const { data: auth, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: formData.password,
        options: { data: { full_name: formData.nome } }
      });

      if (authError) throw authError;

      if (auth.user && empresa) {
        // 3. Criar Perfil de Usuário
        const { error: perfError } = await supabase
          .from('usuarios')
          .insert({
            auth_user_id: auth.user.id,
            empresa_id: empresa.id,
            nome: formData.nome,
            email: cleanEmail,
            cargo: 'Administrador'
          });

        if (perfError) throw perfError;

        toast({ title: "SaaS Provisionado", description: "Sua instância foi criada. Verifique seu e-mail." });
        window.location.href = '/login';
      }
    } catch (err: any) {
      toast({ title: "Falha no Provisionamento", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2f2] flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-lg border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
        <CardHeader className="bg-black text-white p-8 border-b-4 border-black text-center">
          <div className="w-16 h-16 bg-white mx-auto flex items-center justify-center mb-4 -rotate-3 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            <Plus size={40} className="text-black" />
          </div>
          <CardTitle className="text-3xl font-black uppercase tracking-tighter">Provisionar Instância</CardTitle>
          <p className="text-[10px] font-bold opacity-60 uppercase tracking-[0.2em] mt-2">Arquitetura Multi-Tenant Elite v250.0</p>
        </CardHeader>
        <CardContent className="p-10">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black uppercase text-black">Token de Provisionamento</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={18} />
                  <Input 
                    type="password" 
                    placeholder="Token Mestre W1" 
                    className="border-2 border-black pl-10 h-12 font-bold"
                    value={formData.token}
                    onChange={(e) => setForm({...formData, token: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-black">Seu Nome</label>
                <Input 
                  placeholder="Dr. Davi Alves" 
                  className="border-2 border-black h-12 font-bold"
                  value={formData.nome}
                  onChange={(e) => setForm({...formData, nome: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-black">Nome da Empresa</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={18} />
                  <Input 
                    placeholder="W1 Capital" 
                    className="border-2 border-black pl-10 h-12 font-bold"
                    value={formData.empresa}
                    onChange={(e) => setForm({...formData, empresa: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black uppercase text-black">E-mail de Gabinete</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={18} />
                  <Input 
                    type="email" 
                    placeholder="email@w1.capital" 
                    className="border-2 border-black pl-10 h-12 font-bold"
                    value={formData.email}
                    onChange={(e) => setForm({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black uppercase text-black">Nova Chave de Segurança</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={18} />
                  <Input 
                    type="password" 
                    placeholder="Crie sua senha" 
                    className="border-2 border-black pl-10 h-12 font-bold"
                    value={formData.password}
                    onChange={(e) => setForm({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white hover:bg-black/90 h-14 font-black uppercase text-xs border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all mt-4"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Confirmar e Provisionar'}
            </Button>
          </form>
          <div className="text-center pt-6">
            <Link href="/login" className="text-[10px] font-black uppercase text-black underline hover:bg-black hover:text-white px-2">Já possuo acesso</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}