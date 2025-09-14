import { useState } from "react";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";

import { Fragment } from "@/generated/prisma";
import { Button } from "@/components/ui/button";


interface Props {
    data: Fragment
}

export function FragmentWeb({ data }: Props) {
    return (
        <div>
            <div className="p-4 border-b flex justify-between items-center">
              <iframe 
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms"
                src={data.sandboxUrl}
              />
            </div>
        </div>
    );
}