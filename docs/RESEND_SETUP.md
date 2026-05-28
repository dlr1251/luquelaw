# Resend — formulario de contacto Luque Law

El formulario envía correos con **Resend**: notificación al equipo (`daniel@` + `asistente@`) y confirmación al usuario.

---

## 1. Cuenta y API key

1. Entra en [https://resend.com](https://resend.com) e inicia sesión (o crea cuenta).
2. Ve a **API Keys** → **Create API Key** → nombre p. ej. `luquelaw-contact`.
3. Copia la key (`re_...`) — solo se muestra una vez.

En el proyecto, edita `.env.local`:

```env
RESEND_API_KEY=re_tu_key_aqui
CONTACT_FROM_EMAIL="Luque Law <contacto@luquelaw.co>"
NEXT_PUBLIC_CONTACT_FORM_USE_API=true
```

Reinicia `npm run dev` después de guardar.

---

## 2. Dominio `luquelaw.co` (producción)

Para enviar desde `contacto@luquelaw.co` (o cualquier `@luquelaw.co`):

1. Resend → **Domains** → **Add Domain** → `luquelaw.co`.
2. Añade en tu DNS (donde gestionas el dominio) los registros que muestra Resend:
   - **SPF** (TXT)
   - **DKIM** (TXT o CNAME)
   - **MX** (opcional, si usas receiving)
3. Espera verificación (suele ser minutos u horas).
4. Usa ese remitente en `CONTACT_FROM_EMAIL`.

Mientras el dominio no esté verificado, puedes probar en local con el remitente de prueba de Resend:

```env
CONTACT_FROM_EMAIL="Luque Law <onboarding@resend.dev>"
```

> Con `onboarding@resend.dev` solo puedes enviar al correo con el que te registraste en Resend (modo prueba).

---

## 3. Probar en local

```bash
npm run resend:test
```

Opcional: envía a otro correo de prueba:

```bash
npm run resend:test -- daniel@luquelaw.co
```

Si falla, el script muestra el error de Resend (dominio no verificado, key inválida, etc.).

Luego prueba el formulario en [http://localhost:3000/#contact](http://localhost:3000/#contact).

---

## 4. Variables en Vercel (producción)

En [Vercel → luquelaw → Settings → Environment Variables](https://vercel.com/dlr1251s-projects/luquelaw/settings/environment-variables), añade para **Production**, **Preview** y **Development**:

| Variable | Valor |
|----------|--------|
| `RESEND_API_KEY` | `re_...` (misma key o una solo producción) |
| `CONTACT_FROM_EMAIL` | `Luque Law <contacto@luquelaw.co>` |
| `NEXT_PUBLIC_CONTACT_FORM_USE_API` | `true` |

O desde la terminal (sustituye `re_xxx`):

```bash
cd luquelaw
vercel env add RESEND_API_KEY production
vercel env add CONTACT_FROM_EMAIL production
vercel env add NEXT_PUBLIC_CONTACT_FORM_USE_API production
```

Repite para `preview` y `development` si quieres el formulario en todos los entornos.

Después: **Redeploy** del sitio en Vercel.

---

## 5. Checklist

- [ ] API key en `.env.local` y `npm run resend:test` OK
- [ ] Dominio `luquelaw.co` verificado en Resend
- [ ] `CONTACT_FROM_EMAIL` con `@luquelaw.co`
- [ ] Variables en Vercel + redeploy
- [ ] Envío real desde el formulario en producción

---

## Errores frecuentes

| Mensaje | Solución |
|---------|----------|
| `Email service is not configured` | Falta `RESEND_API_KEY` o no reiniciaste el dev server |
| `domain is not verified` | Termina verificación DNS o usa `onboarding@resend.dev` para prueba |
| `Invalid from address` | El formato debe ser `Nombre <email@dominio.com>` |
| Formulario usa mailto | Falta `NEXT_PUBLIC_CONTACT_FORM_USE_API=true` |
