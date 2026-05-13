import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Phone } from "lucide-react";
import { useSettings, useServices } from "@/lib/use-settings";

const navLinks = [
  { to: "/", label: "Главная" },
  { to: "/services", label: "Услуги" },
  { to: "/about", label: "О компании" },
  { to: "/geography", label: "География" },
  { to: "/contact", label: "Контакты" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: settings } = useSettings();
  const { data: services } = useServices();
  const phone = settings?.phone ?? "+7 (800) 000-00-00";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-asphalt/95 border-b border-white/10" : ""
      } ${
        open ? "bg-asphalt border-b border-white/10" : ""
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12 h-16 sm:h-20 flex items-center justify-between gap-4">
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2 sm:gap-3 group min-w-0">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 grid place-items-center bg-gradient-to-br from-[var(--orange)] to-[var(--orange-glow)] rounded-sm shrink-0">
            <span className="font-display text-lg sm:text-xl text-asphalt">П</span>
            <div className="absolute inset-0 rounded-sm blur-md bg-[var(--orange)] opacity-40 group-hover:opacity-80 transition-opacity"></div>
          </div>
          <div className="leading-none min-w-0">
            <div className="font-display text-base sm:text-lg tracking-wider truncate">ПРЕМИУМ СТРОЙ</div>
            <div className="hidden sm:block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1">
              Красногорск · Москва · МО
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 xl:gap-10">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="text-sm uppercase tracking-[0.18em] text-concrete hover:text-[var(--orange)] transition-colors relative group [&[data-status=active]]:text-[var(--orange)]"
            >
              {l.label}
              <span className="absolute -bottom-2 left-0 w-0 h-px bg-[var(--orange)] group-hover:w-full transition-all duration-500 group-data-[status=active]:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={`tel:${phone.replace(/[^+\d]/g, "")}`}
            className="hidden md:inline-flex items-center gap-2 text-sm tracking-wider text-concrete hover:text-[var(--orange)] transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden xl:inline">{phone}</span>
          </a>
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center gap-2 px-4 sm:px-5 h-10 sm:h-11 bg-[var(--orange)] text-asphalt font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-[var(--orange-glow)] transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-asphalt animate-pulse"></span>
            Заявка
          </Link>
          <button
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden w-10 h-10 grid place-items-center border border-white/15 hover:border-[var(--orange)] transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        style={{ backgroundColor: "#0d0d0d" }}
        className={`lg:hidden fixed inset-x-0 top-16 sm:top-20 bottom-0 border-t border-white/10 transition-opacity duration-300 text-foreground z-40 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="overflow-y-auto h-full px-6 py-5 grid-lines pb-10 flex flex-col">
          <nav className="flex flex-col">
            {navLinks.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: l.to === "/" }}
                className="font-display text-xl py-2.5 border-b border-white/10 text-white hover:text-[var(--orange)] transition-colors [&[data-status=active]]:text-[var(--orange)]"
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          {!!services?.length && (
            <div className="mt-4">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--orange)] mb-2">Услуги</div>
              <div className="flex flex-col">
                {services.map((s) => (
                  <Link
                    key={s.id}
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    onClick={() => setOpen(false)}
                    className="text-[11px] uppercase tracking-wider text-concrete hover:text-[var(--orange)] transition-colors py-1"
                  >
                    → {s.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4 pt-3 border-t border-white/10">
            <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="font-display text-lg text-[var(--orange)]">
              {phone}
            </a>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
              {settings?.working_hours ?? "24 / 7"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
