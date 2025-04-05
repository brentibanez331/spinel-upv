import { Send } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChatMessageHistory } from "@/utils/types";

interface ChatSideProps {
    suggestions: string[]
    chatHistory: ChatMessageHistory[]
    setChatHistory: (value: ChatMessageHistory[]) => void
}

export default function ChatSide({ suggestions, chatHistory, setChatHistory }: ChatSideProps) {

    const promptSearch = async (question: string) => {
        const response = await fetch('/api/search-candidate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ input: question })
        })

        const rawResponse = await response.json();

        setChatHistory([...chatHistory, { role: 'AI', message: rawResponse.data }])
    }

    return (
        <div className="w-[370px] flex flex-col px-4 py-10 fixed right-0 h-screen">
            <div>Chat</div>
            <div className="flex-grow flex flex-col-reverse w-full my-8 rounded-xl">
                {chatHistory && chatHistory.map((message, index) => (
                    <div key={index}>
                        {message.role === 'AI' ? (
                            <div></div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                ))}
                <div className="flex w-full items-end flex-col space-y-2">
                    {suggestions && suggestions.map((suggestion) => (
                        <Button
                            key={suggestion}
                            onClick={() => promptSearch(suggestion)}
                            className="text-xs rounded-full !h-8 items-end justify-end w-auto hover:border-blue-500 transition" variant={'outline'}>
                            {suggestion}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="relative">
                <Textarea placeholder="Ilapag ang iyong mga tanong..." />
                <Send className="absolute right-4 bottom-4 cursor-pointer" />

            </div>
        </div>
    )
}