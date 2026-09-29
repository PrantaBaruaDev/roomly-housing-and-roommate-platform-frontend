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

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            {/* Added w-full to ensure flex justify-between works on mobile */}
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Brand Logo - Fixed visibility & contrast */}
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

                                <div>
                                    <Link href="/login" className="text-center">
                                        <Button className="cursor-pointer w-full text-center py-5">
                                            Sign In
                                        </Button>
                                    </Link>
                                </div>

                                <div>
                                    <Link href="/register" >
                                        <Button className="cursor-pointer w-full text-center py-5 bg-white text-black border border-black hover:text-white">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

            </div>
        </header>
    );
}