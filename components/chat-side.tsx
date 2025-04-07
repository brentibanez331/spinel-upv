"use client"

import { Ellipsis, Send } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChatMessageHistory } from "@/utils/types";
import { Candidate } from "./model/models";
import { useState } from "react";
import Image from "next/image";

interface ChatSideProps {
    candidate: Candidate | null
    suggestions: string[],
    setSuggestions: (value: string[]) => void
    chatHistory: ChatMessageHistory[]
    setChatHistory: (value: ChatMessageHistory[]) => void
}

export default function ChatSide({ candidate, suggestions, setSuggestions, chatHistory, setChatHistory }: ChatSideProps) {
    const [question, setQuestion] = useState<string>('')
    const [isGenerating, setIsGenerating] = useState<boolean>(false)

    const promptSearch = async (question: string) => {
        setSuggestions([])
        const updatedHistory = [...chatHistory, { role: 'user', message: question }];
        setChatHistory(updatedHistory)
        setIsGenerating(true)

        if (candidate) {
            question = question.replace('his', `${candidate.display_name}'s`)
                .replace('her', `${candidate.display_name}'s`)
                .replace('', `${candidate.display_name}'s`)

            const tagalogPronounExists = question.includes('kanyang') || question.includes('kaniyang') || question.includes('kaniya')
            if(tagalogPronounExists){
                const newQuestion = question.replace('kanyang', '').replace('kaniyang', '').replace('kanya', '').replace('?', '')
                question = `${newQuestion} ni ${candidate.display_name}?`
            }

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
            setIsGenerating(false)

            setSuggestions(rawResponse.data.questions)
        }
    }

    return (
        <div className="w-[380px] bg-white flex flex-col px-4 py-10 fixed right-0 h-[94%]">
            <div className="flex space-x-4">
                <Image
                    src={"/logo.png"}
                    alt=""
                    width={30}
                    height={50} />
                <div className="flex flex-col justify-between">
                    <p className="font-bold text-xl">Gabay</p>
                    <p className="text-xs text-neutral-600">Ang iyong kasama ngayong botohan</p>
                </div>

            </div>
            {candidate ? (
                <div className="h-[500px] overflow-y-auto py-3 flex flex-col-reverse w-full my-8 rounded-xl">

                    <div className="flex w-full items-end flex-col space-y-2 pt-4">

                        {suggestions && suggestions.map((suggestion) => (
                            <Button
                                key={suggestion}
                                onClick={() => promptSearch(suggestion)}
                                className="w-auto text-xs rounded-xl text-end items-center hover:border-blue-500 transition whitespace-normal break-words h-auto py-2" variant={'outline'}>
                                {/* Suggestion displays should be translated on render */}
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
                        {isGenerating && (
                            <div className="flex space-x-1 text-sm animate-pulse bg-neutral-100 rounded-2xl py-2 px-3">
                                 <p>Thinking</p><Ellipsis className="text-neutral-500"/>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-neutral-100 rounded-2xl py-2 px-3 mt-10 text-sm">
                    Kumusta! Ako si Gabay. Narito ako ngayon para sagutin kahit anong mga tanong meron ka para sa mga kandidato.
                    <br />
                    <br />
                    Matutulungan kita sa masusunod:
                    <br />
                </div>
            )}

            {candidate ? (
                <div className="relative">
                    <Textarea

                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ilapag ang iyong mga tanong..." />
                    <Send onClick={() => {
                        if (question) {
                            promptSearch(question)
                            setQuestion("")
                        }

                    }} className="absolute right-4 bottom-4 cursor-pointer" />

                </div>
            ) : (
                <></>
            )}

        </div>
    )
}