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
        <div className="bg-blue-100 text-black p-2 rounded-md mb-2">
            <Card>
                <p>{content}</p>
            </Card>
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
        <button className={cn(
            "bg-white text-black p-2 rounded-md border mb-2",
            isActiveFragment ? "border-blue-500" : "border-gray-300",
        )} onClick={() => onFragmentClick(fragment)}>
            <Code2Icon className="inline-block mr-2" />
            <div>
                <h4 className="font-semibold">{fragment.title}</h4>
            </div>
            <div className="text-sm text-gray-500">
                Preview
            </div>
            <div>
                <ChevronRightIcon className="size-4"/>
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
        <div className={cn(
            "bg-gray-100 text-black p-2 rounded-md mb-2",
            type === "ERROR" && "bg-red-100 border border-red-400",
        )}>
            <div className="flex items-center gap-2 pl-2 mb-2">
                <span className="text-sm text-gray-500">Logo</span>
                <span className="text-sm text-gray-500">Vibe</span>
                <span className="text-sm text-gray-500">{
                    format(createdAt, "HH:mm 'on' MMM dd, yyyy")
                }</span>
                <span className="text-sm text-gray-500">{content}</span>
                {fragment && type === "RESULT" && (
                    <FragmentCard 
                        fragment={fragment} 
                        isActiveFragment={isActiveFragment} 
                        onFragmentClick={onFragmentClick} 
                    />
                )}
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
        <p>
            <UserMessage 
                content={content}
            />
        </p>
    );
}