'use client'

import React, { useEffect, useState } from "react";
import { fetchRequest } from "@/utils/database/fetch-request";
import { CandidateCard } from "@/components/ui/candidate-card";
import { Candidate } from "@/components/model/models";
import ChatSide from "@/components/chat-side";
import { ChatMessageHistory } from "@/utils/types";


import { Skeleton } from "@/components/ui/skeleton";
import Loader from "@/components/loader/loader";

export default function UserDashboard() {
    const [candidates, setCandidates] = useState<Candidate[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

    const [suggestions, setSuggestions] = useState<string[]>([])
    const [chatHistory, setChatHistory] = useState<ChatMessageHistory[]>([])

    useEffect(() => {
        if (selectedCandidate) {
            const gender = selectedCandidate.personal_info[0].sex === 'M' ? 'his' : 'her'

            setChatHistory([{ role: 'AI', message: `Nakita ko na interesado ka na malaman patungkol kay ${selectedCandidate.display_name}. Ano ang gusto mong malaman?` }])

            setSuggestions([
                `Who is ${selectedCandidate.display_name}?`,
                `What are ${gender} current platforms?`,
                `What are some of ${gender} previous projects?`
            ])
        }

    }, [selectedCandidate])

    useEffect(() => {
        const loadCandidates = async () => {
            const { Candidate, error } = await fetchRequest("candidates"); // Assuming the table name is "candidates"
            if (error) {
                setError("Failed to load candidates");
            } else {
                setCandidates(Candidate);
            }
            setLoading(false);
        };

        loadCandidates();
    }, []); // Empty dependency array to run only on mount

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex h-screen flex-grow sm:pr-96">
            <div className="flex h-full mt-10 bg-neutral-100 overflow-y-auto p-4 w-full rounded-xl py-10">
                <div className="flex w-full gap-4 flex-col">
                    {candidates && candidates.length > 0 ? (
                        candidates.map((candidate) => (
                            <CandidateCard
                                key={candidate.id}
                                candidate={candidate}
                                selectedCandidate={selectedCandidate}
                                setSelectedCandidate={setSelectedCandidate}
                            />
                        ))
                    ) : (
                        <Loader />
                    )}
                </div>
            </div>
            <ChatSide

                candidate={selectedCandidate}
                suggestions={suggestions}
                setSuggestions={setSuggestions}
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
            />
        </div>
    );
}
