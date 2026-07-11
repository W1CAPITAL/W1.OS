'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  BarChart3, 
  Settings, 
  MessageSquare, 
  LogOut,
  Menu,
  X,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { getLocalAsset } from '@/lib/browser-storage';

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [wpSettings, setWpSettings] = useState<any>(null);
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // LOG DE TELEMETRIA (LegisHub Style)
  useEffect(() => {
    console.log(`[TELEMETRY] Navegação detectada: ${pathname}`);
  }, [pathname]);

  // MOTOR NEURAL DE CORES OTIMIZADO (DNA LegisHub)
  const extractColors = useCallback(() => {
    const autoTheme = localStorage.getItem('lexis_auto_theme') === 'true';
    if (!autoTheme || (!videoRef.current && !bgUrl)) return;

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }

    const canvas = canvasRef.current;
    // OTIMIZAÇÃO: willReadFrequently: true conforme logs de erro do usuário
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const source = videoRef.current || document.querySelector('img[src="' + bgUrl + '"]');
    if (!source) return;

    canvas.width = 10;
    canvas.height = 10;
    
    try {
      ctx.drawImage(source as any, 0, 0, 10, 10);
      const data = ctx.getImageData(0, 0, 10, 10).data;
      
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i+1];
        b += data[i+2];
      }
      
      const count = data.length / 4;
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const fontColor = luminance > 0.5 ? '#000000' : '#ffffff';
      
      // Update local storage and dispatch
      localStorage.setItem('lexis_wp_font_color', fontColor);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      // Ignorar erros de cross-origin
    }
  }, [bgUrl]);

  useEffect(() => {
    const interval = setInterval(extractColors, 1000);
    return () => clearInterval(interval);
  }, [extractColors]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const loadWp = async () => {
      const mode = localStorage.getItem('lexis_wp_mode') || 'single';
      const mainUrl = localStorage.getItem('lexis_wp_main_url');
      const sideUrl = localStorage.getItem('lexis_wp_sidebar_url');
      const mainType = localStorage.getItem('lexis_wp_main_type') || 'image';
      const sideType = localStorage.getItem('lexis_wp_sidebar_type') || 'image';
      const opacity = localStorage.getItem('lexis_wp_opacity') || '0.3';
      const fontColor = localStorage.getItem('lexis_wp_font_color') || '#000000';

      const settings = { mode, mainUrl, sideUrl, mainType, sideType, opacity, fontColor };
      setWpSettings(settings);

      const targetUrl = mode === 'single' ? mainUrl : sideUrl;
      const targetType = mode === 'single' ? mainType : sideType;

      if (targetUrl?.startsWith('local-')) {
        const blob = await getLocalAsset(targetUrl);
        if (blob) setBgUrl(URL.createObjectURL(blob));
      } else {
        setBgUrl(targetUrl);
      }

      const styleId = 'lexis-global-style';
      let styleTag = document.getElementById(styleId);
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
      }
      styleTag.innerHTML = `
        body, main, .bg-background, .bg-white, .bg-[#f3f2f2] { 
          background-color: transparent !important; 
        }
        main > div, .bg-card, .border-border {
          background-color: rgba(255,255,255, ${settings.opacity}) !important;
          backdrop-filter: blur(10px);
        }
        .text-black, .text-foreground, label, h1, h2, h3, p, span, svg {
          color: ${fontColor} !important;
          stroke: ${fontColor} !important;
        }
        .hover\:bg-black:hover {
          background-color: ${fontColor} !important;
          color: ${fontColor === '#000000' ? '#ffffff' : '#000000'} !important;
        }
      `;
    };

    loadWp();
    window.addEventListener('storage', loadWp);
    return () => window.removeEventListener('storage', loadWp);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: 'Painel Elite', href: '/' },
    { icon: Briefcase, label: 'Processos Judiciais', href: '/cases' },
    { icon: BarChart3, label: 'Analytics Hub', href: '/analytics' },
    { icon: FileText, label: 'Notes & Updates', href: '/notes' },
    { icon: MessageSquare, label: 'WhatsApp Hub', href: '/whatsapp' },
    { icon: Settings, label: 'Configurações', href: '/settings' },
  ];

  return (
    <>
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none lexis-bg-layer">
        {bgUrl && (
          wpSettings?.mainType === 'video' ? (
            <video 
              ref={videoRef}
              autoPlay muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover will-change-transform"
              src={bgUrl}
            />
          ) : (
            <img src={bgUrl} className="absolute inset-0 w-full h-full object-cover" alt="" />
          )
        )}
      </div>

      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)} className="border-2 border-black bg-white">
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 transition-transform duration-300 transform lg:translate-x-0 bg-white border-r-2 border-black flex flex-col",
        !isOpen && "-translate-x-full"
      )}>
        <div className="h-20 flex items-center px-8 border-b-2 border-black bg-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-bold rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="font-black text-sm tracking-tighter leading-none uppercase">LexisPredict</p>
              <p className="text-[10px] font-bold opacity-60">Elite v245.0</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => {
                console.log(`[TELEMETRY] Menu click: ${item.label}`);
                setIsOpen(false);
              }}
              className={cn(
                "flex items-center gap-4 px-4 py-3 border-2 border-transparent transition-all duration-200 group",
                pathname === item.href 
                  ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]" 
                  : "hover:bg-black hover:text-white hover:border-black"
              )}
            >
              <item.icon size={20} className="shrink-0" />
              <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t-2 border-black space-y-4">
          <div className="flex items-center gap-3 p-3 bg-black/5 border-2 border-black">
            <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-bold text-xs">DA</div>
            <div className="min-w-0">
              <p className="font-black text-[10px] uppercase truncate">Davi Alves</p>
              <p className="text-[8px] font-bold opacity-60 italic">Gestor Master</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 border-2 border-black hover:bg-black hover:text-white"
            onClick={() => {
              console.log("[AUDIT] Encerrando sessão de elite.");
              supabase.auth.signOut().then(() => window.location.href = '/login');
            }}
          >
            <LogOut size={18} />
            <span className="font-bold text-xs uppercase">Encerrar Sessão</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
