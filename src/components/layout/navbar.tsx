"use client";

import Link from "next/link";
import { DoorOpen, Menu } from "lucide-react";
import { PUBLIC_NAVBAR } from "./nav-config";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useAuthStore } from "@/store/auth-store";

function dashboardHome(role: string) {
  if (role === "admin") return "/admin";
  if (role === "owner") return "/owner";
  return "/tenant";
}

export function Navbar() {
    const user = useAuthStore((s) => s.user);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Brand Logo */}
                <div className="flex items-center shrink-0">
                    <Link href="/" className="flex items-center">
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
                            <DoorOpen className="h-4 w-4" />
                        </span>
                        <span className="font-display text-lg">Roomly</span>
                    </Link>
                </div>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-6">
                    <NavigationMenu className="">
                        <NavigationMenuList className="gap-1 w-full">
                            {PUBLIC_NAVBAR.map((item) => (
                                <NavigationMenuItem key={item.href}>
                                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                        <Link href={item.href}>{item.label}</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}

                            {!user ? (
                                <>
                                <NavigationMenuItem >
                                    <Link href="/login">
                                        <Button className="cursor-pointer px-5">
                                            Log In
                                        </Button>
                                    </Link>
                                </NavigationMenuItem>

                                <NavigationMenuItem >
                                    <Link href="/register" >
                                        <Button className="cursor-pointer px-5 bg-white text-black border border-black hover:text-white">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </NavigationMenuItem>
                                </>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <span className="hidden text-xs text-muted-foreground sm:inline">
                                        {user.email}
                                    </span>
                                    <NavigationMenuItem>
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={dashboardHome(user.role)}>Dashboard</Link>
                                        </Button>
                                    </NavigationMenuItem>
                                </div>
                            )}

                        </NavigationMenuList>
                    </NavigationMenu>
                </nav>

                {/* Mobile Dropdown Trigger */}
                <div className="flex md:hidden items-center">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="h-10 w-10">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="top" className="w-full pt-12 pb-6 px-6">
                            <SheetHeader className="text-left mb-4">
                                <SheetTitle className="text-sm text-center font-medium text-muted-foreground uppercase tracking-wider">
                                    Navigation
                                </SheetTitle>
                            </SheetHeader>

                            <div className="flex flex-col space-y-3">
                                {PUBLIC_NAVBAR.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="text-lg text-center font-medium py-2 px-3 rounded-md hover:bg-accent transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ))}

                                {!user ? (
                                    <div className="flex items-center gap-2">
                                        <Button asChild variant="ghost" size="sm"
                                            className="cursor-pointer w-full text-center py-5"
                                        >
                                        <Link href="/login">Sign in</Link>
                                        </Button>
                                        <Button asChild size="sm"
                                            className="cursor-pointer w-full text-center py-5 bg-white text-black border border-black hover:text-white"
                                        >
                                            <Link href="/register">Create account</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <span className="hidden text-xs text-muted-foreground sm:inline">
                                            {user.email}
                                        </span>
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={dashboardHome(user.role)}>Dashboard</Link>
                                        </Button>
                                    </div>
                                )}

                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

            </div>
        </header>
    );
}