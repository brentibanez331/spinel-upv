"use client"


import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { ChatMessageHistory } from "@/utils/types";
import { Textarea } from "./ui/textarea";
import { Ellipsis, Send } from "lucide-react";
import Image from "next/image";
import { Separator } from "./ui/separator";
import Link from "next/link";
import Markdown from "react-markdown";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";


type SourceType = {
    title: string
    url: string
}

export function Chat() {
    const [question, setQuestion] = useState<string>('')

    const [isGenerating, setIsGenerating] = useState<boolean>(false)
    const [chatHistory, setChatHistory] = useState<{ chat: ChatMessageHistory, sources: SourceType[] }[]>([{ chat: { role: 'AI', message: 'Mabuhay! Ako si Gabay. Handa akong sagutin ano man ang mga tanong mayroon ka sa botohan.' }, sources: [] }])

    const [isStreaming, setIsStreaming] = useState<boolean>(false)
    const [streamingIndex, setStreamingIndex] = useState<number>(0)
    const [currentStreamingText, setCurrentStreamingText] = useState<string>('')
    const [fullResponse, setFullResponse] = useState<string>('')

    useEffect(() => {
        if (isStreaming && streamingIndex < fullResponse.length) {
            const typingSpeed = 0.5; // Much faster typing speed (5ms per character)

            const typingTimeout = setTimeout(() => {
                // Update by chunks for faster appearance
                const chunkSize = 3; // Process multiple characters at once
                const newIndex = Math.min(streamingIndex + chunkSize, fullResponse.length);

                setStreamingIndex(newIndex);

                // Update the last message in chat history with current text
                const updatedHistory = [...chatHistory];
                if (updatedHistory.length > 0) {
                    updatedHistory[updatedHistory.length - 1].chat.message = fullResponse.substring(0, newIndex);
                    setChatHistory(updatedHistory);
                }
            }, typingSpeed);

            return () => clearTimeout(typingTimeout);
        } else if (isStreaming && streamingIndex >= fullResponse.length) {
            setIsStreaming(false);
        }
    }, [isStreaming, streamingIndex, fullResponse, chatHistory]);

    const promptSearch = async (question: string) => {
        const updatedHistory = [...chatHistory, { chat: { role: 'user', message: question }, sources: [] }];
        setChatHistory(updatedHistory)
        setIsGenerating(true)

        const response = await fetch('/api/gabay-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ input: question })
        })

        const rawResponse = await response.json();

        console.log(rawResponse.data)

        // Start with empty message and begin streaming
        setFullResponse(rawResponse.data.summary);
        setChatHistory([...updatedHistory, { chat: { role: 'AI', message: '' }, sources: rawResponse.data.sources }]);
        setIsGenerating(false);
        setStreamingIndex(0);
        setCurrentStreamingText('');
        setIsStreaming(true);
        setIsGenerating(false);
    }

    return (
        <div className="rounded-2xl border h-full flex flex-col">
            <div className="p-6 overflow-y-auto flex-grow h-1/2 space-y-4">
                {chatHistory.map(({ chat, sources }, index) => (

                    <div key={index} className="">
                        {chat.role === 'AI' ? (
                            <div className="flex-col border p-4 space-y-4 rounded-lg shadow-sm ">
                                <div className="items-center space-x-2 flex">
                                    <Image src="/logo.png" alt="" width={30} height={30} />
                                    <p className="text-xl font-bold">Gabay</p>
                                </div>
                                <Markdown>{chat.message}</Markdown>

                                {sources.length > 0 ? (
                                    <div className="space-y-1">
                                        <Separator className="mt-2" />
                                        <Accordion type="single" collapsible>
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger className="font-bold">Sources</AccordionTrigger>
                                                <AccordionContent className="space-y-1">
                                                    {sources.map((source, index) => (
                                                        <div key={index} className="space-x-2 flex items-center">
                                                            <p>↗</p>
                                                            <Link href={source.url} target="_blank" className="hover:underline text-sm">{source.title}</Link>
                                                        </div>
                                                    ))}
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                    </div>
                                ) : (
                                    <></>
                                )}

                            </div>
                        ) : (
                            <div className="flex-col border p-4 space-y-4 rounded-lg shadow-sm ">
                                <div className="items-center space-x-2 flex">
                                    <Image src="/user.png" alt="" width={30} height={30} />
                                    <p className="text-xl font-bold">You</p>
                                </div>
                                <p>{chat.message}</p>
                            </div>
                        )

                        }
                    </div>
                ))}
                {isGenerating && (
                    <div className="flex space-x-1 text-sm animate-pulse bg-neutral-100 rounded-2xl py-2 px-3">
                        <p>Thinking</p><Ellipsis className="text-neutral-500" />
                    </div>
                )}
            </div>

            <div className="relative m-4 flex space-x-2">
                <Textarea

                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ilapag ang iyong mga tanong..." />
                <Button className="h-full w-[100px]" onClick={() => {
                    if (question) {
                        promptSearch(question)
                        setQuestion("")
                    }
                }}>
                    <p>Send</p>
                    {/* <Send className="absolute right-4 bottom-4 cursor-pointer" /> */}
                </Button>


            </div>

        </div>
    )
}