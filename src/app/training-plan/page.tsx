import Header from '@/components/Header';
import TrainingPlanForm from './TrainingPlanForm';
import { Providers } from '@/app/providers';

export default function TrainingPlanPage() {
  return (
    <Providers>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center gap-4 p-4 pt-10 md:gap-8 md:p-8">
          <div className="w-full max-w-2xl text-center">
              <h1 className="text-3xl font-bold font-headline text-primary">Plano de Treino Personalizado</h1>
              <p className="text-muted-foreground mt-2">Deixe nosso sistema de IA gerar um plano de treino personalizado para você.</p>
          </div>
          <div className="w-full max-w-2xl mt-8">
            <TrainingPlanForm />
          </div>
        </main>
      </div>
    </Providers>
  );
}
