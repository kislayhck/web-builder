"use client";
import { ResizableHandle,ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable"
import { MessageContainer } from "../components/messages-container";
import { Suspense, useState } from "react";
import { FragmentWeb } from "../components/fragment-web";
import { Fragment } from "@/generated/prisma";

interface Props {
    projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);

    return (
        <div>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                    defaultSize={35}
                    minSize={20}
                    className="flex flex-col min-h-0"
                >
                    <Suspense fallback={<div>Loading Messages...</div>}>
                        <MessageContainer
                            activeFragment={activeFragment}
                            projectId={projectId}
                            setActiveFragment={setActiveFragment}
                        />
                    </Suspense>
                </ResizablePanel>
                <ResizableHandle withHandle/>
                <ResizablePanel
                    defaultSize={65}
                    minSize={50}
                >
                    {!!activeFragment && <FragmentWeb data={activeFragment} />}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}