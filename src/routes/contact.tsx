import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";
import { Contact } from "@/components/site/Contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Контакты — ООО «Премиум Строй» · Красногорск, Москва, МО" },
      { name: "description", content: "Свяжитесь с ООО «Премиум Строй»: телефон, email, адрес. Расчёт стоимости в течение 30 минут. Работаем по Красногорску, Москве и МО круглосуточно." },
      { property: "og:title", content: "Контакты · Премиум Строй" },
      { property: "og:description", content: "Телефон, email, адрес офиса. Расчёт за 30 минут." },
    ],
  }),
  component: () => (
    <>
      <Header />
      <main className="bg-asphalt text-foreground pt-20">
        <Contact />
      </main>
      <Footer />
      <CookieBanner />
    </>
  ),
});