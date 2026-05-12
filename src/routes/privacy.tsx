import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useSettings } from "@/lib/use-settings";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Политика конфиденциальности — Премиум Строй" },
      { name: "description", content: "Политика обработки персональных данных ООО «Премиум Строй» в соответствии с 152-ФЗ." },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { data: s } = useSettings();
  const company = s?.company_name ?? "ООО «Премиум Строй»";
  const email = s?.email ?? "info@premiumstroe.ru";
  return (
    <>
      <Header />
      <main className="bg-asphalt text-foreground pt-32 pb-24">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-12 prose-content">
          <h1 className="font-display text-4xl sm:text-5xl mb-2">Политика конфиденциальности</h1>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-10">
            Редакция от {new Date().toLocaleDateString("ru-RU")}
          </p>

          <div className="space-y-6 text-concrete leading-relaxed text-[15px]">
            <p>
              Настоящая Политика разработана в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ
              «О персональных данных» и определяет порядок обработки персональных данных
              {" "}и меры по обеспечению безопасности персональных данных, предпринимаемые {company} (далее — Оператор).
            </p>

            <h2 className="font-display text-2xl text-foreground pt-4">1. Общие положения</h2>
            <p>1.1. Оператор ставит своей важнейшей целью соблюдение прав и свобод человека при обработке персональных данных, в том числе защиты прав на неприкосновенность частной жизни, личную и семейную тайну.</p>
            <p>1.2. Настоящая Политика применяется ко всей информации, которую Оператор может получить о посетителях сайта premiumstroe.ru.</p>

            <h2 className="font-display text-2xl text-foreground pt-4">2. Состав персональных данных</h2>
            <p>Оператор обрабатывает следующие категории персональных данных: фамилия, имя; контактный телефон; адрес электронной почты; сообщение пользователя; cookie-файлы и данные об использовании сайта.</p>

            <h2 className="font-display text-2xl text-foreground pt-4">3. Цели обработки</h2>
            <p>Обработка персональных данных осуществляется для: связи с пользователем для ответа на заявку и уточнения деталей; подготовки коммерческого предложения; заключения договора; информирования об услугах.</p>

            <h2 className="font-display text-2xl text-foreground pt-4">4. Правовые основания</h2>
            <p>Обработка осуществляется на основании ст. 6 152-ФЗ — согласия субъекта персональных данных, выраженного посредством отметки чекбокса согласия при отправке формы.</p>

            <h2 className="font-display text-2xl text-foreground pt-4">5. Передача и хранение</h2>
            <p>Персональные данные не передаются третьим лицам, за исключением случаев, прямо предусмотренных законодательством. Хранение осуществляется на серверах с использованием защищённых каналов связи.</p>

            <h2 className="font-display text-2xl text-foreground pt-4">6. Права субъекта</h2>
            <p>Пользователь вправе получать информацию о составе данных, требовать уточнения, блокирования или уничтожения, отозвать согласие, направив запрос на {email}.</p>

            <h2 className="font-display text-2xl text-foreground pt-4">7. Cookie</h2>
            <p>Сайт использует cookie для улучшения работы. Продолжая использование сайта, вы соглашаетесь с применением cookie. Вы можете отключить их в настройках браузера.</p>

            <h2 className="font-display text-2xl text-foreground pt-4">8. Контакты</h2>
            <p>{company}, email: {email}</p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}