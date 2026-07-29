import Image from "next/image";
import { imageUrl } from "@/lib/utils";
import { Countdown } from "@/components/home/Countdown";
import { HeroCarousel } from "@/components/home/HeroCarousel";

export function Hero({
  coupleName,
  welcomeMessage,
  weddingDate,
  heroImageKey,
  galleryPhotos,
}: {
  coupleName: string;
  welcomeMessage: string;
  weddingDate: Date;
  heroImageKey: string | null;
  galleryPhotos: { id: string; imageKey: string }[];
}) {
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(weddingDate);

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-wine-900 px-4 py-24 text-center sm:min-h-screen">
      {galleryPhotos.length > 0 ? (
        <HeroCarousel photos={galleryPhotos} alt={coupleName} />
      ) : (
        heroImageKey && (
          <Image
            src={imageUrl(heroImageKey)}
            alt={coupleName}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
        )
      )}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-wine-900/60 via-wine-900/50 to-wine-900/80" />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center animate-fade-in-up">
        <span className="text-xs uppercase tracking-[0.3em] text-gold">Nossa lista de presentes</span>
        <h1 className="mt-4 font-display text-5xl text-white sm:text-7xl">{coupleName}</h1>
        <div className="mt-4 h-px w-16 bg-gold" />
        <p className="mt-4 text-sm uppercase tracking-widest text-white/80">{formattedDate}</p>

        {welcomeMessage && (
          <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-white/90 sm:text-lg">
            {welcomeMessage}
          </p>
        )}

        <div className="mt-10 w-full">
          <Countdown weddingDate={weddingDate.toISOString()} />
        </div>
      </div>
    </section>
  );
}
