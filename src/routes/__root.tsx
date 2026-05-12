import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-[var(--orange)]">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Страница не найдена</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Запрашиваемая страница не существует или была перемещена.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center px-5 h-11 bg-[var(--orange)] text-asphalt text-sm font-semibold uppercase tracking-wider">
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Что-то пошло не так</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex items-center justify-center px-5 h-11 bg-[var(--orange)] text-asphalt text-sm font-semibold uppercase tracking-wider"
        >
          Повторить
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ПРЕМИУМ СТРОЙ — Асфальтирование и благоустройство" },
      { name: "description", content: "Премиум асфальтирование, благоустройство, разработка котлованов, аренда спецтехники и доставка материалов. Собственный парк, инженерный подход." },
      { name: "author", content: "Премиум Строй" },
      { property: "og:title", content: "ПРЕМИУМ СТРОЙ — Асфальтирование и благоустройство" },
      { property: "og:description", content: "Инженерный подход. Собственная техника. Работаем по всей области." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ru_RU" },
      { property: "og:site_name", content: "Премиум Строй" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0D0D0D" },
      { name: "format-detection", content: "telephone=no" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" },
      { rel: "canonical", href: "https://premiumstroe.ru/" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "ООО «Премиум Строй»",
              url: "https://premiumstroe.ru",
              telephone: "+7 (800) 000-00-00",
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Красногорск",
                addressRegion: "Московская область",
                addressCountry: "RU",
              },
              areaServed: ["Красногорск", "Москва", "Московская область"],
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster theme="dark" position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}
