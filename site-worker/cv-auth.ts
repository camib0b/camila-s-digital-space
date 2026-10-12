import { createRemoteJWKSet, jwtVerify } from "jose";

export interface CvAuthEnvironment {
  CV_OWNER_EMAIL?: string;
  CV_ACCESS_TEAM_DOMAIN?: string;
  CV_ACCESS_AUD?: string;
  CV_ALLOW_LOCAL_AUTH?: string;
}

export interface AccessContext {
  aud: string;
  getIdentity(): Promise<{ email?: string; name?: string } | null>;
}

export interface CvWorkerContext {
  access?: AccessContext;
}

function allowedEmails(environment: CvAuthEnvironment): Set<string> {
  const raw = environment.CV_OWNER_EMAIL ?? "camilaescuderob@gmail.com,camilaescuderob@uc.cl";
  return new Set(
    raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

function isEmailAllowed(environment: CvAuthEnvironment, email: string | undefined): boolean {
  if (!email) {
    return false;
  }
  return allowedEmails(environment).has(email.trim().toLowerCase());
}

async function identityFromAccess(
  environment: CvAuthEnvironment,
  context: CvWorkerContext,
): Promise<string | null> {
  if (!context.access) {
    return null;
  }
  const identity = await context.access.getIdentity();
  const email = identity?.email;
  if (!isEmailAllowed(environment, email)) {
    return null;
  }
  return email ?? null;
}

async function identityFromJwt(
  request: Request,
  environment: CvAuthEnvironment,
): Promise<string | null> {
  const teamDomain = environment.CV_ACCESS_TEAM_DOMAIN?.trim();
  const audience = environment.CV_ACCESS_AUD?.trim();
  if (!teamDomain || !audience) {
    return null;
  }
  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token) {
    return null;
  }
  const jwks = createRemoteJWKSet(new URL(`${teamDomain}/cdn-cgi/access/certs`));
  const { payload } = await jwtVerify(token, jwks, {
    issuer: teamDomain,
    audience,
  });
  const email = typeof payload.email === "string" ? payload.email : undefined;
  if (!isEmailAllowed(environment, email)) {
    return null;
  }
  return email ?? null;
}

export async function requireCvOwner(
  request: Request,
  environment: CvAuthEnvironment,
  context: CvWorkerContext,
): Promise<{ email: string } | Response> {
  const fromAccess = await identityFromAccess(environment, context);
  if (fromAccess) {
    return { email: fromAccess };
  }

  try {
    const fromJwt = await identityFromJwt(request, environment);
    if (fromJwt) {
      return { email: fromJwt };
    }
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  if (environment.CV_ALLOW_LOCAL_AUTH === "true") {
    const fallback = [...allowedEmails(environment)][0];
    if (fallback) {
      return { email: fallback };
    }
  }

  return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
    status: 401,
    headers: { "content-type": "application/json" },
  });
}
