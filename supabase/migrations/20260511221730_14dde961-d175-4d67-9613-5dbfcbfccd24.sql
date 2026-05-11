
-- Roles
create type public.app_role as enum ('admin', 'editor');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists(select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users read own roles" on public.user_roles
for select to authenticated using (user_id = auth.uid());

create policy "admins manage roles" on public.user_roles
for all to authenticated using (public.has_role(auth.uid(),'admin'))
with check (public.has_role(auth.uid(),'admin'));

-- Services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_desc text,
  full_content text,
  tags text[] default '{}',
  image_url text,
  icon text,
  sort_order int not null default 0,
  published boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.services enable row level security;
create policy "public read published services" on public.services
for select using (published = true);
create policy "admins manage services" on public.services
for all to authenticated using (public.has_role(auth.uid(),'admin'))
with check (public.has_role(auth.uid(),'admin'));

-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text,
  description text,
  image_url text,
  year int,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;
create policy "public read published projects" on public.projects
for select using (published = true);
create policy "admins manage projects" on public.projects
for all to authenticated using (public.has_role(auth.uid(),'admin'))
with check (public.has_role(auth.uid(),'admin'));

-- Site settings (key/value)
create table public.site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
create policy "public read settings" on public.site_settings for select using (true);
create policy "admins manage settings" on public.site_settings
for all to authenticated using (public.has_role(auth.uid(),'admin'))
with check (public.has_role(auth.uid(),'admin'));

-- Leads
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  service_type text,
  message text,
  consent boolean not null default false,
  source_page text,
  created_at timestamptz not null default now(),
  status text not null default 'new'
);
alter table public.leads enable row level security;
create policy "anyone can submit lead" on public.leads
for insert with check (consent = true and length(name) between 1 and 120 and length(phone) between 5 and 40);
create policy "admins read leads" on public.leads
for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins update leads" on public.leads
for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins delete leads" on public.leads
for delete to authenticated using (public.has_role(auth.uid(),'admin'));

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger trg_services_updated before update on public.services
for each row execute procedure public.touch_updated_at();
create trigger trg_projects_updated before update on public.projects
for each row execute procedure public.touch_updated_at();
create trigger trg_settings_updated before update on public.site_settings
for each row execute procedure public.touch_updated_at();

-- Seed services
insert into public.services (slug, title, short_desc, tags, sort_order, seo_title, seo_description, full_content) values
('asfaltirovanie','Асфальтирование','Укладка асфальта, ямочный ремонт, дороги, парковки, дворы под ключ.', array['Дороги','Парковки','Дворы','Ямочный ремонт'],1,
 'Асфальтирование в Красногорске и Москве — ООО «Премиум Строй»',
 'Профессиональная укладка асфальта в Красногорске, Москве и МО. Дороги, парковки, дворы, ямочный ремонт. Собственная техника, гарантия, договор.',
 'Полный цикл асфальтных работ: подготовка основания, устройство щебёночной подушки, укладка асфальтобетона современными асфальтоукладчиками Vögele, уплотнение тандемными катками. Работаем по ГОСТ, даём гарантию по договору.'),
('blagoustrojstvo','Благоустройство территории','Тротуарная плитка, бордюры, дренаж, газоны, малые архитектурные формы.', array['Плитка','Бордюры','Дренаж','Озеленение'],2,
 'Благоустройство территории в Красногорске и МО — Премиум Строй',
 'Комплексное благоустройство территорий в Красногорске и Московской области: плитка, бордюры, дренаж, озеленение. Под ключ.',
 'Архитектурный подход к каждой территории: проектирование, подготовка основания, укладка плитки и бордюров, устройство дренажа, газона и зон отдыха.'),
('razrabotka-kotlovanov','Разработка котлованов','Земляные работы, экскавация, вывоз грунта собственным транспортом.', array['Земля','Экскавация','Вывоз грунта','Планировка'],3,
 'Разработка котлованов в Москве и МО — ООО «Премиум Строй»',
 'Земляные работы и разработка котлованов в Красногорске, Москве и МО. Точный расчёт, собственная спецтехника, вывоз грунта.',
 'Геодезическая разбивка, разработка котлована экскаваторами, погрузка и вывоз грунта самосвалами, планировка дна и обратная засыпка.'),
('arenda-spectehniki','Аренда спецтехники','Самосвалы, экскаваторы, катки, асфальтоукладчики с оператором.', array['Самосвалы','Экскаваторы','Катки','Асфальтоукладчики'],4,
 'Аренда спецтехники в Красногорске и МО — Премиум Строй',
 'Аренда спецтехники с оператором в Красногорске, Москве и МО: самосвалы, экскаваторы, катки, асфальтоукладчики. Почасовая и сменная оплата.',
 'Собственный парк техники: фронтальные погрузчики, экскаваторы JCB и Komatsu, самосвалы 10–30 т, катки HAMM, асфальтоукладчики Vögele.'),
('dostavka-materialov','Доставка инертных материалов','Щебень, песок, асфальтобетон, грунт. Собственный автопарк.', array['Щебень','Песок','Асфальтобетон','Грунт'],5,
 'Доставка щебня, песка и асфальта в Красногорске и МО',
 'Доставка инертных материалов в Красногорске, Москве и МО: щебень, песок, асфальтобетон, грунт. Без недовесов, по ГОСТ.',
 'Поставляем сертифицированные материалы напрямую с карьеров и заводов. Точный вес, документы, оперативная логистика 24/7.'),
('dorozhnoe-stroitelstvo','Дорожное строительство «под ключ»','Дороги, парковки, площадки для бизнеса — от проекта до сдачи.', array['Под ключ','Проектирование','Дороги','Парковки'],6,
 'Дорожное строительство под ключ в Москве и МО — Премиум Строй',
 'Строительство дорог, парковок и промышленных площадок под ключ в Красногорске, Москве и МО. Проект, согласование, реализация.',
 'Полный цикл: проектирование, согласование, земляные работы, устройство основания, асфальтирование, разметка, бордюры и водоотведение.');

-- Seed settings
insert into public.site_settings (key, value) values
('company_name','ООО «Премиум Строй»'),
('inn','ИНН: __________ (заменить)'),
('ogrn','ОГРН: __________ (заменить)'),
('kpp','КПП: __________ (заменить)'),
('legal_address','Юр. адрес: г. Москва, ___ (заменить)'),
('phone','+7 (800) 000-00-00'),
('email','info@premiumstroe.ru'),
('address','г. Красногорск, Московская область'),
('working_hours','24 / 7 — без выходных'),
('hero_title_line1','ПРЕМИУМ'),
('hero_title_line2','АСФАЛЬТИРОВАНИЕ'),
('hero_title_line3','И БЛАГОУСТРОЙСТВО'),
('hero_subtitle','Инженерный подход. Собственная техника. Работаем по Москве, Красногорску и всей Московской области — круглосуточно, в любую погоду.'),
('about_text','ООО «Премиум Строй» — премиальная инжиниринговая компания в области асфальтирования, благоустройства и дорожного строительства в Красногорске, Москве и Московской области. С 2014 года реализуем проекты любой сложности.'),
('geo_cities','Красногорск, Москва, Истра, Дедовск, Нахабино, Павшинская Пойма, Митино, Тушино, Химки, Одинцово, Звенигород');
