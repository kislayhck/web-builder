"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const trpc = useTRPC();
  const [value, setValue] = useState("");

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onError: (err) => {
        toast.error(err.message || "Something went wrong");
      },

      onSuccess: (data) => {
        router.push(`/project/${data.id}`);
      }
    })
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-[rgba(10,13,24,0.95)] via-[rgba(12,16,28,0.9)] to-black text-foreground antialiased">
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          <img src={"https://uxccelerate.ai/logo.png"} width={140} height={40} alt="Logo" />
        </Link>

        <nav className="hidden md:flex gap-6 text-slate-300">
          <Link href="#" className="hover:text-white">Product</Link>
          <Link href="#" className="hover:text-white">Resources</Link>
          <Link href="#" className="hover:text-white">Pricing</Link>
          <Link href="#" className="hover:text-white">Enterprise</Link>
        </nav>

        <div className="hidden md:block">
          <Button className="bg-[var(--brand)] text-black hover:brightness-95">Start Building</Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <section className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight">
            Let's make your dream a <span className="text-[var(--brand)]">reality.</span>
            <br />
            Right now.
          </h1>
          <p className="mt-6 text-slate-300">
            Build fully-functional apps in minutes with just your words.
            No coding necessary.
          </p>
        </section>

        <section className="mt-12">
          <div className="mx-auto max-w-4xl bg-card/60 backdrop-blur-sm rounded-3xl p-8 ring-1 ring-border">
            <div className="flex gap-4 items-center">
              <div className="flex gap-3 items-center flex-1">
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="What do you want to build?"
                  className="flex-1 bg-transparent border-none text-foreground placeholder:text-slate-400 focus:ring-0"
                />

                <Button
                  onClick={() =>
                    createProject.mutate({ value: value })
                  }
                  disabled={createProject.isPending}
                  className="bg-[var(--accent)] text-black px-4 py-3 rounded-xl"
                  aria-label="Send"
                >
                  ➜
                </Button>
              </div>
            </div>

            <div className="mt-6 text-slate-400 text-sm">
              Not sure where to start? Try one of these:
              <div className="flex flex-wrap gap-3 mt-3">
                {[
                  "Reporting Dashboard",
                  "Gaming Platform",
                  "Onboarding Portal",
                  "Networking App",
                  "Room Visualizer",
                ].map((t) => (
                  <button
                    key={t}
                    onClick={() => setValue(t)}
                    className="px-4 py-2 rounded-full border border-slate-700 text-slate-200 hover:bg-slate-700/30"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
