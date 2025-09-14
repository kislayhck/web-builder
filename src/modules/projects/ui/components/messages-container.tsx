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
    
    // Check if we have a user message followed by a pending AI response
    const isWaitingForAIResponse = isLastMessageUser && messages.length > 0;

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Header */}
            <div className="p-4 border-b border-border bg-card">
                <h2 className="text-lg font-semibold text-card-foreground">Chat</h2>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
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
                {isWaitingForAIResponse && (
                    <div className="flex justify-start">
                        <ShimmerMessages />
                    </div>
                )}
            </div>
            
            {/* Message Form */}
            <div className="border-t border-border bg-card p-4">
                <MessageForm projectId={projectId} />
            </div>
        </div>
    );
}