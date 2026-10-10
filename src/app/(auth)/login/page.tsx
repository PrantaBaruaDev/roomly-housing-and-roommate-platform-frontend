"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Building2, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin, roleHome } from "@/hooks/use-auth";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useEffect, useState } from "react";

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "testeradmin@gmail.com", password: "Tester@admin12345", icon: ShieldCheck, accent: "text-blueprint" },
  { role: "Owner", email: "testerowner@gmail.com", password: "Tester@owner12345", icon: Building2, accent: "text-brass" },
  { role: "Tenant", email: "tester.tenant@gmail.com", password: "Tester@subscribercustomer12345", icon: DoorOpen, accent: "text-moss" },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const login = useLogin();
  const user = useAuthStore((s) => s.user);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !user) return;
    const home =
      user.role === "ADMIN"
        ? "/admin"
        : user.role === "OWNER"
          ? "/OWNER"
          : "/tenant";
    if (window.location.pathname !== home) {
      router.replace(home);
    }
  }, [hydrated, user, router]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const email = watch("email");
  const password = watch("password");

  function fillDemo(nextEmail: string, nextPassword: string) {
    setValue("email", nextEmail, { shouldValidate: true });
    setValue("password", nextPassword, { shouldValidate: true });
  }

  function onSubmit(values: LoginFormValues) {
    login.mutate(values, {
      onSuccess: (session) => {
        const target = redirectTo || roleHome(session.data.user.role);
        router.push(target);
      },
    });
  }

  return (
    <div>
      <p className="font-mono-plan text-xs uppercase tracking-wide text-muted-foreground">
        Sign in
      </p>
      <h1 className="mt-2 font-display text-3xl">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter your details to reach your dashboard.
      </p>

      
      <div className="mt-6 rounded-lg border border-dashed border-border bg-secondary/30 p-3">
        <p className="mb-2 font-mono-plan text-[10px] uppercase tracking-wide text-muted-foreground">
          Demo accounts · dev only
        </p>
        <div className="grid grid-cols-3 gap-2">
          {DEMO_ACCOUNTS.map((acct) => {
            const Icon = acct.icon;
            const active = email === acct.email && password === acct.password;
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


      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
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
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {login.isError && (
          <p className="text-sm text-destructive">
            {(login.error as Error).message}
          </p>
        )}

        <Button
          type="submit"
          className="mt-2"
          disabled={isSubmitting || login.isPending}
        >
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