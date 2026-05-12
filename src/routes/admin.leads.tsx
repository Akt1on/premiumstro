import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Phone, Mail, Filter } from "lucide-react";
import { toast } from "sonner";

type Lead = {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  service_type: string | null;
  source_page: string | null;
  status: string;
  created_at: string;
};

const STATUSES = ["new", "in_progress", "done", "rejected"] as const;
const STATUS_LABELS: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Закрыта",
  rejected: "Отказ",
};

export const Route = createFileRoute("/admin/leads")({
  component: LeadsAdmin,
});

function LeadsAdmin() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin_leads", filter],
    queryFn: async () => {
      let q = supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(500);
      if (filter !== "all") q = q.eq("status", filter);
      const { data, error } = await q;
      if (error) throw error;
      return data as Lead[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("leads").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_leads"] });
      qc.invalidateQueries({ queryKey: ["admin_count"] });
      toast.success("Статус обновлён");
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_leads"] });
      qc.invalidateQueries({ queryKey: ["admin_count"] });
      toast.success("Удалено");
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl">Заявки</h1>
        <p className="text-sm text-muted-foreground mt-2">Все обращения с сайта</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-widest border transition-colors ${
              filter === s ? "border-[var(--orange)] text-[var(--orange)] bg-[var(--orange)]/10" : "border-white/15 text-muted-foreground hover:border-white/40"
            }`}
          >
            {s === "all" ? "Все" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="grid gap-px bg-white/10">
        {isLoading && <div className="bg-graphite p-6 text-muted-foreground">Загрузка...</div>}
        {!isLoading && !data?.length && <div className="bg-graphite p-6 text-muted-foreground text-center">Заявок нет</div>}
        {data?.map((l) => (
          <div key={l.id} className="bg-graphite p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="font-display text-xl">{l.name}</div>
                  {l.service_type && (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 border border-white/15 text-muted-foreground">
                      {l.service_type}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <a href={`tel:${l.phone.replace(/[^+\d]/g, "")}`} className="inline-flex items-center gap-1.5 text-[var(--orange)] hover:underline">
                    <Phone className="w-3.5 h-3.5" /> {l.phone}
                  </a>
                  {l.source_page && (
                    <span className="text-muted-foreground inline-flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> {l.source_page}
                    </span>
                  )}
                </div>
                {l.message && <p className="mt-3 text-sm text-concrete max-w-2xl">{l.message}</p>}
                <div className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                  {new Date(l.created_at).toLocaleString("ru-RU")}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={l.status}
                  onChange={(e) => updateStatus.mutate({ id: l.id, status: e.target.value })}
                  className="bg-asphalt border border-white/15 text-xs uppercase tracking-widest px-3 h-9 outline-none focus:border-[var(--orange)]"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
                <button
                  onClick={() => { if (confirm("Удалить заявку?")) remove.mutate(l.id); }}
                  className="w-9 h-9 grid place-items-center border border-white/15 hover:border-destructive hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}