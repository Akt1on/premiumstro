import { motion } from "framer-motion";
import materialsImg from "@/assets/materials.jpg";

const items = [
  { name: "Щебень", spec: "5–20 / 20–40 / 40–70", price: "от 950 ₽/т" },
  { name: "Песок", spec: "Карьерный / речной / мытый", price: "от 600 ₽/т" },
  { name: "Торф", spec: "Низинный, верховой", price: "от 700 ₽/м³" },
  { name: "Грунт", spec: "Плодородный, планировочный", price: "от 450 ₽/м³" },
  { name: "Земля", spec: "Чернозём, растительная", price: "от 850 ₽/м³" },
];

export function Materials() {
  return (
    <section className="relative bg-graphite py-32 md:py-44 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <img src={materialsImg} alt="" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/70 to-transparent"></div>
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--orange)]"></span>
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--orange)]">Материалы</span>
            </div>
            <p className="text-sm uppercase tracking-wider text-muted-foreground">[05 / 06]</p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-[9vw] md:text-[5vw] leading-[0.9]">
              ЛОГИСТИКА<br/>
              <span className="text-[var(--orange)]">БЕЗ КОМПРОМИССОВ.</span>
            </h2>
            <p className="mt-6 max-w-xl text-concrete">
              Доставляем щебень, песок, торф, грунт и землю собственным
              автопарком. Точный вес, своевременная подача — без задержек.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-px bg-white/10">
          {items.map((it, i) => (
            <motion.div
              key={it.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.7 }}
              className="bg-asphalt p-6 md:p-8 group hover:bg-graphite transition-colors"
            >
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                0{i + 1}
              </div>
              <div className="font-display text-3xl mt-3 group-hover:text-[var(--orange)] transition-colors">
                {it.name}
              </div>
              <div className="mt-2 text-xs text-concrete">{it.spec}</div>
              <div className="mt-6 pt-4 border-t border-white/10 text-sm font-semibold text-[var(--orange)]">
                {it.price}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
