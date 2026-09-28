function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendLicenseKeyEmail(
  env: Env,
  params: { to: string; token: string; language: "es" | "en" },
): Promise<void> {
  const fromEmail = env.MAIL_FROM;
  if (!fromEmail) {
    throw new Error("missing_mail_from");
  }

  const subject = params.language === "en" ? "Your AVA license" : "Tu licencia de AVA";
  const text =
    params.language === "en"
      ? [
          "You paid for AVA (1 year, 1 Mac).",
          "Paste this key in AVA, with the same email you used to pay:",
          "",
          params.token,
          "",
          "Tu clave de AVA (1 año, 1 Mac). Pégala en la app, con el mismo mail del pago:",
          params.token,
        ].join("\n")
      : [
          "Pagaste AVA (1 año, 1 Mac).",
          "Pega esta clave en AVA, con el mismo mail que usaste para pagar:",
          "",
          params.token,
          "",
          "You paid for AVA (1 year, 1 Mac). Paste this key in the app, with the same email:",
          params.token,
        ].join("\n");

  const safeToken = escapeHtml(params.token);
  const html =
    params.language === "en"
      ? `<p>You paid for AVA (1 year, 1 Mac).</p><p>Paste this key in AVA, with the same email you used to pay:</p><p><code style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace">${safeToken}</code></p><p>Tu clave de AVA. Pégala en la app, con el mismo mail del pago.</p>`
      : `<p>Pagaste AVA (1 año, 1 Mac).</p><p>Pega esta clave en AVA, con el mismo mail que usaste para pagar:</p><p><code style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace">${safeToken}</code></p><p>You paid for AVA. Paste this key in the app, with the same email.</p>`;

  await env.EMAIL.send({
    to: params.to,
    from: { email: fromEmail, name: "AVA" },
    subject,
    text,
    html,
  });
}
