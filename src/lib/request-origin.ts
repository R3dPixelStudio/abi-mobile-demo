/** Host is the HTTP routing authority; Next dev can rewrite request.url to localhost. */
export function isSameOrigin(request: Request): boolean {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const parsed = new URL(origin);
    const target = new URL(request.url);
    const host = request.headers.get("host") || target.host;
    return (
      parsed.origin === origin &&
      parsed.host === host &&
      parsed.protocol === target.protocol
    );
  } catch {
    return false;
  }
}
