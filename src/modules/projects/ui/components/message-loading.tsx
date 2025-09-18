import {useState, useEffect, useMemo} from "react";

const ShimmerMessages = () => {
    const messages = useMemo(() => [
        "Thinking...",
        "Loading...",
        "Generating response...",
        "Analyzing data...",
        "Building your project...",
        "Optimizing...",
        "Adding final touches...",
        "Almost done...",
    ], []);

    const [currentMessage, setCurrentMessage] = useState(messages[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessage((prev) => {
                const currentIndex = messages.indexOf(prev);
                return messages[(currentIndex + 1) % messages.length];
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [messages]);

    return (
        <div className="max-w-[80%] bg-muted border border-border rounded-lg rounded-bl-sm shadow-sm">
            <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-xs font-bold">AI</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground italic">{currentMessage}</p>
            </div>
        </div>
    );
}

export default ShimmerMessages;