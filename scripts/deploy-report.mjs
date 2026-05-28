/**
 * Verify production URLs and optionally email a deployment report via Resend.
 *
 * Usage:
 *   node scripts/deploy-report.mjs
 *   node scripts/deploy-report.mjs --email daniel@luquelaw.co
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const envPath = resolve(root, ".env.local");

function loadEnvLocal() {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
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

const CHECKS = [
  { name: "Legal articles hub", url: "https://www.luquelaw.co/clkr" },
  { name: "Legal article detail", url: "https://www.luquelaw.co/clkr/investor-visa" },
  { name: "Blog hub", url: "https://www.luquelaw.co/posts" },
  {
    name: "Blog post detail",
    url: "https://www.luquelaw.co/posts/digital-nomad-visa-colombia",
  },
  { name: "Norms hub", url: "https://www.luquelaw.co/norms" },
  {
    name: "Constitution section",
    url: "https://www.luquelaw.co/norms/constitucion-colombia/preambulo",
  },
  {
    name: "Visa resolution section",
    url: "https://www.luquelaw.co/norms/resolucion-5477-2022/visa-m-inversionista",
  },
  { name: "Spanish norms hub", url: "https://www.luquelaw.co/es/norms" },
];

async function checkUrl({ name, url }) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    const ok = res.status >= 200 && res.status < 400;
    return { name, url, status: res.status, ok };
  } catch (error) {
    return {
      name,
      url,
      status: 0,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function buildReport(results) {
  const passed = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);
  const lines = [
    "Luque Law — production deployment verification",
    `Date: ${new Date().toISOString()}`,
    "",
    `Passed: ${passed.length}/${results.length}`,
    "",
  ];

  if (failed.length) {
    lines.push("FAILED CHECKS:");
    for (const item of failed) {
      lines.push(
        `- ${item.name}: ${item.url} → HTTP ${item.status}${item.error ? ` (${item.error})` : ""}`,
      );
    }
    lines.push("");
  }

  lines.push("ALL CHECKS:");
  for (const item of results) {
    lines.push(
      `- [${item.ok ? "OK" : "FAIL"}] ${item.name} (${item.status}) — ${item.url}`,
    );
  }

  return { text: lines.join("\n"), failed, passed };
}

async function sendReportEmail(to, reportText, failedCount) {
  loadEnvLocal();
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    console.error("Skipping email: RESEND_API_KEY or CONTACT_FROM_EMAIL missing in .env.local");
    return false;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const subject =
    failedCount > 0
      ? `[Luque Law] Deployment issues detected (${failedCount} failed)`
      : "[Luque Law] Production deployment verified successfully";

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    text: reportText,
    html: `<pre style="font-family: ui-monospace, monospace; white-space: pre-wrap;">${reportText.replace(/</g, "&lt;")}</pre>`,
  });

  if (error) {
    console.error("Email send failed:", error);
    return false;
  }

  console.log(`Report emailed to ${to}`);
  return true;
}

async function main() {
  const emailIdx = process.argv.indexOf("--email");
  const emailTo = emailIdx >= 0 ? process.argv[emailIdx + 1] : "daniel@luquelaw.co";

  console.log("Checking production URLs…\n");
  const results = [];
  for (const check of CHECKS) {
    const result = await checkUrl(check);
    results.push(result);
    console.log(
      `[${result.ok ? "OK" : "FAIL"}] ${result.name} — ${result.status} ${result.url}`,
    );
  }

  const { text, failed } = buildReport(results);
  console.log("\n" + text);

  if (process.argv.includes("--email") || failed.length > 0) {
    await sendReportEmail(emailTo, text, failed.length);
  }

  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
