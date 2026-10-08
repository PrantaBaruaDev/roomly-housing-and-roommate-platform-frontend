export const ROLE_COOKIE = "roomly_role";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function setRoleCookie(role: string): void {
  if (typeof document === "undefined") return;
  document.cookie = [
    `${ROLE_COOKIE}=${encodeURIComponent(role)}`,
    "path=/",
    `max-age=${MAX_AGE_SECONDS}`,
    "samesite=lax",
  ].join("; ");
}

/** Called on logout and on 401 */
export function clearRoleCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = [
    `${ROLE_COOKIE}=`,
    "path=/",
    "max-age=0",
    "samesite=lax",
  ].join("; ");
}

/** Read from client components (mirrors what middleware sees) */
export function getRoleCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${ROLE_COOKIE}=([^;]*)`),
  );
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}
