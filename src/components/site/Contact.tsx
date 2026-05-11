import { motion } from "framer-motion";

export function Contact() {
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
            className="font-display text-[12vw] md:text-[7vw] leading-[0.9]"
          >
            ОБСУДИМ <br/>
            <span className="text-[var(--orange)]">ВАШ ПРОЕКТ.</span>
          </motion.h2>
          <p className="mt-6 text-lg text-concrete">
            Оставьте заявку — инженер свяжется в течение 30 минут и подготовит расчёт.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
          <form className="lg:col-span-7 bg-graphite p-8 lg:p-12 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Имя</label>
                <input className="mt-2 w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-[var(--orange)] transition-colors" placeholder="Иван" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Телефон</label>
                <input className="mt-2 w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-[var(--orange)] transition-colors" placeholder="+7 (___) ___-__-__" />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Тип работ</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Асфальт", "Благоустройство", "Котлован", "Техника", "Материалы"].map((t) => (
                  <button key={t} type="button" className="px-3 py-1.5 text-xs uppercase tracking-widest border border-white/15 hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors">{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Сообщение</label>
              <textarea rows={3} className="mt-2 w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-[var(--orange)] resize-none transition-colors" placeholder="Площадь, адрес, сроки..."></textarea>
            </div>
            <button type="button" className="group relative w-full h-14 bg-[var(--orange)] text-asphalt font-semibold uppercase tracking-widest text-sm overflow-hidden">
              <span className="relative z-10 flex items-center justify-center gap-3">
                Отправить заявку
                <svg width="20" height="10" viewBox="0 0 20 10"><path d="M0 5h17M14 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
              </span>
              <div className="absolute inset-0 bg-[var(--orange-glow)] -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </button>
          </form>

          <div className="lg:col-span-5 space-y-px bg-white/10">
            {[
              { l: "Телефон", v: "+7 (800) 000-00-00", h: "tel:+78000000000" },
              { l: "Email", v: "info@premiumstroe.ru", h: "mailto:info@premiumstroe.ru" },
              { l: "Адрес", v: "г. Москва, Промзона «Север», 14", h: "#" },
              { l: "Режим работы", v: "24 / 7 — без выходных" },
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
