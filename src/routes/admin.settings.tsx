import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Row = { key: string; value: string | null };

const KNOWN_FIELDS: { key: string; label: string; type?: "text" | "textarea" }[] = [
  { key: "company_name", label: "Название компании" },
  { key: "phone", label: "Телефон" },
  { key: "email", label: "Email" },
  { key: "address", label: "Адрес офиса" },
  { key: "working_hours", label: "Режим работы" },
  { key: "inn", label: "ИНН" },
  { key: "kpp", label: "КПП" },
  { key: "ogrn", label: "ОГРН" },
  { key: "legal_address", label: "Юридический адрес", type: "textarea" },
  { key: "cities", label: "Города (через запятую)", type: "textarea" },
  { key: "hero_title", label: "Заголовок Hero", type: "textarea" },
  { key: "hero_subtitle", label: "Подзаголовок Hero", type: "textarea" },
  { key: "about_text", label: "Текст «О компании»", type: "textarea" },
];

export const Route = createFileRoute("/admin/settings")({
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key,value");
      if (error) throw error;
      return data as Row[];
    },
  });

  const [values, setValues] = useState<Record<string, string>>({});
  const [extras, setExtras] = useState<Row[]>([]);
  const [newKey, setNewKey] = useState("");

  useEffect(() => {
    if (!data) return;
    const map: Record<string, string> = {};
    data.forEach((r) => { map[r.key] = r.value ?? ""; });
    setValues(map);
    const known = new Set(KNOWN_FIELDS.map((f) => f.key));
    setExtras(data.filter((r) => !known.has(r.key)));
  }, [data]);

  const save = useMutation({
    mutationFn: async (rows: Row[]) => {
      const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_settings"] });
      qc.invalidateQueries({ queryKey: ["site_settings"] });
      toast.success("Сохранено");
    },
    onError: (e: any) => toast.error(e?.message ?? "Ошибка"),
  });

  const remove = useMutation({
    mutationFn: async (key: string) => {
      const { error } = await supabase.from("site_settings").delete().eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_settings"] });
      qc.invalidateQueries({ queryKey: ["site_settings"] });
      toast.success("Удалено");
    },
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const rows: Row[] = Object.entries(values).map(([key, value]) => ({ key, value }));
    save.mutate(rows);
  }

  function addExtra() {
    const key = newKey.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (!key) return;
    if (values[key] !== undefined) { toast.error("Такой ключ уже есть"); return; }
    setValues((p) => ({ ...p, [key]: "" }));
    setExtras((p) => [...p, { key, value: "" }]);
    setNewKey("");
  }

  if (isLoading) return <div className="text-muted-foreground">Загрузка...</div>;

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl">Настройки сайта</h1>
        <p className="text-sm text-muted-foreground mt-2">Контакты, реквизиты и тексты, выводимые на сайте</p>
      </div>

      <div className="bg-graphite border border-white/10 p-6 sm:p-8 space-y-5">
        {KNOWN_FIELDS.map((f) => (
          <div key={f.key}>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{f.label} <span className="text-muted-foreground/60 normal-case">({f.key})</span></label>
            {f.type === "textarea" ? (
              <textarea
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
                rows={3}
                className="mt-2 adm-input resize-none"
              />
            ) : (
              <input
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
                className="mt-2 adm-input"
              />
            )}
          </div>
        ))}
      </div>

      {!!extras.length && (
        <div className="bg-graphite border border-white/10 p-6 sm:p-8 space-y-5">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--orange)]">Дополнительные настройки</div>
          {extras.map((r) => (
            <div key={r.key} className="flex gap-3 items-start">
              <div className="flex-1">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{r.key}</label>
                <input
                  value={values[r.key] ?? ""}
                  onChange={(e) => setValues((p) => ({ ...p, [r.key]: e.target.value }))}
                  className="mt-2 adm-input"
                />
              </div>
              <button
                type="button"
                onClick={() => { if (confirm(`Удалить «${r.key}»?`)) remove.mutate(r.key); }}
                className="mt-7 w-10 h-10 grid place-items-center border border-white/15 hover:border-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-graphite border border-white/10 p-6 sm:p-8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--orange)] mb-3">Добавить поле</div>
        <div className="flex gap-3">
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="custom_key"
            className="adm-input flex-1"
          />
          <button type="button" onClick={addExtra} className="px-4 h-11 border border-white/15 hover:border-[var(--orange)] hover:text-[var(--orange)] inline-flex items-center gap-2 text-sm uppercase tracking-wider">
            <Plus className="w-4 h-4" /> Добавить
          </button>
        </div>
      </div>

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="submit" disabled={save.isPending}
          className="inline-flex items-center gap-2 px-6 h-12 bg-[var(--orange)] text-asphalt font-semibold uppercase tracking-wider text-sm hover:bg-[var(--orange-glow)] transition-colors disabled:opacity-60 shadow-2xl"
        >
          <Save className="w-4 h-4" />
          {save.isPending ? "Сохранение..." : "Сохранить всё"}
        </button>
      </div>
    </form>
  );
}