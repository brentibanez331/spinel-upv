// UserDashboard.tsx
'use client'

import React, { useEffect, useState } from "react";
import { fetchRequest } from "@/utils/database/fetch-request"; // Adjust the import based on the correct path
import { CandidateCard } from "@/components/ui/candidate-card";
import { Candidate } from "@/components/model/models";

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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex gap-4 flex-col">
            {candidates && candidates.length > 0 ? (
                candidates.map((candidate) => (
                    <CandidateCard
                        key={candidate.id}
                        imgUrl={candidate.image_url}
                        fullName={candidate.full_name}
                        politicalParty={candidate.political_party || "N/A"}
                        positionSought={candidate.candidacies?.[0]?.position_sought || "Unknown"}
                        sex={candidate.personal_info?.sex || "Not Specified"}
                        profession={candidate.personal_info?.profession || "Not Specified"}
                        birthplace={candidate.personal_info?.birthplace || "Not Specified"}
                        periodOfResidence={candidate.candidacies?.[0]?.period_of_residence || "Not Specified"}
                    />
                ))
            ) : (
                <div>No candidates available.</div>
            )}
        </div>
    );
}
