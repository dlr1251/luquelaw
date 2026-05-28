/**
 * Prueba la configuración de Resend (lee .env.local).
 * Uso: npm run resend:test
 *      npm run resend:test -- tu@correo.com
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const envPath = resolve(root, ".env.local");

function loadEnvLocal() {
  if (!existsSync(envPath)) {
    console.error("No existe .env.local. Copia variables desde .env.example");
    process.exit(1);
  }
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const apiKey = process.env.RESEND_API_KEY?.trim();
const from = process.env.CONTACT_FROM_EMAIL?.trim();
const testTo = process.argv[2]?.trim() || "daniel@luquelaw.co";

if (!apiKey) {
  console.error("\n❌ Falta RESEND_API_KEY en .env.local");
  console.error("   1. Crea una key en https://resend.com/api-keys");
  console.error("   2. Añade: RESEND_API_KEY=re_...\n");
  process.exit(1);
}

if (!from) {
  console.error("\n❌ Falta CONTACT_FROM_EMAIL en .env.local");
  console.error('   Ejemplo: CONTACT_FROM_EMAIL="Luque Law <contacto@luquelaw.co>"\n');
  process.exit(1);
}

const { Resend } = await import("resend");
const resend = new Resend(apiKey);

console.log("\n📧 Enviando correo de prueba Resend…");
console.log(`   From: ${from}`);
console.log(`   To:   ${testTo}\n`);

const { data, error } = await resend.emails.send({
  from,
  to: [testTo],
  subject: "[Luque Law] Prueba Resend — formulario de contacto",
  html: `
    <p>Si recibes este correo, Resend está configurado correctamente para <strong>Luque Law</strong>.</p>
    <p>Puedes probar el formulario en el sitio (#contact).</p>
  `,
});

if (error) {
  console.error("❌ Error de Resend:\n", error);
  if (String(error.message || "").includes("domain")) {
    console.error(
      "\n💡 El dominio del remitente no está verificado. Usa temporalmente:\n",
      '   CONTACT_FROM_EMAIL="Luque Law <onboarding@resend.dev>"\n',
      "   (solo envía al email de tu cuenta Resend en modo prueba)\n",
    );
  }
  process.exit(1);
}

console.log("✅ Correo enviado. ID:", data?.id);
console.log("   Revisa la bandeja de", testTo, "(y spam).\n");
