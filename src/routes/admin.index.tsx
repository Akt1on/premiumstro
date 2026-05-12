import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Inbox, Wrench, Building2, Settings, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function useCount(table: "leads" | "services" | "projects", filter?: { col: string; val: any }) {
  return useQuery({
    queryKey: ["admin_count", table, filter],
    queryFn: async () => {
      let q = supabase.from(table).select("id", { count: "exact", head: true });
      if (filter) q = q.eq(filter.col, filter.val);
      const { count } = await q;
      return count ?? 0;
    },
  });
}

function AdminDashboard() {
  const leads = useCount("leads");
  const newLeads = useCount("leads", { col: "status", val: "new" });
  const services = useCount("services");
  const projects = useCount("projects");

  const stats = [
    { t: "Всего заявок", v: leads.data ?? "—", to: "/admin/leads", icon: Inbox, accent: false },
    { t: "Новые", v: newLeads.data ?? "—", to: "/admin/leads", icon: Inbox, accent: true },
    { t: "Услуги", v: services.data ?? "—", to: "/admin/services", icon: Wrench, accent: false },
    { t: "Проекты", v: projects.data ?? "—", to: "/admin/projects", icon: Building2, accent: false },
  ] as const;

  const shortcuts = [
    { t: "Услуги", d: "Создать, изменить или скрыть услугу", to: "/admin/services", icon: Wrench },
    { t: "Проекты", d: "Управление портфолио и кейсами", to: "/admin/projects", icon: Building2 },
    { t: "Заявки", d: "Обработка заявок с сайта", to: "/admin/leads", icon: Inbox },
    { t: "Настройки", d: "Контакты, реквизиты, тексты", to: "/admin/settings", icon: Settings },
  ] as const;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl">Дашборд</h1>
        <p className="text-sm text-muted-foreground mt-2">Сводка по сайту в реальном времени</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.t} to={s.to} className="bg-graphite p-5 sm:p-7 hover:bg-asphalt transition-colors group">
              <div className="flex items-start justify-between">
                <Icon className={`w-5 h-5 ${s.accent ? "text-[var(--orange)]" : "text-muted-foreground"}`} />
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-[var(--orange)] transition-colors" />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-6">{s.t}</div>
              <div className={`font-display text-3xl sm:text-4xl mt-1 ${s.accent ? "text-[var(--orange)]" : ""}`}>{s.v}</div>
            </Link>
          );
        })}
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--orange)] mb-4">Разделы</div>
        <div className="grid sm:grid-cols-2 gap-px bg-white/10">
          {shortcuts.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.t} to={s.to} className="bg-graphite p-6 hover:bg-asphalt transition-colors flex items-start gap-4 group">
                <div className="w-10 h-10 grid place-items-center bg-white/5 group-hover:bg-[var(--orange)]/15 transition-colors">
                  <Icon className="w-5 h-5 group-hover:text-[var(--orange)] transition-colors" />
                </div>
                <div className="min-w-0">
                  <div className="font-display text-xl group-hover:text-[var(--orange)] transition-colors">{s.t}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.d}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}