"use client";

import { useState } from "react";

export function ShareListButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.origin + window.location.pathname;
    const shareData = { title: "Lista de presentes", url };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // usuário cancelou o compartilhamento
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-full border border-wine-500 px-4 py-1.5 text-sm font-medium text-wine-500 transition-colors hover:bg-wine-50"
    >
      {copied ? "Link copiado!" : "Compartilhar"}
    </button>
  );
}
