import { motion } from "framer-motion";
import road from "@/assets/road-aerial.jpg";
import landscaping from "@/assets/landscaping.jpg";
import excavation from "@/assets/excavation.jpg";
import paver from "@/assets/machinery-paver.jpg";

const projects = [
  { title: "Магистраль М-7", area: "12 400 м²", year: "2024", img: road, type: "Асфальтирование" },
  { title: "ЖК «Северный»", area: "8 200 м²", year: "2024", img: landscaping, type: "Благоустройство" },
  { title: "Логистический хаб", area: "24 100 м²", year: "2023", img: excavation, type: "Котлован + асфальт" },
  { title: "Парковка ТЦ «Орбита»", area: "5 600 м²", year: "2023", img: paver, type: "Асфальтирование" },
];

export function Projects() {
  return (
    <section id="projects" className="relative bg-asphalt py-32 md:py-44">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--orange)]"></span>
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--orange)]">Портфолио</span>
            </div>
            <p className="text-sm uppercase tracking-wider text-muted-foreground">[06 / 06]</p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-[9vw] md:text-[5vw] leading-[0.9]">
              КАЖДЫЙ ОБЪЕКТ —<br/>
              <span className="text-[var(--orange)]">ПОДПИСЬ КАЧЕСТВА.</span>
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: (i % 2) * 0.15, duration: 1 }}
              className={`group relative overflow-hidden ${i % 3 === 0 ? "md:col-span-2 aspect-[16/8]" : "aspect-[4/3]"}`}
            >
              <img
                src={p.img}
                alt={p.title}
                loading="lazy"
                className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/30 to-transparent"></div>
              <div className="absolute inset-0 border border-white/0 group-hover:border-[var(--orange)] transition-colors duration-700"></div>

              <div className="absolute top-6 left-6 right-6 flex justify-between items-start text-xs uppercase tracking-widest">
                <div className="px-2 py-1 bg-[var(--orange)] text-asphalt font-semibold">{p.type}</div>
                <div className="text-concrete">{p.year}</div>
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <div className="font-display text-4xl lg:text-5xl group-hover:text-[var(--orange)] transition-colors">
                  {p.title}
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs uppercase tracking-widest text-concrete">
                  <span className="w-6 h-px bg-[var(--orange)]"></span>
                  {p.area}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
