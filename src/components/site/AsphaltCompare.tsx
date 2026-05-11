import { useRef, useState } from "react";
import road from "@/assets/road-aerial.jpg";
import excavation from "@/assets/excavation.jpg";

export function AsphaltCompare() {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = (clientX: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  return (
    <section className="relative bg-asphalt py-32 md:py-44">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 mb-14">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--orange)]"></span>
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--orange)]">Асфальт</span>
            </div>
            <p className="text-sm uppercase tracking-wider text-muted-foreground">[03 / 06]</p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-[9vw] md:text-[5vw] leading-[0.9]">
              ОТ ЯМЫ — <br />
              <span className="text-stroke">ДО </span>
              <span className="text-[var(--orange)]">ИДЕАЛЬНОЙ ДОРОГИ.</span>
            </h2>
          </div>
        </div>

        <div
          ref={ref}
          className="relative w-full aspect-[16/9] overflow-hidden cursor-ew-resize select-none"
          onMouseDown={(e) => { dragging.current = true; move(e.clientX); }}
          onMouseMove={(e) => { if (dragging.current) move(e.clientX); }}
          onMouseUp={() => (dragging.current = false)}
          onMouseLeave={() => (dragging.current = false)}
          onTouchStart={(e) => move(e.touches[0].clientX)}
          onTouchMove={(e) => move(e.touches[0].clientX)}
        >
          <img src={excavation} alt="До" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
            <img src={road} alt="После" className="absolute inset-0 h-full w-[100vw] object-cover" loading="lazy" style={{ minWidth: "100%" }} />
          </div>

          <div className="absolute inset-y-0 w-[2px] bg-[var(--orange)] glow-orange" style={{ left: `${pos}%` }}>
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[var(--orange)] grid place-items-center text-asphalt">
              <svg width="20" height="14" viewBox="0 0 20 14"><path d="M0 7l6-6v12zM20 7l-6-6v12z" fill="currentColor"/></svg>
            </div>
          </div>

          <div className="absolute top-6 left-6 px-3 py-1.5 bg-asphalt/80 backdrop-blur text-xs uppercase tracking-widest">До</div>
          <div className="absolute top-6 right-6 px-3 py-1.5 bg-[var(--orange)] text-asphalt text-xs uppercase tracking-widest font-semibold">После</div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-px bg-white/10">
          {[
            { t: "Подготовка основания", d: "Геотекстиль, щебень, виброуплотнение" },
            { t: "Укладка асфальта", d: "Горячая смесь, контроль температуры, ровный слой" },
            { t: "Финиш и разметка", d: "Прикатка, термошвы, нанесение разметки" },
          ].map((b) => (
            <div key={b.t} className="bg-asphalt p-8 hover:bg-graphite transition-colors">
              <div className="font-display text-xl text-[var(--orange)]">{b.t}</div>
              <p className="mt-3 text-sm text-concrete">{b.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
