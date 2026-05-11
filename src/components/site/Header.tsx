import { useEffect, useState } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#services", label: "Услуги" },
    { href: "#machinery", label: "Техника" },
    { href: "#projects", label: "Проекты" },
    { href: "#process", label: "Процесс" },
    { href: "#contact", label: "Контакты" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl bg-asphalt/70 border-b border-white/5" : ""
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 h-20 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 grid place-items-center bg-gradient-to-br from-[var(--orange)] to-[var(--orange-glow)] rounded-sm">
            <span className="font-display text-xl text-asphalt">П</span>
            <div className="absolute inset-0 rounded-sm blur-md bg-[var(--orange)] opacity-40 group-hover:opacity-80 transition-opacity"></div>
          </div>
          <div className="leading-none">
            <div className="font-display text-lg tracking-wider">ПРЕМИУМ СТРОЙ</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1">
              premiumstroe.ru
            </div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm uppercase tracking-[0.18em] text-concrete hover:text-[var(--orange)] transition-colors relative group"
            >
              {l.label}
              <span className="absolute -bottom-2 left-0 w-0 h-px bg-[var(--orange)] group-hover:w-full transition-all duration-500"></span>
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-2 px-5 h-11 bg-[var(--orange)] text-asphalt font-semibold text-sm uppercase tracking-wider hover:bg-[var(--orange-glow)] transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-asphalt animate-pulse"></span>
          Связаться
        </a>
      </div>
    </header>
  );
}
