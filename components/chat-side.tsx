import { Send } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChatMessageHistory } from "@/utils/types";
import { Candidate } from "./model/models";

interface ChatSideProps {
    candidate: Candidate | null
    suggestions: string[],
    setSuggestions: (value: string[]) => void
    chatHistory: ChatMessageHistory[]
    setChatHistory: (value: ChatMessageHistory[]) => void
}

export default function ChatSide({ candidate, suggestions, setSuggestions, chatHistory, setChatHistory }: ChatSideProps) {
    const promptSearch = async (question: string) => {
        setSuggestions([])
        const updatedHistory = [...chatHistory, { role: 'user', message: question }];
        setChatHistory(updatedHistory)
        
        if (candidate) {
            question = question.replace('his', `${candidate.display_name}'s`)
            question = question.replace('her', `${candidate.display_name}'s`)

            console.log(question)

            const response = await fetch('/api/search-candidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ input: question })
            })

            const rawResponse = await response.json();

            console.log(rawResponse.data)

            setChatHistory([...updatedHistory, { role: 'AI', message: rawResponse.data.answer }])

            setSuggestions(rawResponse.data.questions)
        }
    }

    return (
        <div className="w-[380px] flex flex-col px-4 py-10 fixed right-0 h-screen">
            <div>Chat</div>
            <div className="h-[500px] overflow-y-auto py-3 flex flex-col-reverse w-full my-8 rounded-xl">
                <div className="flex w-full items-end flex-col space-y-2 pt-4">
                    {suggestions && suggestions.map((suggestion) => (
                        <Button
                            key={suggestion}
                            onClick={() => promptSearch(suggestion)}
                            className="w-auto text-xs rounded-xl text-end items-center hover:border-blue-500 transition whitespace-normal break-words h-auto py-2" variant={'outline'}>
                            {suggestion}
                        </Button>
                    ))}
                </div>
                <div className="space-y-3">
                    {chatHistory && chatHistory.map((chatMessage, index) => (
                        <div key={index} className="text-sm">
                            {chatMessage.role === 'AI' ? (
                                <div className="bg-neutral-100 rounded-2xl py-2 px-3">
                                    {chatMessage.message}
                                </div>
                            ) : (
                                <div className="w-full flex justify-end">
                                    <div className="bg-blue-500 text-white rounded-2xl py-2 px-3 w-5/6">
                                        {chatMessage.message}
                                    </div>
                                </div>
                            )}
                        </div>
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