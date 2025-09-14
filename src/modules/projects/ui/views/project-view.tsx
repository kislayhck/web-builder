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
        <div className="h-screen flex flex-col">
            <ResizablePanelGroup direction="horizontal" className="flex-1">
                <ResizablePanel
                    defaultSize={35}
                    minSize={25}
                    maxSize={60}
                    className="flex flex-col"
                >
                    <Suspense fallback={<div className="flex items-center justify-center h-full">Loading Messages...</div>}>
                        <MessageContainer
                            activeFragment={activeFragment}
                            projectId={projectId}
                            setActiveFragment={setActiveFragment}
                        />
                    </Suspense>
                </ResizablePanel>
                <ResizableHandle withHandle className="bg-gray-200 hover:bg-gray-300" />
                <ResizablePanel
                    defaultSize={65}
                    minSize={40}
                    className="flex flex-col"
                >
                    <div className="h-full flex flex-col">
                        {activeFragment ? (
                            <FragmentWeb data={activeFragment} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50">
                                <div className="text-center">
                                    <div className="text-lg font-medium mb-2">No Preview Selected</div>
                                    <div className="text-sm">Click on a preview button from the messages to view the generated content</div>
                                </div>
                            </div>
                        )}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}