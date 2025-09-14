import { z } from "zod";
import {toast} from "sonner";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {cn} from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";

interface Props {
    projectId: string;
}

const formSchema = z.object({
    value: z.string()
        .min(1 , {message: "Prompt is required"})
        .max(10000, {message: "Prompt is too long"}),
});


const MessageForm: React.FC<Props> = ({ projectId }) => {
    
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { value: "" }
    });
    
    const createMessage = useMutation(trpc.messages.create.mutationOptions({
        onSuccess: () => {
            form.reset();
            queryClient.invalidateQueries(
                trpc.messages.getMany.queryOptions({ projectId })
            );
        },
        onError: () => {
            toast.error("Failed to send message. Please try again.");
        }
    }))
    
    const onSubmit = async (values : z.infer<typeof formSchema>) => {
       await createMessage.mutateAsync({
            value: values.value,
            projectId
       });
    }
    
    const [isFocused, setIsFocused] = useState(false);
    const showUsage = false;
    const isPending = createMessage.isPending;
    const isButtonDisabled = isPending || !form.formState.isValid;


    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(
                    "flex items-center space-x-2 mt-4",
                    isFocused && "border-blue-500",
                    showUsage && "border-green-500"
                )}
            >
                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <TextareaAutosize
                            {...field}
                            disabled={isPending}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Type your message..."
                            minRows={2}
                            maxRows={4}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                    e.preventDefault();
                                    form.handleSubmit(onSubmit)(e);
                                }
                            }}
                        />
                    )}
                />
                <div className="flex gap-x-2 items-end">
                    <div className="text-[10px]">
                        <kbd>
                            <span>⌘ + Enter</span>
                        </kbd>
                    </div>
                    <Button 
                        disabled={isButtonDisabled}
                        className={cn(
                            "p-2 rounded-md",
                        )}
                    >
                        {isPending ? <Loader2Icon className="animate-spin size-4"/> : <ArrowUpIcon className="size-4"/>}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default MessageForm;