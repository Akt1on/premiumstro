import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";
import { Contact } from "@/components/site/Contact";
import { MapPin } from "lucide-react";

const CITIES = [
  "Красногорск", "Москва", "Истра", "Дедовск", "Нахабино", "Павшинская Пойма",
  "Митино", "Опалиха", "Снегири", "Новопетровское", "Звенигород", "Одинцово",
  "Химки", "Долгопрудный", "Зеленоград", "Лобня", "Тушино", "Строгино",
];

export const Route = createFileRoute("/geography")({
  head: () => ({
    meta: [
      { title: "География работ — Красногорск, Москва и МО · Премиум Строй" },
      { name: "description", content: "ООО «Премиум Строй» работает в Красногорске, Москве и Московской области: Истра, Нахабино, Дедовск, Митино, Одинцово, Химки и другие города." },
      { property: "og:title", content: "География работ · Премиум Строй" },
      { property: "og:description", content: "Работаем по всей Московской области с базой в Красногорске." },
    ],
  }),
  component: GeographyPage,
});

function GeographyPage() {
  return (
    <>
      <Header />
      <main className="bg-asphalt text-foreground pt-32 pb-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--orange)]"></span>
            <span className="text-xs uppercase tracking-[0.4em] text-[var(--orange)]">География</span>
          </div>
          <h1 className="font-display leading-[0.9] max-w-5xl" style={{ fontSize: "clamp(2.2rem, 7vw, 6rem)" }}>
            КРАСНОГОРСК · <span className="text-[var(--orange)]">МОСКВА · МО</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-concrete">
            База в Красногорске. Выезжаем по всей Московской области в течение часа. Работаем круглосуточно, без выходных.
          </p>

          <div className="mt-16 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-white/10">
            {CITIES.map((c) => (
              <div key={c} className="bg-graphite p-6 hover:bg-asphalt transition-colors group">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--orange)]" />
                  <span className="font-display text-lg group-hover:text-[var(--orange)] transition-colors">{c}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-px bg-white/10">
            {[
              { t: "Время выезда", v: "до 60 мин по МО" },
              { t: "Логистика", v: "Собственный автопарк" },
              { t: "Покрытие", v: "100% Московской области" },
            ].map((c) => (
              <div key={c.t} className="bg-graphite p-8">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.t}</div>
                <div className="font-display text-2xl mt-3 text-[var(--orange)]">{c.v}</div>
              </div>
            ))}
          </div>
        </div>
        <Contact />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}