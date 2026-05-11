export function Footer() {
  return (
    <footer className="relative bg-asphalt border-t border-white/10">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-16">
        <div className="font-display text-[14vw] md:text-[10vw] leading-none text-stroke select-none">
          ПРЕМИУМ СТРОЙ
        </div>
        <div className="mt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-xs uppercase tracking-widest text-muted-foreground">
          <div>© {new Date().getFullYear()} Премиум Строй · premiumstroe.ru</div>
          <div className="flex gap-8">
            <a href="#services" className="hover:text-[var(--orange)] transition-colors">Услуги</a>
            <a href="#machinery" className="hover:text-[var(--orange)] transition-colors">Техника</a>
            <a href="#projects" className="hover:text-[var(--orange)] transition-colors">Проекты</a>
            <a href="#contact" className="hover:text-[var(--orange)] transition-colors">Контакты</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
