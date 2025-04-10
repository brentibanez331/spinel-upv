'use client'

import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { Search } from "lucide-react";
import { useState } from "react";

export default function MyFavoritesPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const supabase = createClient()

    const fetchLikedCandidates = async() => {
        const {data, error} = await supabase.from('ballot').select(``)
        console.log(data)
    }

    // Handle search query changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

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
                    {/* {!isFetching ? (

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
                    )} */}
                </div>
            </div>

            {/* <ChatSide
                candidate={selectedCandidate}
                suggestions={suggestions}
                setSuggestions={setSuggestions}
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
            /> */}
        </div>
    )
}