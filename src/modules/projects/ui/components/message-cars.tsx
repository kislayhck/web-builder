import { Card } from "@/components/ui/card";
import { Fragment, MessageRole, MessageType } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";
import { ChevronRightIcon, Code2Icon } from "lucide-react";


interface UserMessageProps {
    content: string;
}  

const UserMessage = ({ content }: UserMessageProps) => {
    return (
        <div className="flex justify-end">
            <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-br-sm max-w-[80%] shadow-sm">
                <p className="text-sm">{content}</p>
            </div>
        </div>
    );
}

interface FragmentCardProps {
    fragment: Fragment;
    isActiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
}

const FragmentCard = ({ fragment, isActiveFragment, onFragmentClick }: FragmentCardProps) => {
    return (
        <button 
            className={cn(
                "w-full mt-2 p-3 rounded-lg border text-left transition-all hover:shadow-md",
                isActiveFragment 
                    ? "border-primary bg-primary/10 shadow-sm" 
                    : "border-border bg-card hover:border-primary/50",
            )} 
            onClick={() => onFragmentClick(fragment)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Code2Icon className="size-4 text-primary" />
                    <div>
                        <h4 className="font-medium text-sm text-card-foreground">{fragment.title}</h4>
                        <p className="text-xs text-muted-foreground">Click to preview</p>
                    </div>
                </div>
                <ChevronRightIcon className="size-4 text-muted-foreground" />
            </div>
        </button>
    );
}

interface AssistantMessageProps {
    content: string;
    fragment: Fragment | null;
    createdAt: Date;
    isActiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
    type: MessageType;
}


const AssistantMessage = ({ content, fragment, createdAt, isActiveFragment, onFragmentClick, type }: AssistantMessageProps) => {
    return (
        <div className="flex justify-start">
            <div className={cn(
                "max-w-[80%] rounded-lg rounded-bl-sm shadow-sm",
                type === "ERROR" 
                    ? "bg-destructive/10 border border-destructive/50" 
                    : "bg-muted border border-border"
            )}>
                <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                            <span className="text-primary-foreground text-xs font-bold">AI</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {format(createdAt, "HH:mm")}
                        </span>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{content}</p>
                    {fragment && type === "RESULT" && (
                        <FragmentCard 
                            fragment={fragment} 
                            isActiveFragment={isActiveFragment} 
                            onFragmentClick={onFragmentClick} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

interface MessageCardProps {
    content: string;
    role: MessageRole;
    fragment: Fragment | null;
    createdAt: Date;
    isActiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
    type: MessageType;
} 

export const MessageCard = ({ content, role, fragment, createdAt, isActiveFragment, onFragmentClick, type }: MessageCardProps) => {
    
    if(role === 'ASSISTANT') {
        return (
            <AssistantMessage 
                content={content}
                fragment={fragment}
                createdAt={createdAt}
                isActiveFragment={isActiveFragment}
                onFragmentClick={onFragmentClick}
                type={type}
            />
        )
    }
    
    return (
        <UserMessage 
            content={content}
        />
    );
}