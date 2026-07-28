"use client";

import { useState, type MouseEvent } from "react";

export function ShareButton({ giftId, giftName }: { giftId: string; giftName: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}?presente=${giftId}`;
    const shareData = { title: giftName, url };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <button
      onClick={handleShare}
      aria-label="Compartilhar presente"
      title="Compartilhar"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-wine-100 text-wine-500 transition-colors hover:bg-wine-50"
    >
      {copied ? (
        <span className="text-[10px] font-medium">✓</span>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={1.75}>
          <path
            d="M8.68 13.34a3 3 0 1 0 0-2.68m0 2.68 6.64 3.66m-6.64-6.34 6.64-3.66M18 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm0 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
