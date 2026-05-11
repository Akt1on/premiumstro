import { Link } from "@tanstack/react-router";
import { useSettings, useServices } from "@/lib/use-settings";

export function Footer() {
  const { data: s } = useSettings();
  const { data: services } = useServices();
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-asphalt border-t border-white/10">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12 pt-14 pb-8">
        <div className="font-display text-[14vw] md:text-[10vw] leading-none text-stroke select-none">
          ПРЕМИУМ СТРОЙ
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--orange)] mb-3">Контакты</div>
            <a href={`tel:${(s?.phone ?? "").replace(/[^+\d]/g, "")}`} className="block font-display text-xl hover:text-[var(--orange)] transition-colors">
              {s?.phone ?? "+7 (800) 000-00-00"}
            </a>
            <a href={`mailto:${s?.email ?? ""}`} className="block text-sm text-concrete mt-2 hover:text-[var(--orange)] transition-colors">
              {s?.email ?? "info@premiumstroe.ru"}
            </a>
            <p className="text-sm text-concrete mt-3">{s?.address ?? "г. Красногорск, МО"}</p>
            <p className="text-xs text-muted-foreground mt-1">{s?.working_hours ?? "24 / 7"}</p>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--orange)] mb-3">Услуги</div>
            <ul className="space-y-2">
              {(services ?? []).slice(0, 6).map((sv) => (
                <li key={sv.id}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: sv.slug }}
                    className="text-sm text-concrete hover:text-[var(--orange)] transition-colors"
                  >
                    {sv.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--orange)] mb-3">Компания</div>
            <ul className="space-y-2 text-sm text-concrete">
              <li><Link to="/about" className="hover:text-[var(--orange)]">О компании</Link></li>
              <li><Link to="/geography" className="hover:text-[var(--orange)]">География работ</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--orange)]">Контакты</Link></li>
              <li><Link to="/privacy" className="hover:text-[var(--orange)]">Политика конфиденциальности</Link></li>
              <li><Link to="/offer" className="hover:text-[var(--orange)]">Публичная оферта</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--orange)] mb-3">Реквизиты</div>
            <ul className="space-y-1 text-xs text-muted-foreground leading-relaxed">
              <li className="text-concrete">{s?.company_name ?? "ООО «Премиум Строй»"}</li>
              <li>{s?.inn}</li>
              <li>{s?.ogrn}</li>
              <li>{s?.kpp}</li>
              <li>{s?.legal_address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs uppercase tracking-widest text-muted-foreground">
          <div>© {year} {s?.company_name ?? "ООО «Премиум Строй»"} · premiumstroe.ru</div>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-[var(--orange)] transition-colors">Политика</Link>
            <Link to="/offer" className="hover:text-[var(--orange)] transition-colors">Оферта</Link>
            <Link to="/admin" className="hover:text-[var(--orange)] transition-colors">Админ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
