"use client"

import { Message, useChat } from "@ai-sdk/react";
import { ChatBubble } from "./chat-bubble";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { initialMessages } from "@/lib/utils";
import { Spinner } from "./ui/spinner";

export function Chat() {
    const { messages, input, handleInputChange, handleSubmit, status } = useChat({
        api: '/api/chat',
        initialMessages: initialMessages
    });

    return (
        <div className="rounded-2xl border h-full flex flex-col">
            <div className="p-6 overflow-y-auto flex-grow h-1/2">
                {messages.map(({ id, role, content }: Message, index) => (
                    <ChatBubble
                        key={id}
                        role={role}
                        content={content}
                        sources={[]}
                    />
                ))}
            </div>

            <form onSubmit={handleSubmit} className="p-4 flex clear-both h-[100px]">
                <Input
                    onChange={handleInputChange}
                    value={input}
                    placeholder="Itanong mo kay Gabay..."
                    className="mr-2" />
                <Button type="submit" className="w-24">
                    {status === "streaming" ? <Spinner/> : "Ask"}
                </Button>
            </form>

        </div>
    )
}