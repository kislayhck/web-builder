import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getQueryClient, trpc } from "@/trpc/servers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Image from "next/image";
import Client from "./client";

export default  async function Home() {
  const queeryClient = getQueryClient();
  void queeryClient.prefetchQuery(trpc.createAI.queryOptions({ prompt: "world" }));
  
  return (
    <HydrationBoundary state={dehydrate(queeryClient)}>
     <Suspense fallback={<div>Loading...</div>}>
        <Client />
     </Suspense>
    </HydrationBoundary>
  );
}
