import { getSiteSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-3xl text-wine-700">Configurações</h1>
      <p className="mt-1 text-ink/60">Textos e imagens da página inicial.</p>

      <div className="mt-6">
        <SettingsForm
          initialValues={{
            coupleName: settings.coupleName,
            welcomeMessage: settings.welcomeMessage,
            footerMessage: settings.footerMessage,
            weddingDate: settings.weddingDate,
            heroImageKey: settings.heroImageKey,
          }}
        />
      </div>
    </div>
  );
}
