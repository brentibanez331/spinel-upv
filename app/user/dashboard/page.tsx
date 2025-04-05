'use client'

import React, { useEffect, useState } from "react";
import { fetchRequest } from "@/utils/database/fetch-request";
import { CandidateCard } from "@/components/ui/candidate-card";
import { Candidate } from "@/components/model/models";
import ChatSide from "@/components/chat-side";
import { ChatMessageHistory } from "@/utils/types";


import { Skeleton } from "@/components/ui/skeleton";

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
        <div className="flex">
            <div className="flex flex-grow bg-neutral-100 p-4 rounded-xl py-10">
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
                        <div>No candidates available.</div>
                    )}
                </div>
            </div>
            <ChatSide
                suggestions={suggestions}
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
            />
        </div>
    );
}
