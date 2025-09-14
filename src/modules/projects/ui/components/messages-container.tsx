import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCard } from "./message-cars";
import MessageForm from "./message-form";
import ShimmerMessages from "./message-loading";
import { Fragment } from "@/generated/prisma";
import { useEffect } from "react";

interface Props {
    projectId: string;
    activeFragment: Fragment | null;
    setActiveFragment: (fragment: Fragment | null) => void;
}

export const MessageContainer = ({ projectId, activeFragment, setActiveFragment }: Props) => {

    const trpc = useTRPC();
    const { data: messages } = useSuspenseQuery(trpc.messages.getMany.queryOptions({
       projectId: projectId
    },{
        refetchInterval: 5000,
    }))

    // useEffect(() => {
    //     const lastAssistantMessage = messages.findLast(
    //         (msg) => msg.role === 'ASSISTANT'
    //     );

    //     if (lastAssistantMessage) {
    //         setActiveFragment(lastAssistantMessage.fragment);
    //     }


    // }, [messages, setActiveFragment]);
  
    const lastMessage = messages[messages.length - 1];
    const isLastMessageUser = lastMessage?.role === 'USER';

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold">Messages</h2>
            <div className="mt-2">
                {messages?.map((message) => (
                    <MessageCard
                        key={message.id}
                        content={message.content}
                        role={message.role}
                        fragment={message.fragment}
                        createdAt={message.createdAt}
                        isActiveFragment={activeFragment?.id === message.fragment?.id}
                        onFragmentClick={() => setActiveFragment(message.fragment)}
                        type={message.type}
                    />
                ))}
                {isLastMessageUser && <ShimmerMessages />}
            </div>
            <MessageForm projectId={projectId} />
        </div>
    );
}