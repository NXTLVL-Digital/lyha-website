const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 24;
const DEFAULT_MAGIC_TOKEN_TTL_SECONDS = 60 * 15;

function getClientConfig(env) {
  return {
    clientId: env.CLIENT_ID || "lyha",
    clientName: env.CLIENT_NAME || "LYHA",
    adminRedirectPath: env.ADMIN_REDIRECT_PATH || "/admin/",
    sessionCookieName: env.SESSION_COOKIE_NAME || "wayne_g_session",
    allowedEmails: parseList(env.ALLOWED_EMAILS),
    allowedDomains: parseList(env.ALLOWED_DOMAINS),
  };
}

function parseList(value) {
  return (value || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function emailDomain(email) {
  const parts = email.split("@");
  return parts.length === 2 ? parts[1] : "";
}

function isEmailAllowed(email, config) {
  const normalized = normalizeEmail(email);

  if (!normalized || !normalized.includes("@")) {
    return false;
  }

  return (
    config.allowedEmails.includes(normalized) ||
    config.allowedDomains.includes(emailDomain(normalized))
  );
}

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}

function parseCookie(header, name) {
  const cookies = (header || "").split(";").map((part) => part.trim());
  const prefix = `${name}=`;
  const match = cookies.find((cookie) => cookie.startsWith(prefix));
  return match ? decodeURIComponent(match.slice(prefix.length)) : "";
}

function sessionKey(config, sessionId) {
  return `session:${config.clientId}:${sessionId}`;
}

function magicTokenKey(config, token) {
  return `magic:${config.clientId}:${token}`;
}

export default {
  async fetch(request, env) {
    const config = getClientConfig(env);
    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    if (pathname === "/") {
      return jsonResponse({
        name: "Wayne G. Auth Worker",
        client: config.clientName,
        status: "ok",
      });
    }

    if (pathname === "/auth/request" && request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch (_error) {
        return jsonResponse({ error: "Invalid JSON body" }, 400);
      }

      const email = normalizeEmail(body.email);
      if (!isEmailAllowed(email, config)) {
        return jsonResponse({ error: "Email not allowed" }, 403);
      }

      const token = crypto.randomUUID();
      const expiresAt = Date.now() + DEFAULT_MAGIC_TOKEN_TTL_SECONDS * 1000;

      await env.AUTH_KV.put(
        magicTokenKey(config, token),
        JSON.stringify({ email, expiresAt }),
        { expirationTtl: DEFAULT_MAGIC_TOKEN_TTL_SECONDS },
      );

      const magicLink = `${url.origin}/auth/verify?token=${encodeURIComponent(token)}`;

      // TODO: wire a transactional email provider. Returning the link is only for
      // early internal testing and must not be the final board-member flow.
      return jsonResponse({ magicLink, expiresInSeconds: DEFAULT_MAGIC_TOKEN_TTL_SECONDS });
    }

    if (pathname === "/auth/verify" && request.method === "GET") {
      const token = searchParams.get("token");
      if (!token) {
        return new Response("Missing token", { status: 400 });
      }

      const data = await env.AUTH_KV.get(magicTokenKey(config, token), { type: "json" });
      if (!data || Date.now() > data.expiresAt) {
        return new Response("Invalid or expired token", { status: 401 });
      }

      await env.AUTH_KV.delete(magicTokenKey(config, token));

      const sessionId = crypto.randomUUID();
      await env.AUTH_KV.put(sessionKey(config, sessionId), data.email, {
        expirationTtl: DEFAULT_SESSION_TTL_SECONDS,
      });

      return new Response(null, {
        status: 302,
        headers: {
          Location: config.adminRedirectPath,
          "Set-Cookie": `${config.sessionCookieName}=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${DEFAULT_SESSION_TTL_SECONDS}`,
        },
      });
    }

    if (pathname === "/auth/check" && request.method === "GET") {
      const sessionId = parseCookie(request.headers.get("Cookie"), config.sessionCookieName);
      if (!sessionId) {
        return jsonResponse({ authenticated: false }, 401);
      }

      const email = await env.AUTH_KV.get(sessionKey(config, sessionId));
      if (!email) {
        return jsonResponse({ authenticated: false }, 401);
      }

      return jsonResponse({ authenticated: true, email, client: config.clientId });
    }

    return jsonResponse({ error: "Not found" }, 404);
  },
};
