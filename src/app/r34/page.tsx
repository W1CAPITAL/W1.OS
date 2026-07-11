
"use client";

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import R34View from '@/components/crm/r34-view';
import { useRouter } from 'next/navigation';

export default function R34Page() {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const isEnabled = localStorage.getItem('r34_protocol') === 'true';
    if (!isEnabled) {
      router.push('/');
    } else {
      setAllowed(true);
    }
  }, [router]);

  if (allowed === null) return null;

  return (
    <div className="flex h-screen bg-[#F4F4F6]">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <R34View />
      </main>
    </div>
  );
}
