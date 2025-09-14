import { useState } from "react";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";

import { Fragment } from "@/generated/prisma";
import { Button } from "@/components/ui/button";


interface Props {
    data: Fragment
}

export function FragmentWeb({ data }: Props) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Header */}
            <div className="p-4 border-b border-border bg-card flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-card-foreground">{data.title}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Preview</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            const iframe = document.querySelector('iframe');
                            if (iframe) {
                                iframe.src = iframe.src; // Refresh iframe
                            }
                        }}
                        className="h-8 px-3"
                    >
                        <RefreshCcwIcon className="size-3 mr-1" />
                        Refresh
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(data.sandboxUrl, '_blank')}
                        className="h-8 px-3"
                    >
                        <ExternalLinkIcon className="size-3 mr-1" />
                        Open
                    </Button>
                </div>
            </div>
            
            {/* Iframe Container */}
            <div className="flex-1 relative bg-background">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                            <p className="text-sm text-muted-foreground">Loading preview...</p>
                        </div>
                    </div>
                )}
                <iframe 
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
                    src={data.sandboxUrl}
                    className="w-full h-full border-0"
                    onLoad={() => setIsLoading(false)}
                    onError={() => setIsLoading(false)}
                />
            </div>
        </div>
    );
}