"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter(); 
  const [value, setValue] = useState("");
  const trpc = useTRPC();
  

  const createProject = useMutation(trpc.projects.create.mutationOptions({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      router.push(`/projects/${data.id}`);
    }
  }));


  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-background/80 text-foreground antialiased">
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          <Image src={"https://uxccelerate.ai/logo.png"} width={140} height={40} alt="Logo" />
        </Link>

        <nav className="hidden md:flex gap-6 text-muted-foreground">
          <Link href="#" className="hover:text-foreground">Product</Link>
          <Link href="#" className="hover:text-foreground">Resources</Link>
          <Link href="#" className="hover:text-foreground">Pricing</Link>
          <Link href="#" className="hover:text-foreground">Enterprise</Link>
        </nav>

        <div className="hidden md:block">
          <Button className="bg-[var(--brand)] text-black hover:brightness-95">Start Building</Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <section className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight">
            Let&apos;s make your dream a <span className="text-[var(--brand)]">reality.</span>
            <br />
            Right now.
          </h1>
          <p className="mt-6 text-muted-foreground">
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
                  className="flex-1 bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:ring-0"
                />

                <Button
                  disabled={createProject.isPending} 
                  onClick={() => createProject.mutate({ value: value })}
                  className="bg-primary text-primary-foreground px-4 py-3 rounded-xl hover:bg-primary/90"
                  aria-label="Send"
                >
                  ➜
                </Button>
              </div>
            </div>

            <div className="mt-6 text-muted-foreground text-sm">
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
                    className="px-4 py-2 rounded-full border border-border text-foreground hover:bg-muted/50"
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
