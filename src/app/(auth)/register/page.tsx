"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Building2, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useRegister } from "@/hooks/use-auth";
import { registerSchema } from "@/schemas/auth.schema";

export default function RegisterPage() {
  const register = useRegister();
  const [role, setRole] = useState<"OWNER" | "TENANT">("TENANT");
  const [values, setValues] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = registerSchema.safeParse({ ...values, role });
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    register.mutate(result.data);
  }

  return (
    <div>
      <p className="font-mono-plan text-xs uppercase tracking-wide text-muted-foreground">Create account</p>
      <h1 className="mt-2 font-display text-3xl">Join Roomly</h1>
      <p className="mt-2 text-sm text-muted-foreground">Tell us how you'll use the platform.</p>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setRole("TENANT")}
          className={cn(
            "flex flex-col items-start gap-2 rounded-md border px-4 py-3 text-left transition-colors",
            role === "TENANT" ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
          )}
        >
          <DoorOpen className="h-4 w-4" />
          <span className="text-sm font-medium">I'm a tenant</span>
          <span className="text-xs text-muted-foreground">Looking for a room</span>
        </button>
        <button
          type="button"
          onClick={() => setRole("OWNER")}
          className={cn(
            "flex flex-col items-start gap-2 rounded-md border px-4 py-3 text-left transition-colors",
            role === "OWNER" ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
          )}
        >
          <Building2 className="h-4 w-4" />
          <span className="text-sm font-medium">I'm an owner</span>
          <span className="text-xs text-muted-foreground">Listing a property</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={values.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={values.password}
              onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
            />
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">Confirm</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={(e) => setValues((v) => ({ ...v, confirmPassword: e.target.value }))}
            />
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
          </div>
        </div>

        {register.isError && <p className="text-sm text-destructive">{(register.error as Error).message}</p>}

        <Button type="submit" className="mt-2" disabled={register.isPending}>
          {register.isPending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
