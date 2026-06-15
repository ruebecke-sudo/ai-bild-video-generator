# KI-Video & Bild-Generator

Eine moderne Webanwendung basierend auf Next.js, integriert mit **Replicate** für High-End-KI-Generierungen (FLUX für Bilder, Luma für Videos in 1080p), **Supabase** für GitHub Auth & Credit-Guthaben sowie **Stripe** für kostenpflichtige Aufladungen.

---

## 🛠️ Voraussetzungen & API-Keys einrichten

Erstelle eine `.env.local` im Hauptverzeichnis mit folgenden Variablen:

```env
# Supabase (Auth & Database)
NEXT_PUBLIC_SUPABASE_URL=https://dein-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key
SUPABASE_SERVICE_ROLE_KEY=dein-service-role-key (Nur für Backend-Routes zur Credit-Verwaltung!)

# Replicate API
REPLICATE_API_TOKEN=dein-replicate-token

# Stripe Billing
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 📂 Supabase Datenbank-Schema

Erstelle im SQL-Editor deines Supabase-Dashboards die folgenden Tabellen, um Profile, Credits und den Generierungsverlauf zu sichern:

```sql
-- Tabelle für Benutzerprofile und Credits
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  credits integer default 10 not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabelle für Generierungsverlauf
create table public.generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text not null, -- 'image', 'video', 'image-to-video'
  prompt text,
  input_image text,
  prediction_id text,
  status text not null, -- 'starting', 'succeeded', 'failed'
  output_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  completed_at timestamp with time zone
);

-- Sicherheits-Triggers für automatische Profilerstellung
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, credits)
  values (new.id, 10); -- 10 Start-Credits
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 🔑 GitHub Login (OAuth) einrichten

1. Gehe in GitHub zu: **Settings > Developer Settings > OAuth Apps > New OAuth App**.
2. **Homepage URL**: `https://deine-netlify-seite.netlify.app` (bzw. `http://localhost:3000` für lokale Tests).
3. **Authorization callback URL**: `https://dein-projekt.supabase.co/auth/v1/callback`.
4. Generiere ein Client Secret und trage Client ID + Secret in deinem **Supabase Dashboard unter Authentication > Providers > GitHub** ein.

---

## 🚀 Lokale Entwicklung starten

Führe folgenden Befehl aus, um das Projekt lokal zu starten:

```bash
npm install
npm run dev
```
*(Da npm eventuell nicht global registriert ist, starte es über die PowerShell-Hilfe mit dem Pfad oder `npx`)*.
