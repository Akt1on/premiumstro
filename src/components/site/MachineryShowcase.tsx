import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import truck from "@/assets/machinery-truck.jpg";
import excavator from "@/assets/machinery-excavator.jpg";
import paver from "@/assets/machinery-paver.jpg";
import roller from "@/assets/machinery-roller.jpg";

const fleet = [
  { id: "truck", name: "Самосвалы", model: "10–25 т", img: truck, specs: ["Объём 12 м³", "Грузоподъёмность 25 т", "До 6 единиц"] },
  { id: "exc", name: "Экскаватор-погрузчик", model: "JCB 4CX", img: excavator, specs: ["Глубина копания 6 м", "Ковш 1 м³", "Опытный оператор"] },
  { id: "paver", name: "Асфальтоукладчик", model: "Vögele Super", img: paver, specs: ["Ширина 2.5–6 м", "Авто-нивелир", "Точный слой"] },
  { id: "roller", name: "Дорожные катки", model: "BOMAG / HAMM", img: roller, specs: ["Вибро-уплотнение", "Масса 8–14 т", "Гладкие швы"] },
];

export function MachineryShowcase() {
  const [idx, setIdx] = useState(0);
  const item = fleet[idx];

  return (
    <section id="machinery" className="relative bg-asphalt py-32 md:py-44 overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none"></div>

      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--orange)]"></span>
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--orange)]">Парк техники</span>
            </div>
            <p className="text-sm uppercase tracking-wider text-muted-foreground">[04 / 06]</p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-[9vw] md:text-[5vw] leading-[0.9]">
              СОБСТВЕННЫЙ ПАРК.<br/>
              <span className="text-[var(--orange)]">БЕЗ ПОСРЕДНИКОВ.</span>
            </h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Visual */}
          <div className="lg:col-span-8 relative">
            <div className="relative aspect-[16/10] overflow-hidden bg-graphite">
              <AnimatePresence mode="wait">
                <motion.img
                  key={item.id}
                  src={item.img}
                  alt={item.name}
                  loading="lazy"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/20 to-transparent"></div>

              {/* Technical UI overlays */}
              <div className="absolute top-6 left-6 right-6 flex justify-between text-[10px] uppercase tracking-widest text-concrete">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--orange)] animate-pulse"></span>
                  Unit {String(idx + 1).padStart(2, "0")} / {fleet.length}
                </div>
                <div>{item.model}</div>
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="font-display text-5xl lg:text-7xl"
                  >
                    {item.name}
                  </motion.h3>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Selector */}
          <div className="lg:col-span-4 space-y-px">
            {fleet.map((f, i) => (
              <button
                key={f.id}
                onClick={() => setIdx(i)}
                className={`w-full text-left p-6 border border-white/10 transition-all duration-500 ${
                  i === idx ? "bg-[var(--orange)] text-asphalt border-[var(--orange)]" : "bg-graphite hover:border-[var(--orange)]/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest opacity-70">{String(i + 1).padStart(2, "0")}</div>
                    <div className="font-display text-2xl mt-1">{f.name}</div>
                  </div>
                  <svg width="22" height="14" viewBox="0 0 22 14" className={i === idx ? "" : "opacity-40"}>
                    <path d="M0 7h18M14 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                </div>
                {i === idx && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 space-y-1 text-xs"
                  >
                    {f.specs.map((s) => <li key={s}>— {s}</li>)}
                  </motion.ul>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
