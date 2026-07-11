"use client";

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PlayerProvider = dynamic(() => import('@/context/PlayerClientContext').then((mod) => mod.PlayerProvider), {
  ssr: false,
  loading: () => (
      <div className="p-4 md:p-8 space-y-4">
        <div className="flex justify-between items-center h-10">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
  )
});

export function Providers({ children }: { children: ReactNode }) {
  return <PlayerProvider>{children}</PlayerProvider>;
}
