'use client'

import React, { useEffect, useState } from "react";
import { fetchRequest } from "@/utils/database/fetch-request";
import { CandidateCard } from "@/components/ui/candidate-card";
import { Candidate } from "@/components/model/models";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserDashboard() {
    const [candidates, setCandidates] = useState<Candidate[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
        <div className="">
            <div className="flex gap-4 flex-col">
                {loading ? (
                    // Render skeleton while loading
                    Array.from({ length: 8 }).map((key, index) => (
                        <div key={index} className="flex flex-col shadow-lg rounded-lg p-4 ">
                            <div className="flex flex-row ">
                                <Skeleton className="w-24 h-24 rounded-lg" />
                                <div className="flex flex-col ml-2 w-[calc(100%-7rem)]">
                                    <Skeleton className="w-32 h-6 mb-2" />
                                    <div className="flex flex-row space-x-2">
                                        <Skeleton className="w-20 h-4 mb-2" />
                                        <Skeleton className="w-20 h-4 mb-2" />
                                    </div>
                                    <div className="flex flex-row gap-2 flex-wrap">
                                        <Skeleton className="w-32 h-5 " />
                                        <Skeleton className="w-24 h-5    " />
                                        <Skeleton className="w-20 h-5" />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-row justify-end items-center space-x-4'>
                                <Skeleton className="rounded-full w-[90px] h-9" />
                                <Skeleton className="rounded-full w-4 h-4" />
                            </div>
                        </div>
                    ))
                ) : (
                    // render actual cards
                    candidates && candidates.length > 0 ? (
                        candidates.map((candidate) => (
                            <CandidateCard
                                candidateId={candidate.candidacies?.[0].candidate_id}
                                key={candidate.id}
                                imgUrl={candidate.image_url}
                                displayName={candidate.display_name}
                                politicalParty={candidate.political_party || "N/A"}
                                positionSought={candidate.candidacies?.[0]?.position_sought || "Unknown"}
                                sex={candidate.personal_info?.sex || "Not Specified"}
                                profession={candidate.personal_info?.profession || "Not Specified"}
                                periodOfResidence={candidate.candidacies?.[0]?.period_of_residence || "Not Specified"}
                            />
                        ))
                    ) : (
                        <div>No candidates available.</div>
                    )
                )}
            </div>
        </div>
    );
}
