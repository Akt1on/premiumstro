import { motion } from "framer-motion";

const steps = [
  { n: "01", t: "Заявка", d: "Обсуждаем задачу, объёмы, сроки." },
  { n: "02", t: "Выезд", d: "Инженер приезжает на объект, делает замеры." },
  { n: "03", t: "Смета", d: "Прозрачный расчёт без скрытых платежей." },
  { n: "04", t: "Подготовка", d: "Логистика, материалы, техника на площадке." },
  { n: "05", t: "Выполнение", d: "Работаем по графику, фиксируем каждый этап." },
  { n: "06", t: "Сдача объекта", d: "Подписываем акт, даём гарантию." },
];

export function Process() {
  return (
    <section id="process" className="relative bg-graphite py-32 md:py-44 overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none"></div>

      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--orange)]"></span>
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--orange)]">Процесс</span>
            </div>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-[9vw] md:text-[5vw] leading-[0.9]">
              ШЕСТЬ ШАГОВ —<br/>
              <span className="text-[var(--orange)]">ОТ ЗАЯВКИ ДО СДАЧИ.</span>
            </h2>
          </div>
        </div>

        <div className="relative">
          {/* Animated road line */}
          <div className="absolute top-12 left-0 right-0 h-0.5 hidden lg:block animate-road"></div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-px bg-white/10">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className="relative bg-graphite p-6 lg:p-8 group hover:bg-asphalt transition-colors"
              >
                <div className="w-6 h-6 rounded-full border-2 border-[var(--orange)] grid place-items-center mb-6 group-hover:bg-[var(--orange)] transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--orange)] group-hover:bg-asphalt"></div>
                </div>
                <div className="font-display text-xs text-muted-foreground tracking-widest">{s.n}</div>
                <div className="font-display text-2xl mt-1 group-hover:text-[var(--orange)] transition-colors">{s.t}</div>
                <p className="mt-3 text-sm text-concrete">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
