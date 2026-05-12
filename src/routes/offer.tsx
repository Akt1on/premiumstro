import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useSettings } from "@/lib/use-settings";

export const Route = createFileRoute("/offer")({
  head: () => ({
    meta: [
      { title: "Публичная оферта — Премиум Строй" },
      { name: "description", content: "Публичная оферта на оказание услуг ООО «Премиум Строй»." },
    ],
  }),
  component: OfferPage,
});

function OfferPage() {
  const { data: s } = useSettings();
  const company = s?.company_name ?? "ООО «Премиум Строй»";
  const inn = s?.inn ?? "ИНН _________";
  const ogrn = s?.ogrn ?? "ОГРН _________";

  return (
    <>
      <Header />
      <main className="bg-asphalt text-foreground pt-32 pb-24">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-12">
          <h1 className="font-display text-4xl sm:text-5xl mb-2">Публичная оферта</h1>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-10">
            Действует с {new Date().toLocaleDateString("ru-RU")}
          </p>
          <div className="space-y-6 text-concrete leading-relaxed text-[15px]">
            <p>
              Настоящий документ является официальным предложением (публичной офертой) {company} ({inn}, {ogrn}) (далее — Исполнитель)
              заключить договор на оказание услуг по асфальтированию, благоустройству, разработке котлованов, аренде спецтехники
              и доставке материалов на условиях, изложенных ниже.
            </p>

            <h2 className="font-display text-2xl text-foreground pt-4">1. Предмет договора</h2>
            <p>1.1. Исполнитель оказывает Заказчику услуги, указанные в согласованной сторонами Спецификации/смете, а Заказчик оплачивает их в порядке и сроки, установленные договором.</p>

            <h2 className="font-display text-2xl text-foreground pt-4">2. Порядок заключения</h2>
            <p>2.1. Акцептом настоящей оферты считается оплата выставленного счёта или подписание сторонами Спецификации/договора в письменной форме.</p>

            <h2 className="font-display text-2xl text-foreground pt-4">3. Стоимость и порядок расчётов</h2>
            <p>3.1. Стоимость определяется на основании Спецификации. Оплата осуществляется безналично на расчётный счёт Исполнителя.</p>

            <h2 className="font-display text-2xl text-foreground pt-4">4. Гарантии</h2>
            <p>4.1. Срок гарантии на работы по асфальтированию — до 5 лет, на работы по благоустройству — до 3 лет, в соответствии с условиями договора и ГОСТ.</p>

            <h2 className="font-display text-2xl text-foreground pt-4">5. Ответственность сторон</h2>
            <p>5.1. Стороны несут ответственность в соответствии с действующим законодательством Российской Федерации.</p>

            <h2 className="font-display text-2xl text-foreground pt-4">6. Реквизиты</h2>
            <p>{company} · {inn} · {ogrn} · {s?.legal_address ?? ""}</p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}