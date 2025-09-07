"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [value, setValue] = useState("");
  const trpc = useTRPC();
  
  const { data: messages } = useQuery(trpc.messages.getMany.queryOptions());
  
  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: () => {
      toast.success("Message sent!");
    }
  }));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button 
        disabled={createMessage.isPending} 
        onClick={() => createMessage.mutate({ value: value })}>
          Send Message
      </Button>
      {JSON.stringify(messages, null, 2)}
    </div>
  );
}
