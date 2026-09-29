import type { ReactNode } from "react";
import { Navbar } from "./navbar";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <section className="bg-background">

        <main className="mx-auto">
            <Navbar />
          <section className="mt-10 px-6 md:px-16">
              {children}
          </section>
        </main>
    </section>
  );
}
