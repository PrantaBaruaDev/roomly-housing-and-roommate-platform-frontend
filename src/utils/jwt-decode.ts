export interface DecodedToken {
  userId?: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64 = parts[1]!.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );

    const json =
      typeof atob === "function"
        ? decodeURIComponent(
            atob(padded)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join(""),
          )
        : Buffer.from(padded, "base64").toString("utf-8");

    return JSON.parse(json) as DecodedToken;
  } catch {
    return null;
  }
}

export function isTokenExpired(payload: DecodedToken | null): boolean {
  if (!payload?.exp) return false; // no exp claim → treat as valid
  return payload.exp * 1000 < Date.now();
}