import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "О компании ООО «Премиум Строй» — Красногорск, Москва, МО" },
      { name: "description", content: "ООО «Премиум Строй» — премиальная инжиниринговая компания: асфальтирование, благоустройство, дорожное строительство в Красногорске, Москве и Московской области с 2014 года." },
      { property: "og:title", content: "О компании · Премиум Строй" },
      { property: "og:description", content: "Инженерный подход, собственный парк техники, работаем по Москве и МО." },
    ],
  }),
  component: () => (
    <>
      <Header />
      <main className="bg-asphalt text-foreground pt-20">
        <About />
        <Contact />
      </main>
      <Footer />
      <CookieBanner />
    </>
  ),
});