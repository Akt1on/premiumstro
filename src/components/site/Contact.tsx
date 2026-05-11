import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/lib/use-settings";

const schema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(120),
  phone: z.string().trim().min(5, "Укажите телефон").max(40),
  message: z.string().trim().max(1000).optional(),
  service_type: z.string().trim().max(80).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Необходимо согласие" }) }),
});

const TYPES = ["Асфальт", "Благоустройство", "Котлован", "Техника", "Материалы"];

export function Contact() {
  const { data: s } = useSettings();
  const [type, setType] = useState<string>("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      message: String(fd.get("message") || ""),
      service_type: type || undefined,
      consent,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Проверьте поля");
      return;
    }
    setStatus("sending");
    const { error: err } = await supabase.from("leads").insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      message: parsed.data.message ?? null,
      service_type: parsed.data.service_type ?? null,
      consent: true,
      source_page: typeof window !== "undefined" ? window.location.pathname : null,
    });
    if (err) { setStatus("err"); setError("Не удалось отправить. Попробуйте позже."); return; }
    setStatus("ok");
    (e.currentTarget as HTMLFormElement).reset();
    setType(""); setConsent(false);
  }

  return (
    <section id="contact" className="relative bg-asphalt py-32 md:py-44 overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-30 blur-3xl pointer-events-none"
           style={{ background: "var(--gradient-radial-orange)" }}></div>

      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--orange)] animate-pulse"></span>
            <span className="text-xs uppercase tracking-[0.4em] text-[var(--orange)]">Готовы начать</span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-display text-[10vw] sm:text-[8vw] md:text-[7vw] leading-[0.9]"
          >
            ОБСУДИМ <br/>
            <span className="text-[var(--orange)]">ВАШ ПРОЕКТ.</span>
          </motion.h2>
          <p className="mt-6 text-base sm:text-lg text-concrete px-2">
            Оставьте заявку — инженер свяжется в течение 30 минут и подготовит расчёт.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
          <form onSubmit={onSubmit} className="lg:col-span-7 bg-graphite p-6 sm:p-8 lg:p-12 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Имя</label>
                <input name="name" required maxLength={120} className="mt-2 w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-[var(--orange)] transition-colors" placeholder="Иван" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Телефон</label>
                <input name="phone" required maxLength={40} type="tel" className="mt-2 w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-[var(--orange)] transition-colors" placeholder="+7 (___) ___-__-__" />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Тип работ</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType((v) => v === t ? "" : t)}
                    className={`px-3 py-1.5 text-xs uppercase tracking-widest border transition-colors ${
                      type === t
                        ? "border-[var(--orange)] text-[var(--orange)] bg-[var(--orange)]/10"
                        : "border-white/15 hover:border-[var(--orange)] hover:text-[var(--orange)]"
                    }`}
                  >{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Сообщение</label>
              <textarea name="message" rows={3} maxLength={1000} className="mt-2 w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-[var(--orange)] resize-none transition-colors" placeholder="Площадь, адрес, сроки..."></textarea>
            </div>
            <label className="flex items-start gap-3 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[var(--orange)]"
              />
              <span>
                Я даю согласие на обработку персональных данных в соответствии с{" "}
                <Link to="/privacy" className="text-[var(--orange)] underline">Политикой конфиденциальности</Link>{" "}
                (152-ФЗ).
              </span>
            </label>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {status === "ok" && <p className="text-sm text-[var(--orange)]">Заявка отправлена. Свяжемся в течение 30 минут.</p>}
            <button
              type="submit"
              disabled={status === "sending"}
              className="group relative w-full h-14 bg-[var(--orange)] text-asphalt font-semibold uppercase tracking-widest text-sm overflow-hidden disabled:opacity-60"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {status === "sending" ? "Отправка..." : "Отправить заявку"}
                <svg width="20" height="10" viewBox="0 0 20 10"><path d="M0 5h17M14 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
              </span>
              <div className="absolute inset-0 bg-[var(--orange-glow)] -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </button>
          </form>

          <div className="lg:col-span-5 space-y-px bg-white/10">
            {[
              { l: "Телефон", v: s?.phone ?? "+7 (800) 000-00-00", h: `tel:${(s?.phone ?? "").replace(/[^+\d]/g, "")}` },
              { l: "Email", v: s?.email ?? "info@premiumstroe.ru", h: `mailto:${s?.email ?? ""}` },
              { l: "Адрес", v: s?.address ?? "г. Красногорск, МО" },
              { l: "Режим работы", v: s?.working_hours ?? "24 / 7 — без выходных" },
            ].map((c) => (
              <a key={c.l} href={c.h} className="block bg-graphite p-6 hover:bg-asphalt transition-colors group">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.l}</div>
                <div className="font-display text-xl mt-2 group-hover:text-[var(--orange)] transition-colors">{c.v}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
