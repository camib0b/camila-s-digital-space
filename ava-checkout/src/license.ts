import { LICENSE_DAYS, licenseApiOrigin } from "./config";

export interface IssuedLicense {
  token: string;
  keyId: string;
}

export async function issuePaidLicense(env: Env, email: string): Promise<IssuedLicense> {
  const response = await fetch(`${licenseApiOrigin(env)}/v1/admin/issue`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.AVA_LICENSE_ADMIN_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, days: LICENSE_DAYS }),
  });

  const payload = (await response.json()) as {
    ok?: boolean;
    token?: string;
    license?: { keyId?: string };
    reason?: string;
  };

  if (!response.ok || !payload.ok || !payload.token || !payload.license?.keyId) {
    console.error(
      JSON.stringify({
        event: "ava.license.issue_failed",
        status: response.status,
        reason: payload.reason || "issue_failed",
        email,
      }),
    );
    throw new Error("license_issue_failed");
  }

  return { token: payload.token, keyId: payload.license.keyId };
}
