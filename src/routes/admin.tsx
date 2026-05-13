import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Wrench, Inbox, Settings, Building2, LogOut, Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Админ-панель — Премиум Строй" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-asphalt">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--orange)]" />
      </div>
    );
  }
  if (!user) return <LoginScreen />;
  if (!isAdmin) return <NoAccessScreen email={user.email ?? ""} />;

  return <AdminShell />;
}

function AdminShell() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const nav = [
    { to: "/admin", label: "Дашборд", icon: LayoutDashboard, exact: true },
    { to: "/admin/services", label: "Услуги", icon: Wrench, exact: false },
    { to: "/admin/projects", label: "Проекты", icon: Building2, exact: false },
    { to: "/admin/leads", label: "Заявки", icon: Inbox, exact: false },
    { to: "/admin/settings", label: "Настройки", icon: Settings, exact: false },
  ] as const;

  async function logout() {
    await supabase.auth.signOut();
    toast.success("Вы вышли из аккаунта");
  }

  return (
    <div className="min-h-screen bg-asphalt text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-white/10 bg-graphite/40">
        <Link to="/" className="flex items-center gap-3 h-16 px-5 border-b border-white/10">
          <div className="w-8 h-8 grid place-items-center bg-gradient-to-br from-[var(--orange)] to-[var(--orange-glow)] rounded-sm">
            <span className="font-display text-asphalt">П</span>
          </div>
          <div className="font-display text-sm tracking-wider">АДМИНКА</div>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => {
            const active = n.exact ? path === n.to : path === n.to || path.startsWith(n.to + "/");
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 h-10 px-3 text-sm uppercase tracking-wider transition-colors ${
                  active
                    ? "bg-[var(--orange)]/10 text-[var(--orange)] border-l-2 border-[var(--orange)]"
                    : "text-concrete hover:text-[var(--orange)] hover:bg-white/5 border-l-2 border-transparent"
                }`}
              >
                <Icon className="w-4 h-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="flex items-center gap-3 h-12 px-5 text-sm uppercase tracking-wider text-concrete hover:text-destructive hover:bg-white/5 transition-colors border-t border-white/10"
        >
          <LogOut className="w-4 h-4" />
          Выйти
        </button>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between h-16 px-4 border-b border-white/10 bg-graphite/40">
          <Link to="/" className="font-display text-sm tracking-wider">ПРЕМИУМ · АДМИН</Link>
          <button onClick={logout} className="text-xs uppercase tracking-wider text-concrete hover:text-destructive">Выйти</button>
        </header>
        {/* Mobile nav strip */}
        <div className="md:hidden flex overflow-x-auto scrollbar-hide border-b border-white/10 bg-graphite/40">
          {nav.map((n) => {
            const active = n.exact ? path === n.to : path === n.to || path.startsWith(n.to + "/");
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`shrink-0 px-4 h-12 grid place-items-center text-xs uppercase tracking-wider whitespace-nowrap ${
                  active ? "text-[var(--orange)] border-b-2 border-[var(--orange)]" : "text-concrete"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </div>

        <main className="flex-1 p-5 sm:p-8 lg:p-10 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function LoginScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      // Allow username "admin" — translate to internal email
      const email = login.includes("@")
        ? login.trim()
        : `${login.trim().toLowerCase()}@premiumstroe.ru`;
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Добро пожаловать");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Аккаунт создан. Попросите администратора назначить роль.");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Ошибка");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-asphalt p-6 grid-lines">
      <div className="w-full max-w-md bg-graphite p-8 sm:p-10 border border-white/10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 grid place-items-center bg-gradient-to-br from-[var(--orange)] to-[var(--orange-glow)] rounded-sm">
            <Shield className="w-5 h-5 text-asphalt" />
          </div>
          <div>
            <div className="font-display text-xl tracking-wider">АДМИН-ПАНЕЛЬ</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Премиум Строй</div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Логин или Email</label>
            <input
              type="text" required value={login} onChange={(e) => setLogin(e.target.value)}
              className="mt-2 w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-[var(--orange)] transition-colors"
              placeholder="admin"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Пароль</label>
            <input
              type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-[var(--orange)] transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit" disabled={busy}
            className="w-full h-12 bg-[var(--orange)] text-asphalt font-semibold uppercase tracking-wider text-sm hover:bg-[var(--orange-glow)] transition-colors disabled:opacity-60"
          >
            {busy ? "..." : mode === "login" ? "Войти" : "Создать аккаунт"}
          </button>
        </form>

        <button
          onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}
          className="mt-6 w-full text-xs uppercase tracking-widest text-muted-foreground hover:text-[var(--orange)] transition-colors"
        >
          {mode === "login" ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
        </button>

        <Link to="/" className="block mt-6 text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-[var(--orange)]">
          ← На сайт
        </Link>
      </div>
    </div>
  );
}

function NoAccessScreen({ email }: { email: string }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen grid place-items-center bg-asphalt p-6 text-center">
      <div className="max-w-md">
        <Shield className="w-12 h-12 text-[var(--orange)] mx-auto" />
        <h1 className="font-display text-3xl mt-6">Нет доступа</h1>
        <p className="mt-3 text-sm text-concrete">
          Аккаунт <span className="text-[var(--orange)]">{email}</span> не имеет роли администратора.
          Обратитесь к владельцу проекта для назначения роли.
        </p>
        <button
          onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin" }); }}
          className="mt-8 px-6 h-11 border border-white/15 text-sm uppercase tracking-wider hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors"
        >
          Выйти и войти под другим аккаунтом
        </button>
      </div>
    </div>
  );
}