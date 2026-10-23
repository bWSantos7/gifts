"use client";
import { useEffect, useState } from "react";

// Depende das fontes Google "Cormorant Garamond" e "DM Sans", carregadas no <head> do RootLayout.
export default function WelcomeModal() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  function close() {
    setClosing(true);
    setTimeout(() => setVisible(false), 400);
  }

  if (!visible) return null;

  return (
    <>
      <style>{`
        .wm-overlay{position:fixed;inset:0;z-index:9999;background:rgba(51,42,39,.72);backdrop-filter:blur(4px);display:grid;place-items:center;padding:20px;animation:wmFadeIn .35s ease;font-family:"DM Sans",sans-serif}
        .wm-overlay.wm-closing{animation:wmFadeOut .4s ease forwards}
        .wm-overlay.wm-closing .wm-box{animation:wmSlideDown .4s ease forwards}
        .wm-box{background:#fffdf9;max-width:520px;width:100%;padding:40px 44px;border:1px solid rgba(115,0,0,.17);position:relative;text-align:center;animation:wmSlideUp .45s cubic-bezier(.22,.68,0,1.2)}
        .wm-box:before{content:"";position:absolute;inset:8px;border:1px solid rgba(211,174,75,.28);pointer-events:none}
        .wm-ornament{display:flex;align-items:center;justify-content:center;gap:14px;margin:4px 0}
        .wm-ornament:before,.wm-ornament:after{content:"";flex:1;height:1px;background:#d3ae4b;opacity:.55}
        .wm-ornament span{color:#d3ae4b;font-size:10px}
        .wm-heading{font-family:"Cormorant Garamond",serif;font-size:clamp(32px,6vw,48px);font-weight:400;margin:10px 0 2px;color:#730000}
        .wm-sub{font-family:"Cormorant Garamond",serif;font-size:17px;font-style:italic;color:#766b66;margin:0 0 18px}
        .wm-divider{height:1px;background:rgba(115,0,0,.17);margin:16px 0}
        .wm-body{font-size:13px;line-height:1.85;color:#332a27;margin:0 0 14px;text-align:left}
        .wm-highlight{background:rgba(115,0,0,.05);border-left:2px solid #730000;padding:10px 14px;border-radius:0 4px 4px 0}
        .wm-closing-text{color:#766b66;font-size:12.5px}
        .wm-btn{display:inline-flex;align-items:center;gap:8px;margin-top:20px;padding:13px 30px;background:#730000;color:#fff;border:none;font-family:"DM Sans",sans-serif;font-size:10px;letter-spacing:.22em;text-transform:uppercase;cursor:pointer;transition:background .25s,transform .2s}
        .wm-btn:hover{background:#4c0000;transform:translateY(-1px)}
        @media(max-width:520px){.wm-box{padding:32px 24px}}
        @keyframes wmFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes wmSlideUp{from{opacity:0;transform:translateY(28px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes wmFadeOut{from{opacity:1}to{opacity:0}}
        @keyframes wmSlideDown{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(20px) scale(.97)}}
      `}</style>

      <div
        className={`wm-overlay${closing ? " wm-closing" : ""}`}
        onClick={close}
        aria-modal="true"
        role="dialog"
      >
        <div className="wm-box" onClick={(e) => e.stopPropagation()}>
          <div className="wm-ornament">
            <span>✦</span>
          </div>

          <p className="wm-heading">Olá!</p>
          <p className="wm-sub">
            Ficamos muito felizes em ter você aqui!
          </p>

          <div className="wm-divider" />

          <p className="wm-body">
            Os presentes listados são apenas sugestões para servir de referência,
            então fique à vontade para escolher o item, a loja ou o tipo de
            presente que preferir. O importante é que seja algo escolhido com
            carinho!
          </p>

          <p className="wm-body wm-highlight">
            Ah, um detalhe importante: os itens elétricos precisam ser{" "}
            <strong>110V</strong>, pois nossa futura casinha não terá tomadas de
            220V.
          </p>

          <p className="wm-body wm-closing-text">
            Agradecemos muito pelo carinho e por fazer parte desse momento tão
            especial das nossas vidas!
          </p>

          <div className="wm-ornament">
            <span>✦</span>
          </div>

          <button className="wm-btn" onClick={close}>
            Entendido, com amor! 🤍
          </button>
        </div>
      </div>
    </>
  );
}
