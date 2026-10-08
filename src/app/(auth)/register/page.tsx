"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Building2, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/use-auth";
import { registerSchema, type RegisterFormValues } from "@/schemas/auth.schema";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const register_ = useRegister();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "TENANT",
    },
  });

  const role = watch("role");

  const onSubmit = (values: RegisterFormValues) => {
    register_.mutate(values);
  };

  return (
    <div>
      <p className="font-mono-plan text-xs uppercase tracking-wide text-muted-foreground">
        Create account
      </p>
      <h1 className="mt-2 font-display text-3xl">Join Roomly</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Tell us how you&apos;ll use the platform.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setValue("role", "TENANT", { shouldValidate: true })}
          className={cn(
            "flex flex-col items-start gap-2 rounded-md border px-4 py-3 text-left transition-colors",
            role === "TENANT" ? "border-primary bg-primary/5" : "border-border hover:bg-secondary",
          )}
        >
          <DoorOpen className="h-4 w-4" />
          <span className="text-sm font-medium">I&apos;m a tenant</span>
          <span className="text-xs text-muted-foreground">Looking for a room</span>
        </button>
        <button
          type="button"
          onClick={() => setValue("role", "OWNER", { shouldValidate: true })}
          className={cn(
            "flex flex-col items-start gap-2 rounded-md border px-4 py-3 text-left transition-colors",
            role === "OWNER" ? "border-primary bg-primary/5" : "border-border hover:bg-secondary",
          )}
        >
          <Building2 className="h-4 w-4" />
          <span className="text-sm font-medium">I&apos;m an owner</span>
          <span className="text-xs text-muted-foreground">Listing a property</span>
        </button>
      </div>
      {errors.role && (
        <p className="mt-1 text-xs text-destructive">{errors.role.message}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">Confirm</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {register_.isError && (
          <p className="text-sm text-destructive">
            {(register_.error as Error).message}
          </p>
        )}

        <Button
          type="submit"
          className="mt-2"
          disabled={isSubmitting || register_.isPending}
        >
          {register_.isPending ? "Creating account…" : "Create account"}
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