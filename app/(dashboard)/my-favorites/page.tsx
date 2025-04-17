'use client';

import React, { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Loader from "@/components/loader/loader";
import { CandidateCard } from "@/components/ui/candidate-card";
import { Candidate } from "@/components/model/models";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { fetchLikedRequest } from "@/utils/database/fetched-liked-request";
import ChatSide from "@/components/chat-side";
import { ChatMessageHistory } from "@/utils/types";
import { load } from "cheerio";

export default function MyFavoritesPage() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [likedCandidates, setLikedCandidates] = useState<Candidate[]>([]);
    const [candidates, setCandidates] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

    const [suggestions, setSuggestions] = useState<string[]>([])
    const [chatHistory, setChatHistory] = useState<ChatMessageHistory[]>([])

    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchLikedCandidates = async () => {
            if (!user) return;

            setLoading(true);
            const { data, error } = await supabase
                .from("ballot")
                .select("*")
                .eq("user_id", user.id)
                .eq("status", "saved")

            if (error) {
                console.error("Error fetching ballots:", error);
                setError("Failed to fetch liked candidates.");
                setLoading(false);
                return;
            }

            const likedIds = data?.map((item) => item.candidate_id) || [];

            try {
                const response = await fetchLikedRequest("candidates", likedIds);

                if (response.error) {
                    console.error("Error fetching candidates:", response.error);
                    setError("Failed to fetch candidate details.");
                    setLoading(false);
                    return;
                }


                setLikedCandidates(response.Candidate || []);
            } catch (e) {
                console.error("Error fetching candidate details:", e);
                setError("An error occurred while fetching candidate details.");
            } finally {
                setLoading(false);
            }
        };

        fetchLikedCandidates();
    }, [user]);
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


    const filteredCandidates = useMemo(() => {
        if (!likedCandidates || likedCandidates.length === 0) {
            return [];
        }

        if (!searchQuery || searchQuery.trim() === "") {
            return likedCandidates;
        }

        const query = searchQuery.toLowerCase().trim();

        return likedCandidates.filter(candidate => {
            return (

                candidate.display_name?.toLowerCase().includes(query) ||

                candidate.political_party?.toLowerCase().includes(query) ||

                (candidate.candidacy[0]?.position_sought && candidate.candidacy[0].position_sought.toLowerCase().includes(query))

            );
        });
    }, [likedCandidates, searchQuery]); // Filter based on likedCandidates and searchQuery


    // Handle search query changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleUnsaveCandidate = (candidateId: string) => {
        // Remove the candidate from the frontend likedCandidates list
        setLikedCandidates((prevCandidates) =>
            prevCandidates.filter((candidate) => candidate.id !== candidateId)
        );
    };
    return (
        <div className="flex flex-grow sm:pr-96">
            <div className="flex flex-col space-y-4 h-full mt-10 bg-neutral-100 overflow-y-auto p-4 w-full rounded-xl py-6">
                <div className=" sticky top-0 left-0">
                    <Input
                        className="w-[300px] rounded-xl pl-10"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search by name, party, or position..."
                    />
                    <Search className="absolute top-2.5 left-2 text-neutral-300" size={20} />
                </div>

                <div className="flex w-full gap-4 flex-col">
                    {!loading ? (

                        filteredCandidates.length > 0 ? (
                            filteredCandidates.map((candidate) => (
                                <CandidateCard
                                    key={candidate.id}
                                    user={user}
                                    candidate={candidate}
                                    selectedCandidate={selectedCandidate}
                                    isPreviouslyLiked={likedCandidates.some((likedCandidate) => likedCandidate.id === candidate.id)}
                                    setSelectedCandidate={setSelectedCandidate}
                                    onUnsaveCandidate={handleUnsaveCandidate}
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
