import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SettingsMap = Record<string, string>;

export function useSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async (): Promise<SettingsMap> => {
      const { data, error } = await supabase.from("site_settings").select("key,value");
      if (error) throw error;
      const map: SettingsMap = {};
      (data ?? []).forEach((r) => { map[r.key] = r.value ?? ""; });
      return map;
    },
    staleTime: 60_000,
  });
}

export function useServices() {
  return useQuery({
    queryKey: ["services_public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 60_000,
  });
}