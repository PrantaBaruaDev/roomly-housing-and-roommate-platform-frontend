import { cookies } from "next/headers";
import { decodeToken, isTokenExpired } from "@/utils/jwt-decode";

export type ServerRole = "ADMIN" | "OWNER" | "TENANT";

export interface ServerUser {
  role: ServerRole;
  userId: string | null;
  email: string | null;
}

export async function getServerUser(): Promise<ServerUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  const decoded = decodeToken(token);

  if (!decoded?.role) return null;
    if (isTokenExpired(decoded)) return null;

  const raw = String(decoded.role).toUpperCase();
  if (raw !== "ADMIN" && raw !== "OWNER" && raw !== "TENANT") return null;

  const d = decoded as Record<string, unknown>;

  return {
    role: raw as ServerRole,
    userId:
      (typeof d.userId === "string" && d.userId) ||
      (typeof d.id === "string" && d.id) ||
      (typeof d.sub === "string" && d.sub) ||
      null,
    email: typeof d.email === "string" ? d.email : null,
  };
}

/** Backend role → frontend dashboard path */
export const ROLE_HOME: Record<ServerRole, string> = {
  ADMIN: "/admin",
  OWNER: "/owner",
  TENANT: "/tenant",
};