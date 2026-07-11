"use client";

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Clock, CheckCircle2, MessageCircle, CalendarDays, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

export function DeadlinesView({ data }: { data: any[] }) {
  const groups = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const categories = {
      overdue: [] as any[],
      today: [] as any[],
      next: [] as any[],
      closedWithDate: [] as any[] // Nova categoria estratégica
    };

    data.forEach(row => {
      const status = String(row.status || '').toUpperCase();
      const responsavel = String(row.responsavel || '').toUpperCase();
      const isEncerrado = status.includes('ENCERRADO') || status.includes('ARQUIVADO') || responsavel.includes('ENCERRADO');
      
      const dateStr = row.proximo || row.prazo;
      if (!dateStr) return;

      const parts = dateStr.split('/');
      if (parts.length !== 3) return;
      
      const deadline = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      deadline.setHours(0, 0, 0, 0);

      const item = { ...row, deadlineDate: deadline };

      if (isEncerrado) {
        categories.closedWithDate.push(item);
      } else if (deadline < today) {
        categories.overdue.push(item);
      } else if (deadline.getTime() === today.getTime()) {
        categories.today.push(item);
      } else {
        categories.next.push(item);
      }
    });

    return categories;
  }, [data]);

  return (
    <div className="flex-1 flex flex-col h-full bg-background p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <CalendarDays className="text-primary" /> Controle de Prazos Operacionais
        </h2>
        <p className="text-zinc-500 text-sm">Gestão de retornos e agendamentos estratégicos.</p>
      </div>

      <Tabs defaultValue="overdue" className="flex-1 flex flex-col">
        <TabsList className="bg-zinc-900 border border-zinc-800 p-1 mb-6">
          <TabsTrigger value="overdue" className="gap-2 text-xs uppercase">
            <AlertCircle size={14} className="text-rose-500" /> Atrasados ({groups.overdue.length})
          </TabsTrigger>
          <TabsTrigger value="today" className="gap-2 text-xs uppercase">
            <Clock size={14} className="text-amber-500" /> Para Hoje ({groups.today.length})
          </TabsTrigger>
          <TabsTrigger value="next" className="gap-2 text-xs uppercase">
            <CalendarDays size={14} className="text-emerald-500" /> Próximos ({groups.next.length})
          </TabsTrigger>
          <TabsTrigger value="closed" className="gap-2 text-xs uppercase">
            <Archive size={14} className="text-zinc-500" /> Encerrados c/ Data ({groups.closedWithDate.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overdue" className="flex-1">
          <DeadlineList items={groups.overdue} type="overdue" />
        </TabsContent>
        <TabsContent value="today" className="flex-1">
          <DeadlineList items={groups.today} type="today" />
        </TabsContent>
        <TabsContent value="next" className="flex-1">
          <DeadlineList items={groups.next} type="next" />
        </TabsContent>
        <TabsContent value="closed" className="flex-1">
          <DeadlineList items={groups.closedWithDate} type="closed" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DeadlineList({ items, type }: { items: any[], type: string }) {
  if (items.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-600">
        <CheckCircle2 size={48} className="mb-4 opacity-20" />
        <p>Nenhum compromisso nesta categoria.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-280px)] pr-4">
      <div className="grid gap-3">
        {items.map((item, i) => (
          <Card key={i} className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-all group">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white uppercase">{item.cliente}</h4>
                  <Badge variant="outline" className="text-[9px] border-zinc-700 text-zinc-400">
                    {item.processo || 'S/N'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-zinc-500">
                  <span className="flex items-center gap-1"><Clock size={10} /> Retorno: {item.retorno || '-'}</span>
                  <span className="flex items-center gap-1 font-bold text-zinc-300">
                    <CalendarDays size={10} /> Agendado: {item.proximo || item.prazo}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right mr-4">
                  <p className={cn(
                    "text-[10px] font-black uppercase",
                    type === 'overdue' ? "text-rose-500" : type === 'today' ? "text-amber-500" : type === 'closed' ? "text-zinc-500" : "text-emerald-500"
                  )}>
                    {type === 'overdue' ? 'Atrasado' : type === 'today' ? 'Hoje' : type === 'closed' ? 'Encerrado c/ Data' : 'Em Dia'}
                  </p>
                  <p className="text-[9px] text-zinc-600">{item.responsavel}</p>
                </div>
                
                <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-zinc-800 hover:bg-emerald-500/10 hover:text-emerald-500">
                  <MessageCircle size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
