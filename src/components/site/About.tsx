import { Counter } from "./Counter";
import { motion } from "framer-motion";

const stats = [
  { value: 12, suffix: "+", label: "Лет на рынке" },
  { value: 480, suffix: "", label: "Завершённых проектов" },
  { value: 24, suffix: "", label: "Единиц техники" },
  { value: 100, suffix: "%", label: "Гарантия качества" },
];

export function About() {
  return (
    <section id="about" className="relative py-32 md:py-44 overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-30 pointer-events-none"></div>
      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 mb-24">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--orange)]"></span>
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--orange)]">О компании</span>
            </div>
            <p className="text-sm uppercase tracking-wider text-muted-foreground">
              [01 / 06]
            </p>
          </div>
          <div className="lg:col-span-8">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="font-display text-[8vw] md:text-[5vw] leading-[0.9]"
            >
              МЫ СТРОИМ ИНФРАСТРУКТУРУ,<br/>
              <span className="text-stroke">КОТОРАЯ </span>
              <span className="text-[var(--orange)]">ОСТАЁТСЯ.</span>
            </motion.h2>
            <p className="mt-10 max-w-2xl text-lg text-concrete leading-relaxed">
              Мы — инженерная команда полного цикла. Используем собственный парк
              техники, контролируем каждую тонну материала и сдаём объекты в срок,
              даже когда обстоятельства против нас.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-white/10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="relative py-10 lg:py-14 px-6 border-r last:border-r-0 border-white/10 group"
            >
              <div className="font-display text-6xl lg:text-7xl text-white group-hover:text-[var(--orange)] transition-colors">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {s.label}
              </div>
              <div className="absolute bottom-0 left-0 h-px w-0 bg-[var(--orange)] group-hover:w-full transition-all duration-700"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
