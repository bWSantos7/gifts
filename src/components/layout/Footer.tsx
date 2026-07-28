import Image from "next/image";

export function Footer({
  coupleName,
  footerMessage,
}: {
  coupleName: string;
  footerMessage: string;
}) {
  return (
    <footer className="mt-auto border-t border-wine-100 bg-wine-900 px-4 py-14 text-center text-white">
      <Image
        src="/img/monogram-wine.jpg"
        alt={coupleName}
        width={56}
        height={56}
        className="mx-auto rounded-full"
      />
      <p className="mx-auto mt-6 max-w-lg text-balance text-sm leading-relaxed text-white/80 sm:text-base">
        {footerMessage}
      </p>
      <p className="mt-8 text-xs uppercase tracking-[0.3em] text-gold">{coupleName}</p>
    </footer>
  );
}
