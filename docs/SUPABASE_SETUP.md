# Supabase setup — Luque Law

Guía para conectar Supabase al proyecto (CLKR CMS + admin). Puedes hacerlo con **Supabase MCP** en Cursor o manualmente en el Dashboard.

---

## Opción A — Supabase MCP en Cursor (recomendado)

1. En Cursor, abre **Settings → MCP** y confirma que el servidor **Supabase** está habilitado.
2. Pide al agente: *“Autentica Supabase MCP”* y **acepta** el login en el navegador cuando aparezca (no lo omitas).
3. Una vez conectado, el agente puede:
   - Listar proyectos
   - Ejecutar SQL (`execute_sql`)
   - Obtener URL y anon key del proyecto
   - Verificar tablas y datos seed

4. Indica qué proyecto de Supabase usar (nombre o ref del proyecto Luque Law).

**Si saltaste la autenticación:** vuelve a pedirlo; sin OAuth el MCP solo expone `mcp_auth` y no puede tocar tu base de datos.

---

## Opción B — Dashboard manual (sin MCP)

### 1. Crear o abrir proyecto

[https://supabase.com/dashboard](https://supabase.com/dashboard) → proyecto para Luque Law.

### 2. Ejecutar SQL (en orden)

**SQL Editor → New query**

Pega y ejecuta **primero**:

`supabase/migrations/20260420120000_clkr_article_settings.sql`

Luego **segundo**:

`supabase/migrations/20260526120000_clkr_articles.sql`

Después del paso 2, añade tu email admin (paso 4 abajo).

### 3. Variables de entorno

**Project Settings → API**

| Variable | Valor |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key |

**Local:** copia `.env.example` → `.env.local` y pega los valores.

**Vercel:** Settings → Environment Variables → mismas variables en **Production** (y Preview si quieres) → **Redeploy**.

### 4. Admin (para editar CLKR en `/admin`)

Equipo actual (allowlist + `ADMIN_EMAILS` alineados):

| Persona | Email |
|---------|--------|
| Daniel | `daniel@luquelaw.co` |
| Alina | `asistente@luquelaw.co` |
| Mateo | `mateo.abogado1@gmail.com` |
| Camilo | `camiloauribeg@gmail.com` |

**A — Allowlist (recomendado para RLS)**

```sql
insert into public.admin_allowlist (email)
values
  ('daniel@luquelaw.co'),
  ('asistente@luquelaw.co'),
  ('mateo.abogado1@gmail.com'),
  ('camiloauribeg@gmail.com')
on conflict (email) do nothing;
```

**B — App metadata**

Dashboard → **Authentication → Users** → usuario → **App metadata**:

```json
{ "role": "admin" }
```

**C — Env (puerta de la app; alinear con A)**

En `.env.local` y Vercel (Production / Preview / Development):

```
ADMIN_EMAILS=daniel@luquelaw.co,asistente@luquelaw.co,mateo.abogado1@gmail.com,camiloauribeg@gmail.com
```

Para que **guardar** funcione, necesitas **A o B** (RLS usa `is_clkr_admin()`). Nuevos admins: crear usuario en Auth (invite o Add user) y pedirles **Forgot password** / recovery link para fijar contraseña.

CMS: Guides `/admin/clkr`, Norms `/admin/norms`, Blog `/admin/posts`, Commentaries `/admin/commentaries`, Moderation `/admin/comments`.

### 5. Cuenta de login

**Authentication → Users → Add user** (email + password) o invite si aún no tienen cuenta.

### 6. Verificar

En SQL Editor:

```sql
select slug_key, locale, status, title from public.clkr_articles order by locale, sort_order;
```

Deberías ver 4 filas (`investor-visa`, `real-estate-transactions` × en/es), status `published`.

---

## Probar en local

```bash
npm run dev
```

- [http://localhost:3000/clkr](http://localhost:3000/clkr) — hub con artículos
- [http://localhost:3000/clkr/investor-visa](http://localhost:3000/clkr/investor-visa) — artículo
- [http://localhost:3000/login](http://localhost:3000/login) → `/admin/clkr` — editar

---

## Problemas frecuentes

| Error | Causa | Solución |
|-------|--------|----------|
| Missing NEXT_PUBLIC_SUPABASE_URL | Sin `.env.local` | Añadir URL + anon key |
| Guardar artículo falla (RLS) | Email no en allowlist | `admin_allowlist` o `app_metadata.role` |
| Hub vacío | Migración no aplicada o sin `published` | Ejecutar migraciones; revisar `status` |
| `/admin` redirige a `/account` | No eres admin en app | `ADMIN_EMAILS` o metadata |

---

## Referencia

- Roadmap completo: [docs/PROJECT.md](./PROJECT.md)
- Migraciones: `supabase/migrations/`
