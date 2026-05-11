import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";
import { useServices } from "@/lib/use-settings";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Услуги — Асфальтирование, благоустройство, спецтехника · Премиум Строй" },
      { name: "description", content: "Полный спектр услуг ООО «Премиум Строй»: асфальтирование, благоустройство, разработка котлованов, аренда спецтехники, доставка материалов, дорожное строительство в Красногорске, Москве и МО." },
      { property: "og:title", content: "Услуги · Премиум Строй" },
      { property: "og:description", content: "Асфальтирование, благоустройство, спецтехника и материалы по Москве и МО." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services, isLoading } = useServices();
  return (
    <>
      <Header />
      <main className="bg-asphalt text-foreground min-h-screen pt-32 pb-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--orange)]"></span>
            <span className="text-xs uppercase tracking-[0.4em] text-[var(--orange)]">Все услуги</span>
          </div>
          <h1 className="font-display text-[12vw] sm:text-[8vw] md:text-[6vw] leading-[0.9] max-w-5xl">
            ПОЛНЫЙ СПЕКТР <span className="text-[var(--orange)]">УСЛУГ</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-concrete">
            ООО «Премиум Строй» — инжиниринговая компания полного цикла. Работаем по Красногорску, Москве и Московской области.
          </p>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {isLoading && <div className="bg-graphite p-10 text-concrete">Загрузка...</div>}
            {(services ?? []).map((s) => (
              <Link
                key={s.id}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group bg-graphite p-8 lg:p-10 hover:bg-asphalt transition-colors relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="font-display text-xs text-[var(--orange)]">
                    0{s.sort_order}
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-[var(--orange)] group-hover:rotate-45 transition-all duration-500" />
                </div>
                <h2 className="font-display text-2xl lg:text-3xl mt-6 group-hover:text-[var(--orange)] transition-colors">
                  {s.title}
                </h2>
                <p className="mt-3 text-sm text-concrete">{s.short_desc}</p>
                {!!s.tags?.length && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {s.tags.slice(0, 4).map((t) => (
                      <span key={t} className="text-[10px] uppercase tracking-wider px-2 py-1 border border-white/10 text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}