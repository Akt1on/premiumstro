import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: () => {
    const { data: leads } = useQuery({
      queryKey: ["admin_leads_count"],
      queryFn: async () => (await supabase.from("leads").select("id", { count: "exact", head: true })).count ?? 0,
    });
    const { data: services } = useQuery({
      queryKey: ["admin_services_count"],
      queryFn: async () => (await supabase.from("services").select("id", { count: "exact", head: true })).count ?? 0,
    });
    const cards = [
      { t: "Заявки", v: leads ?? "—", to: "/admin/leads" },
      { t: "Услуги", v: services ?? "—", to: "/admin/services" },
      { t: "Настройки сайта", v: "→", to: "/admin/settings" },
    ];
    return (
      <div>
        <h1 className="font-display text-4xl mb-8">Дашборд</h1>
        <div className="grid sm:grid-cols-3 gap-px bg-white/10">
          {cards.map((c) => (
            <Link key={c.t} to={c.to as any} className="bg-graphite p-8 hover:bg-asphalt transition-colors">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.t}</div>
              <div className="font-display text-4xl mt-3 text-[var(--orange)]">{c.v}</div>
            </Link>
          ))}
        </div>
      </div>
    );
  },
});