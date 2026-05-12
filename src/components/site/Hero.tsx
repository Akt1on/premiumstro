import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroImg from "@/assets/hero-asphalt.jpg";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative h-screen min-h-[760px] w-full overflow-hidden">
      {/* Background image */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img
          src={heroImg}
          alt="Аэрофотосъёмка ночной укладки асфальта"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-asphalt/70 via-asphalt/40 to-asphalt"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-asphalt/80 via-transparent to-asphalt/40"></div>
      </motion.div>

      {/* Animated grid */}
      <div className="absolute inset-0 grid-lines opacity-40 mask-fade-b pointer-events-none"></div>

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
           style={{ background: "var(--gradient-radial-orange)" }} />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-28 px-6 lg:px-12 max-w-[1600px] mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="h-px w-16 bg-[var(--orange)]"></div>
          <span className="text-xs uppercase tracking-[0.4em] text-[var(--orange)]">
            Est. 2014 · Премиум подход
          </span>
        </motion.div>

        <h1 className="font-display text-[12vw] sm:text-[10vw] md:text-[8.5vw] leading-[0.9] tracking-tight max-w-[1400px] break-words">
          {["ПРЕМИУМ", "АСФАЛЬТИРОВАНИЕ", "И БЛАГОУСТРОЙСТВО"].map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 80, filter: "blur(20px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.4 + i * 0.18, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className={`block ${i === 1 ? "text-stroke-strong" : ""}`}
            >
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="mt-10 flex flex-col md:flex-row md:items-end justify-between gap-10"
        >
          <p className="max-w-md text-base md:text-lg text-concrete leading-relaxed">
            Инженерный подход. Собственная техника. Работаем по всей области —
            круглосуточно, в любую погоду, по точным срокам.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-3 px-7 h-14 bg-[var(--orange)] text-asphalt font-semibold uppercase tracking-wider text-sm overflow-hidden"
            >
              <span className="relative z-10">Рассчитать стоимость</span>
              <svg width="18" height="10" viewBox="0 0 18 10" className="relative z-10 group-hover:translate-x-1 transition-transform">
                <path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <div className="absolute inset-0 bg-[var(--orange-glow)] -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </a>
            <a
              href="#projects"
              className="inline-flex items-center gap-3 px-7 h-14 border border-white/20 text-white font-semibold uppercase tracking-wider text-sm hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--orange)] animate-pulse"></span>
              Смотреть проекты
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom ticker */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 py-5 overflow-hidden bg-asphalt/40 backdrop-blur-sm">
        <div className="flex animate-marquee gap-16 whitespace-nowrap text-xs uppercase tracking-[0.3em] text-concrete">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-16 items-center">
              {["Асфальтирование", "Благоустройство", "Котлованы", "Спецтехника", "Доставка материалов", "Тротуарная плитка", "Ямочный ремонт", "Парковки"].map((t) => (
                <span key={t} className="flex items-center gap-16">
                  {t}
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--orange)]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
