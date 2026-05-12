import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";

type Service = {
  id: string;
  slug: string;
  title: string;
  short_desc: string | null;
  full_content: string | null;
  tags: string[] | null;
  sort_order: number;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  image_url: string | null;
  icon: string | null;
};

export const Route = createFileRoute("/admin/services")({
  component: ServicesAdmin,
});

function ServicesAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Service> | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin_services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw error;
      return data as Service[];
    },
  });

  const save = useMutation({
    mutationFn: async (s: Partial<Service>) => {
      const payload = {
        slug: s.slug!.trim(),
        title: s.title!.trim(),
        short_desc: s.short_desc ?? null,
        full_content: s.full_content ?? null,
        tags: s.tags ?? [],
        sort_order: Number(s.sort_order ?? 0),
        published: !!s.published,
        seo_title: s.seo_title ?? null,
        seo_description: s.seo_description ?? null,
        image_url: s.image_url ?? null,
        icon: s.icon ?? null,
      };
      if (s.id) {
        const { error } = await supabase.from("services").update(payload).eq("id", s.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("services").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_services"] });
      qc.invalidateQueries({ queryKey: ["services_public"] });
      toast.success("Сохранено");
      setEditing(null);
    },
    onError: (e: any) => toast.error(e?.message ?? "Ошибка сохранения"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_services"] });
      qc.invalidateQueries({ queryKey: ["services_public"] });
      toast.success("Удалено");
    },
    onError: (e: any) => toast.error(e?.message ?? "Ошибка удаления"),
  });

  const togglePublish = useMutation({
    mutationFn: async (s: Service) => {
      const { error } = await supabase.from("services").update({ published: !s.published }).eq("id", s.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_services"] });
      qc.invalidateQueries({ queryKey: ["services_public"] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">Услуги</h1>
          <p className="text-sm text-muted-foreground mt-2">Управление каталогом услуг</p>
        </div>
        <button
          onClick={() => setEditing({ published: true, sort_order: (data?.length ?? 0) + 1, tags: [] })}
          className="inline-flex items-center gap-2 px-4 h-11 bg-[var(--orange)] text-asphalt text-sm font-semibold uppercase tracking-wider hover:bg-[var(--orange-glow)] transition-colors"
        >
          <Plus className="w-4 h-4" /> Новая услуга
        </button>
      </div>

      <div className="bg-graphite border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-white/10">
                <th className="text-left p-4">№</th>
                <th className="text-left p-4">Название</th>
                <th className="text-left p-4 hidden md:table-cell">Slug</th>
                <th className="text-left p-4 hidden lg:table-cell">Краткое описание</th>
                <th className="text-left p-4">Статус</th>
                <th className="text-right p-4">Действия</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Загрузка...</td></tr>}
              {data?.map((s) => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 font-display text-[var(--orange)]">{String(s.sort_order).padStart(2, "0")}</td>
                  <td className="p-4 font-medium">{s.title}</td>
                  <td className="p-4 hidden md:table-cell text-muted-foreground">{s.slug}</td>
                  <td className="p-4 hidden lg:table-cell text-muted-foreground max-w-md truncate">{s.short_desc}</td>
                  <td className="p-4">
                    <button
                      onClick={() => togglePublish.mutate(s)}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-widest border ${
                        s.published ? "border-[var(--orange)]/40 text-[var(--orange)]" : "border-white/15 text-muted-foreground"
                      }`}
                    >
                      {s.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {s.published ? "Активна" : "Скрыта"}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(s)} className="w-8 h-8 grid place-items-center border border-white/15 hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => { if (confirm(`Удалить «${s.title}»?`)) remove.mutate(s.id); }}
                        className="w-8 h-8 grid place-items-center border border-white/15 hover:border-destructive hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && !data?.length && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Услуг пока нет</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {editing && <ServiceModal value={editing} onClose={() => setEditing(null)} onSave={(v) => save.mutate(v)} busy={save.isPending} />}
    </div>
  );
}

function ServiceModal({ value, onClose, onSave, busy }: { value: Partial<Service>; onClose: () => void; onSave: (v: Partial<Service>) => void; busy: boolean }) {
  const [v, setV] = useState<Partial<Service>>(value);
  const tagsStr = (v.tags ?? []).join(", ");

  function set<K extends keyof Service>(k: K, val: Service[K] | null) {
    setV((p) => ({ ...p, [k]: val }));
  }

  return (
    <div className="fixed inset-0 z-50 bg-asphalt/80 backdrop-blur grid place-items-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-graphite border border-white/10 w-full max-w-3xl my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-graphite z-10">
          <h2 className="font-display text-xl">{v.id ? "Редактировать услугу" : "Новая услуга"}</h2>
          <button onClick={onClose} className="w-9 h-9 grid place-items-center hover:text-[var(--orange)]"><X className="w-4 h-4" /></button>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); onSave(v); }}
          className="p-5 sm:p-6 space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Название" required>
              <input value={v.title ?? ""} onChange={(e) => set("title", e.target.value)} required maxLength={120} className="adm-input" />
            </Field>
            <Field label="Slug (URL)" required>
              <input value={v.slug ?? ""} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} required maxLength={80} className="adm-input" placeholder="asfaltirovanie" />
            </Field>
          </div>
          <Field label="Краткое описание">
            <textarea value={v.short_desc ?? ""} onChange={(e) => set("short_desc", e.target.value)} rows={2} maxLength={300} className="adm-input resize-none" />
          </Field>
          <Field label="Полный текст">
            <textarea value={v.full_content ?? ""} onChange={(e) => set("full_content", e.target.value)} rows={6} maxLength={5000} className="adm-input resize-none" />
          </Field>
          <Field label="Теги (через запятую)">
            <input
              defaultValue={tagsStr}
              onBlur={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean) as any)}
              className="adm-input"
              placeholder="ГОСТ, гарантия 5 лет, под ключ"
            />
          </Field>
          <Field label="URL изображения">
            <input value={v.image_url ?? ""} onChange={(e) => set("image_url", e.target.value)} className="adm-input" placeholder="https://..." />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Сортировка">
              <input type="number" value={v.sort_order ?? 0} onChange={(e) => set("sort_order", Number(e.target.value) as any)} className="adm-input" />
            </Field>
            <Field label="Иконка (lucide name)">
              <input value={v.icon ?? ""} onChange={(e) => set("icon", e.target.value)} className="adm-input" placeholder="hammer" />
            </Field>
          </div>

          <div className="border-t border-white/10 pt-5">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--orange)] mb-3">SEO</div>
            <Field label="SEO Title">
              <input value={v.seo_title ?? ""} onChange={(e) => set("seo_title", e.target.value)} maxLength={70} className="adm-input" />
            </Field>
            <div className="mt-4">
              <Field label="SEO Description">
                <textarea value={v.seo_description ?? ""} onChange={(e) => set("seo_description", e.target.value)} rows={2} maxLength={200} className="adm-input resize-none" />
              </Field>
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={!!v.published} onChange={(e) => set("published", e.target.checked as any)} className="w-4 h-4 accent-[var(--orange)]" />
            Опубликовано
          </label>

          <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
            <button type="button" onClick={onClose} className="px-5 h-11 border border-white/15 text-sm uppercase tracking-wider hover:border-white/40">Отмена</button>
            <button type="submit" disabled={busy} className="px-6 h-11 bg-[var(--orange)] text-asphalt text-sm font-semibold uppercase tracking-wider hover:bg-[var(--orange-glow)] disabled:opacity-60">
              {busy ? "..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}{required && <span className="text-[var(--orange)]"> *</span>}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}