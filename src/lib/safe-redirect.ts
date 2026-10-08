export function getSafeRedirect(
  target: string | null,
  baseUrl: string,
): string | null {
  if (!target?.startsWith("/")) return null;

  const resolved = new URL(target, baseUrl);
  return resolved.origin === new URL(baseUrl).origin
    ? `${resolved.pathname}${resolved.search}${resolved.hash}`
    : null;
}
