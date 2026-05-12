import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const SITE = "https://premiumstroe.ru";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
        const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        let serviceSlugs: string[] = [];
        if (url && key) {
          try {
            const sb = createClient(url, key);
            const { data } = await sb.from("services").select("slug").eq("published", true);
            serviceSlugs = (data ?? []).map((r: any) => r.slug);
          } catch {}
        }
        const staticUrls = ["/", "/services", "/about", "/geography", "/contact", "/privacy", "/offer"];
        const urls = [
          ...staticUrls.map((p) => ({ loc: SITE + p, priority: p === "/" ? 1.0 : 0.8 })),
          ...serviceSlugs.map((s) => ({ loc: `${SITE}/services/${s}`, priority: 0.7 })),
        ];
        const today = new Date().toISOString().slice(0, 10);
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${u.priority}</priority></url>`)
          .join("\n")}\n</urlset>`;
        return new Response(xml, {
          status: 200,
          headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});