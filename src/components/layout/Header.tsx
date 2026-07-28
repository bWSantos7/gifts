import Image from "next/image";
import Link from "next/link";
import { ShareListButton } from "@/components/gifts/ShareListButton";

export function Header({ coupleName }: { coupleName: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-wine-100 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/img/monogram.png" alt={coupleName} width={46} height={64} priority />
          <span className="font-display text-lg text-wine-700">{coupleName}</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="#presentes"
            className="hidden text-sm font-medium text-ink/70 transition-colors hover:text-wine-500 sm:inline"
          >
            Presentes
          </Link>
          <Link
            href="#galeria"
            className="hidden text-sm font-medium text-ink/70 transition-colors hover:text-wine-500 sm:inline"
          >
            Galeria
          </Link>
          <ShareListButton />
        </nav>
      </div>
    </header>
  );
}
