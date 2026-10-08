export const PUBLIC_ROUTES = [
  "/",
  "/browse",
];

export const AUTH_ROUTES = [
  "/login",
  "/register",
];

export const ROLE_BASED_ROUTES: Record<string, string[]> = {
  "/admin": ["ADMIN"],
  "/owner": ["OWNER"],
  "/tenant": ["TENANT"],
};

export const ROLE_HOME: Record<string, string> = {
  ADMIN: "/admin",
  OWNER: "/owner",
  TENANT: "/tenant",
};

export const FALLBACK_HOME = "/";