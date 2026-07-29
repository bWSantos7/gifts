"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { imageUrl, cn } from "@/lib/utils";

const AUTO_ADVANCE_MS = 6000;

export function HeroCarousel({
  photos,
  alt,
}: {
  photos: { id: string; imageKey: string }[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % photos.length) + photos.length) % photos.length);
    },
    [photos.length]
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    if (photos.length < 2) return;
    const interval = setInterval(() => goTo(index + 1), AUTO_ADVANCE_MS);
    return () => clearInterval(interval);
  }, [photos.length, index, goTo]);

  if (photos.length === 0) return null;

  return (
    <>
      {photos.map((photo, i) => (
        <Image
          key={photo.id}
          src={imageUrl(photo.imageKey)}
          alt={alt}
          fill
          priority={i === 0}
          sizes="100vw"
          className={cn(
            "object-cover opacity-50 transition-opacity duration-1000 ease-in-out",
            i === index ? "opacity-50" : "opacity-0"
          )}
        />
      ))}

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40 sm:left-6"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-5 w-5">
              <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Próxima foto"
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40 sm:right-6"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-5 w-5">
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {photos.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir para foto ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-6 bg-gold" : "w-1.5 bg-white/50 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
