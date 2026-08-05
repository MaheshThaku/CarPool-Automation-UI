import { NextRequest, NextResponse } from "next/server";

// Backend base already includes /api. Frontend service calls use /v1/...,
// so /api/proxy/v1/foo -> http://localhost:8081/api/v1/foo.
const BACKEND_BASE = "http://localhost:8081/api";

// Endpoints that MUST go through the dedicated /api/auth/* routes instead of
// this pass-through proxy. If they were proxied directly, tokens would be
// returned to JS (or sent without the httpOnly-cookie handshake) — bypassing
// the secure storage layer. Block them here as defense in depth.
const BLOCKED_AUTH_PATHS = [
  "public/login",
  "public/refresh-token",
  "auth/logout",
  "auth/logout-all",
];

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

async function handler(req: NextRequest, ctx: RouteContext): Promise<NextResponse> {
  const { path } = await ctx.params;

  if (BLOCKED_AUTH_PATHS.some((blocked) => path.join("/").includes(blocked))) {
    return NextResponse.json(
      { message: "Use the dedicated auth route for this endpoint." },
      { status: 404 }
    );
  }

  const search = req.nextUrl.search;
  const targetUrl = `${BACKEND_BASE}/${path.join("/")}${search}`;

  // Read the httpOnly accessToken cookie server-side and attach it as Bearer.
  const token = req.cookies.get("accessToken")?.value;

  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const accept = req.headers.get("accept");
  if (accept) headers.set("accept", accept);
  if (token) headers.set("authorization", `Bearer ${token}`);

  const method = req.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";
  const rawBody = hasBody ? await req.arrayBuffer() : undefined;

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl, {
      method,
      headers,
      body: rawBody && rawBody.byteLength > 0 ? Buffer.from(rawBody) : undefined,
      redirect: "manual",
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Upstream request failed." },
      { status: 502 }
    );
  }

  // Stream the backend response back, preserving content-type.
  const resHeaders = new Headers();
  const upstreamCt = upstream.headers.get("content-type");
  if (upstreamCt) resHeaders.set("content-type", upstreamCt);

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: resHeaders,
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
