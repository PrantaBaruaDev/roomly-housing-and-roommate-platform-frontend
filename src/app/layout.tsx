import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT", "WONK"],
});

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono-plan",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Roomly — Find your room, know your roommates",
  description:"Manage properties, applications, payments, and invoices for shared housing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(fraunces.variable, plexMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
