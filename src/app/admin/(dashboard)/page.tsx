import Link from "next/link";

const CARDS = [
  { href: "/admin/presentes", title: "Presentes", description: "Adicionar, editar e organizar os presentes da lista." },
  { href: "/admin/categorias", title: "Categorias", description: "Gerenciar as categorias que organizam os presentes." },
  { href: "/admin/galeria", title: "Galeria", description: "Enviar e organizar as fotos do casal." },
  { href: "/admin/configuracoes", title: "Configurações", description: "Editar textos, data do casamento e foto de capa." },
];

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-wine-700">Painel administrativo</h1>
      <p className="mt-2 text-ink/60">Gerencie o conteúdo da sua lista de presentes.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-wine-100 bg-white p-6 transition-all hover:border-wine-500 hover:shadow-md"
          >
            <h2 className="font-display text-lg text-wine-700">{card.title}</h2>
            <p className="mt-1 text-sm text-ink/60">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
