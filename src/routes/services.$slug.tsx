import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";
import { Contact } from "@/components/site/Contact";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Check } from "lucide-react";

async function fetchService(slug: string) {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    return await fetchService(params.slug);
  },
  head: ({ loaderData }) => {
    const s: any = loaderData;
    const title = s?.seo_title || (s ? `${s.title} в Красногорске и Москве — Премиум Строй` : "Услуга — Премиум Строй");
    const desc = s?.seo_description || s?.short_desc || "Услуги ООО «Премиум Строй» в Красногорске, Москве и МО.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: ServicePage,
});

function ServicePage() {
  const { slug } = Route.useParams();
  const { data: service, isLoading } = useQuery({
    queryKey: ["service", slug],
    queryFn: () => fetchService(slug),
  });

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-32 px-6 text-concrete">Загрузка...</main>
      </>
    );
  }

  if (!service) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-40 px-6 text-center">
          <h1 className="font-display text-5xl">Услуга не найдена</h1>
          <Link to="/services" className="inline-block mt-6 text-[var(--orange)] underline">
            ← Все услуги
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-asphalt text-foreground">
        <article className="pt-32 pb-20">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
            <Link to="/services" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-[var(--orange)] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Все услуги
            </Link>

            <div className="mt-10 grid lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[var(--orange)]"></span>
                  <span className="text-xs uppercase tracking-[0.4em] text-[var(--orange)]">Услуга 0{service.sort_order}</span>
                </div>
                <h1 className="font-display text-[12vw] sm:text-[7vw] lg:text-[5.5vw] leading-[0.9]">
                  {service.title}
                </h1>
                <p className="mt-6 text-base sm:text-lg text-concrete max-w-2xl">{service.short_desc}</p>
              </div>
              <div className="lg:col-span-4">
                <div className="bg-graphite p-6 sticky top-28">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--orange)] mb-4">Включено</div>
                  <ul className="space-y-3">
                    {(service.tags ?? []).map((t) => (
                      <li key={t} className="flex items-start gap-3 text-sm">
                        <Check className="w-4 h-4 text-[var(--orange)] mt-0.5 shrink-0" />
                        <span className="text-concrete">{t}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#contact" className="mt-6 block text-center px-5 h-12 leading-[3rem] bg-[var(--orange)] text-asphalt font-semibold uppercase tracking-wider text-sm">
                    Получить расчёт
                  </a>
                </div>
              </div>
            </div>

            {service.full_content && (
              <div className="mt-16 max-w-3xl text-base leading-relaxed text-concrete whitespace-pre-line">
                {service.full_content}
              </div>
            )}

            <div className="mt-16 grid sm:grid-cols-3 gap-px bg-white/10">
              {[
                { t: "Геогр.", v: "Красногорск, Москва, МО" },
                { t: "Гарантия", v: "По договору, до 5 лет" },
                { t: "Документы", v: "Договор, акты, ГОСТ" },
              ].map((c) => (
                <div key={c.t} className="bg-graphite p-6">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.t}</div>
                  <div className="font-display text-lg mt-2">{c.v}</div>
                </div>
              ))}
            </div>
          </div>
        </article>
        <Contact />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}