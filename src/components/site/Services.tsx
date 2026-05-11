import { motion } from "framer-motion";
import paver from "@/assets/machinery-paver.jpg";
import excavation from "@/assets/excavation.jpg";
import landscaping from "@/assets/landscaping.jpg";
import materials from "@/assets/materials.jpg";
import road from "@/assets/road-aerial.jpg";

const services = [
  {
    n: "01",
    title: "Асфальтирование",
    desc: "Дороги, парковки, дворы, ямочный ремонт и укладка крошки. Полный цикл от подготовки основания до финишного слоя.",
    img: road,
    tags: ["Дороги", "Парковки", "Дворы", "Ремонт"],
  },
  {
    n: "02",
    title: "Благоустройство",
    desc: "Тротуарная плитка, бордюры, дренаж, озеленение. Архитектурный подход к каждой территории.",
    img: landscaping,
    tags: ["Плитка", "Бордюры", "Дренаж", "Озеленение"],
  },
  {
    n: "03",
    title: "Разработка котлованов",
    desc: "Земляные работы любой сложности. Точный расчёт объёмов, вывоз грунта собственным транспортом.",
    img: excavation,
    tags: ["Земля", "Вывоз", "Планировка"],
  },
  {
    n: "04",
    title: "Аренда спецтехники",
    desc: "Самосвалы, экскаваторы, катки, асфальтоукладчики. С опытным оператором или без.",
    img: paver,
    tags: ["Самосвалы", "Катки", "Экскаваторы"],
  },
  {
    n: "05",
    title: "Доставка материалов",
    desc: "Щебень, песок, торф, грунт, земля. Логистика без задержек и недовесов — собственный автопарк.",
    img: materials,
    tags: ["Щебень", "Песок", "Торф", "Грунт"],
  },
];

export function Services() {
  return (
    <section id="services" className="relative bg-graphite">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-32 md:py-44">
        <div className="grid lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--orange)]"></span>
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--orange)]">Услуги</span>
            </div>
            <p className="text-sm uppercase tracking-wider text-muted-foreground">[02 / 06]</p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-[10vw] md:text-[5.5vw] leading-[0.9]">
              ПЯТЬ НАПРАВЛЕНИЙ.<br/>
              <span className="text-[var(--orange)]">ОДИН СТАНДАРТ.</span>
            </h2>
          </div>
        </div>

        <div className="space-y-px">
          {services.map((s, i) => (
            <motion.a
              key={s.n}
              href="#contact"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: i * 0.05 }}
              className="group relative grid grid-cols-12 gap-6 items-center py-8 lg:py-12 border-t border-white/10 hover:bg-asphalt/60 transition-colors duration-700"
            >
              <div className="col-span-2 lg:col-span-1 font-display text-2xl text-[var(--orange)]">
                {s.n}
              </div>
              <div className="col-span-10 lg:col-span-4">
                <h3 className="font-display text-3xl lg:text-5xl group-hover:translate-x-3 transition-transform duration-700">
                  {s.title}
                </h3>
              </div>
              <div className="col-span-12 lg:col-span-4 text-sm lg:text-base text-concrete max-w-md">
                {s.desc}
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span key={t} className="text-[10px] uppercase tracking-wider px-2.5 py-1 border border-white/15 text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-span-12 lg:col-span-3 relative">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-asphalt/40 group-hover:bg-transparent transition-colors duration-700"></div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
