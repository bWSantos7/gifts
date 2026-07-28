import Image from "next/image";
import { signOut } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-wine-50/40">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-wine-100 bg-white p-6 md:flex">
        <div className="flex items-center gap-3">
          <Image
            src="/img/monogram-wine.jpg"
            alt="K & B"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-display text-lg text-wine-700">K &amp; B</span>
        </div>

        <div className="mt-8 flex-1">
          <AdminNav className="flex-col" />
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-ink/60 transition-colors hover:bg-wine-50 hover:text-wine-700"
          >
            Sair
          </button>
        </form>
      </aside>

      <div className="flex-1">
        <header className="border-b border-wine-100 bg-white px-6 py-4 md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/img/monogram-wine.jpg"
                alt="K & B"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="font-display text-wine-700">Painel</span>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button type="submit" className="text-sm text-wine-500">
                Sair
              </button>
            </form>
          </div>
          <div className="mt-4 -mx-1 flex gap-1 overflow-x-auto pb-1">
            <AdminNav />
          </div>
        </header>
        <div className="p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}
