import Image from "next/image";
import {useState, useEffect} from "react";

const ShimmerMessages = () => {
    const messages = [
        "Thinking...",
        "Loading...",
        "Generating response...",
        "Analyzing data...",
        "Building your project...",
        "Optimizing...",
        "Adding final touches...",
        "Almost done...",
    ]

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
        <div className="shimmer-message">
            {/* <Image src="/shimmer.png" alt="Loading..." width={40} height={40} /> */}
            <span>{currentMessage}</span>
        </div>
    );
}

export default ShimmerMessages;