import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const KEY = "ps_cookie_consent_v1";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(KEY)) setShow(true);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] p-3 sm:p-4">
      <div className="mx-auto max-w-3xl bg-graphite/95 backdrop-blur border border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center shadow-2xl">
        <p className="text-xs sm:text-sm text-concrete leading-relaxed">
          Мы используем cookies и обрабатываем персональные данные согласно{" "}
          <Link to="/privacy" className="text-[var(--orange)] underline">Политике конфиденциальности</Link>{" "}
          (152-ФЗ). Продолжая пользоваться сайтом, вы соглашаетесь.
        </p>
        <button
          onClick={() => { localStorage.setItem(KEY, "1"); setShow(false); }}
          className="shrink-0 px-5 h-10 bg-[var(--orange)] text-asphalt text-xs uppercase tracking-widest font-semibold hover:bg-[var(--orange-glow)] transition-colors"
        >
          Принять
        </button>
      </div>
    </div>
  );
}