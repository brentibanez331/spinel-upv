'use client'

import React, { useEffect, useState, useMemo } from "react";
import { fetchRequest } from "@/utils/database/fetch-request";
import { CandidateCard } from "@/components/ui/candidate-card";
import { Candidate } from "@/components/model/models";
import ChatSide from "@/components/chat-side";
import { ChatMessageHistory } from "@/utils/types";

import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Loader from "@/components/loader/loader";

export default function UserDashboard() {
    const [isFetching, setIsFetching] = useState<boolean>(true)
    const [candidates, setCandidates] = useState<Candidate[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

    const [suggestions, setSuggestions] = useState<string[]>([])
    const [chatHistory, setChatHistory] = useState<ChatMessageHistory[]>([])

    // Load candidates on component mount
    useEffect(() => {
        const loadCandidates = async () => {
            setIsFetching(true)
            try {
                const { Candidate, error } = await fetchRequest("candidates");
                if (error) {
                    setError("Failed to load candidates");
                } else {
                    setCandidates(Candidate);
                    setIsFetching(false)
                }
            } catch (err) {
                setError("An error occurred while fetching candidates");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadCandidates();
    }, []);

    // Set up chat when a candidate is selected
    useEffect(() => {
        if (selectedCandidate) {
            const gender = selectedCandidate.personal_info?.[0]?.sex === 'M' ? 'his' : 'her';

            setChatHistory([{
                role: 'AI',
                message: `Nakita ko na interesado ka na malaman patungkol kay ${selectedCandidate.display_name}. Ano ang gusto mong malaman?`
            }]);

            setSuggestions([
                `Who is ${selectedCandidate.display_name}?`,
                `What are ${gender} current platforms?`,
                `What are some of ${gender} previous projects?`
            ]);
        }
    }, [selectedCandidate]);

    // Filter candidates based on search query using useMemo for performance
    const filteredCandidates = useMemo(() => {
        if (!candidates || candidates.length === 0) {
            return [];
        }

        if (!searchQuery || searchQuery.trim() === "") {
            return candidates;
        }

        const query = searchQuery.toLowerCase().trim();

        return candidates.filter(candidate => {
            // Search through multiple candidate fields
            return (
                // Name search
                candidate.display_name?.toLowerCase().includes(query) ||

                // Party search
                candidate.political_party?.toLowerCase().includes(query) ||

                // Position search (if available)
                (candidate.candidacy[0].position_sought && candidate.candidacy[0].position_sought.toLowerCase().includes(query))

                // // Location search (if available)
                // (candidate.location && candidate.location.toLowerCase().includes(query)) ||

                // // Bio search (if available)
                // (candidate.bio && candidate.bio.toLowerCase().includes(query))
            );
        });
    }, [candidates, searchQuery]);

    // Handle search query changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Render loading state
    if (loading) {
        return (
            <div className="flex flex-col space-y-4 h-full mt-10 p-4 w-full">
                <Skeleton className="w-[300px] h-10 rounded-xl" />
                <div className="flex flex-col gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="w-full h-24 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-grow sm:pr-96">
            <div className="flex flex-col space-y-4 h-full mt-10 bg-neutral-100 overflow-y-auto p-4 w-full rounded-xl py-6">
                <div className="relative fixed sticky top-0 left-0">
                    <Input
                        className="w-[300px] rounded-xl pl-10"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search by name, party, or position..."
                    />
                    <Search className="absolute top-2.5 left-2 text-neutral-300" size={20} />
                </div>

                <div className="flex w-full gap-4 flex-col">
                    {!isFetching ? (

                        filteredCandidates.length > 0 ? (
                            filteredCandidates.map((candidate) => (
                                <CandidateCard
                                    key={candidate.id}
                                    candidate={candidate}
                                    selectedCandidate={selectedCandidate}
                                    setSelectedCandidate={setSelectedCandidate}
                                />
                            ))
                        ) : (
                            <p>No Candidates found</p>
                        )


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