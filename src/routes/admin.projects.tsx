import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";

type Project = {
  id: string;
  title: string;
  location: string | null;
  description: string | null;
  image_url: string | null;
  year: number | null;
  sort_order: number;
  published: boolean;
};

export const Route = createFileRoute("/admin/projects")({
  component: ProjectsAdmin,
});

function ProjectsAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Project> | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin_projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order");
      if (error) throw error;
      return data as Project[];
    },
  });

  const save = useMutation({
    mutationFn: async (p: Partial<Project>) => {
      const payload = {
        title: p.title!.trim(),
        location: p.location ?? null,
        description: p.description ?? null,
        image_url: p.image_url ?? null,
        year: p.year ?? null,
        sort_order: Number(p.sort_order ?? 0),
        published: !!p.published,
      };
      if (p.id) {
        const { error } = await supabase.from("projects").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_projects"] });
      toast.success("Сохранено");
      setEditing(null);
    },
    onError: (e: any) => toast.error(e?.message ?? "Ошибка"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin_projects"] }); toast.success("Удалено"); },
  });

  const togglePublish = useMutation({
    mutationFn: async (p: Project) => {
      const { error } = await supabase.from("projects").update({ published: !p.published }).eq("id", p.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_projects"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">Проекты</h1>
          <p className="text-sm text-muted-foreground mt-2">Портфолио и кейсы</p>
        </div>
        <button
          onClick={() => setEditing({ published: true, sort_order: (data?.length ?? 0) + 1 })}
          className="inline-flex items-center gap-2 px-4 h-11 bg-[var(--orange)] text-asphalt text-sm font-semibold uppercase tracking-wider hover:bg-[var(--orange-glow)] transition-colors"
        >
          <Plus className="w-4 h-4" /> Новый проект
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
        {isLoading && <div className="bg-graphite p-6 text-muted-foreground">Загрузка...</div>}
        {!isLoading && !data?.length && <div className="bg-graphite p-6 text-muted-foreground text-center sm:col-span-2 lg:col-span-3">Проектов пока нет</div>}
        {data?.map((p) => (
          <div key={p.id} className="bg-graphite group">
            {p.image_url ? (
              <div className="aspect-video bg-asphalt overflow-hidden">
                <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-video grid place-items-center bg-asphalt text-muted-foreground text-xs uppercase tracking-widest">Нет фото</div>
            )}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-display text-lg truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{p.location ?? ""}{p.year ? ` · ${p.year}` : ""}</div>
                </div>
                <button
                  onClick={() => togglePublish.mutate(p)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-widest border ${
                    p.published ? "border-[var(--orange)]/40 text-[var(--orange)]" : "border-white/15 text-muted-foreground"
                  }`}
                >
                  {p.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
              </div>
              {p.description && <p className="mt-3 text-sm text-concrete line-clamp-2">{p.description}</p>}
              <div className="mt-4 flex gap-2">
                <button onClick={() => setEditing(p)} className="flex-1 h-9 border border-white/15 text-xs uppercase tracking-wider hover:border-[var(--orange)] hover:text-[var(--orange)] inline-flex items-center justify-center gap-1.5">
                  <Pencil className="w-3 h-3" /> Изменить
                </button>
                <button
                  onClick={() => { if (confirm(`Удалить «${p.title}»?`)) remove.mutate(p.id); }}
                  className="w-9 h-9 grid place-items-center border border-white/15 hover:border-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && <ProjectModal value={editing} onClose={() => setEditing(null)} onSave={(v) => save.mutate(v)} busy={save.isPending} />}
    </div>
  );
}

function ProjectModal({ value, onClose, onSave, busy }: { value: Partial<Project>; onClose: () => void; onSave: (v: Partial<Project>) => void; busy: boolean }) {
  const [v, setV] = useState<Partial<Project>>(value);
  function set<K extends keyof Project>(k: K, val: Project[K] | null) { setV((p) => ({ ...p, [k]: val })); }
  return (
    <div className="fixed inset-0 z-50 bg-asphalt/80 backdrop-blur grid place-items-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-graphite border border-white/10 w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-graphite z-10">
          <h2 className="font-display text-xl">{v.id ? "Редактировать проект" : "Новый проект"}</h2>
          <button onClick={onClose} className="w-9 h-9 grid place-items-center hover:text-[var(--orange)]"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(v); }} className="p-5 sm:p-6 space-y-5">
          <Field label="Название" required>
            <input value={v.title ?? ""} onChange={(e) => set("title", e.target.value)} required maxLength={120} className="adm-input" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Локация">
              <input value={v.location ?? ""} onChange={(e) => set("location", e.target.value)} className="adm-input" placeholder="Красногорск" />
            </Field>
            <Field label="Год">
              <input type="number" value={v.year ?? ""} onChange={(e) => set("year", e.target.value ? Number(e.target.value) as any : null)} className="adm-input" />
            </Field>
          </div>
          <Field label="Описание">
            <textarea value={v.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={4} maxLength={1000} className="adm-input resize-none" />
          </Field>
          <Field label="URL изображения">
            <input value={v.image_url ?? ""} onChange={(e) => set("image_url", e.target.value)} className="adm-input" placeholder="https://..." />
          </Field>
          <Field label="Сортировка">
            <input type="number" value={v.sort_order ?? 0} onChange={(e) => set("sort_order", Number(e.target.value) as any)} className="adm-input" />
          </Field>
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