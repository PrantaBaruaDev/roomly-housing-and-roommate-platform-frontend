import { Navbar } from "@/components/layout/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans dark:bg-black">
      <main className="flex flex-1 w-full flex-col items-center justify-between bg-white dark:bg-black sm:items-start">
        {/* <Navbar /> */}
        <section className="px-16">
          <h1>Home Page</h1>
        </section>
      </main>
    </div>
  );
}
