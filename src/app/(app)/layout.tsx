import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/auth";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <AppShell
      title="Tu panel de hábitos"
      description="Gestiona tus hábitos, actualiza lo de hoy y revisa tu consistencia."
      userName={user.name || user.email}
    >
      {children}
    </AppShell>
  );
}
