import Link from 'next/link';
import { Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <Link href="/" className="flex items-center gap-2 font-headline text-lg font-bold">
        <Dumbbell className="h-6 w-6 text-accent" />
        <span>Treino LevelUp</span>
      </Link>
      <nav className="ml-auto flex items-center gap-2">
        <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <Link href="/training-plan">
            Plano de Treino IA
          </Link>
        </Button>
      </nav>
    </header>
  );
}
