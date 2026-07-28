"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Painel", exact: true },
  { href: "/admin/presentes", label: "Presentes" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/galeria", label: "Galeria" },
  { href: "/admin/configuracoes", label: "Configurações" },
];

export function AdminNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex gap-1", className)}>
      {LINKS.map((link) => {
        const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-wine-500 text-white"
                : "text-ink/70 hover:bg-wine-50 hover:text-wine-700"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
