"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/use-auth";
import { loginSchema } from "@/schemas/auth.schema";
import { Building2, DoorOpen, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_ACCOUNTS = [
  {
    role: "Admin" as const,
    email: "testeradmin@gmail.com",
    password: "Tester@admin12345",
    icon: ShieldCheck,
    accent: "text-blueprint",
  },
  {
    role: "Owner" as const,
    email: "testerowner@gmail.com",
    password: "Tester@owner12345",
    icon: Building2,
    accent: "text-brass",
  },
  {
    role: "Tenant" as const,
    email: "tester.tenant@gmail.com",
    password: "Tester@subscribercustomer12345",
    icon: DoorOpen,
    accent: "text-moss",
  },
];

export default function LoginPage() {
  const login = useLogin();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = loginSchema.safeParse(values);
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrors({});
    login.mutate(result.data);
  }

  function fillDemo(email: string, password: string) {
    setValues({ email, password });
    setErrors({});
  }

  return (
    <div>
      <p className="font-mono-plan text-xs uppercase tracking-wide text-muted-foreground">Sign in</p>
      <h1 className="mt-2 font-display text-3xl">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter your details to reach your dashboard.
      </p>

      <div className="mt-6 rounded-lg border border-dashed border-border bg-secondary/30 p-3">
          <p className="mb-2 font-mono-plan text-[10px] uppercase tracking-wide text-muted-foreground">
            Demo accounts
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((acct) => {
              const Icon = acct.icon;
              const active =
                values.email === acct.email && values.password === acct.password;
              return (
                <button
                  key={acct.role}
                  type="button"
                  onClick={() => fillDemo(acct.email, acct.password)}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-md border bg-background px-2.5 py-2 text-left text-xs transition-colors hover:border-primary/40 hover:bg-primary/5",
                    active ? "border-primary bg-primary/10" : "border-border",
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", acct.accent)} />
                  <span className="font-medium">{acct.role}</span>
                </button>
              );
            })}
          </div>
        </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={values.password}
            onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        {login.isError && (
          <p className="text-sm text-destructive">{(login.error as Error).message}</p>
        )}

        <Button type="submit" className="mt-2" disabled={login.isPending}>
          {login.isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Roomly?{" "}
        <Link href="/register" className="font-medium text-foreground hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
