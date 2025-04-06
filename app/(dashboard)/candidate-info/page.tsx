"use client";
import Image from "next/image";
import { Candidate } from "@/components/model/models";
import { fetchRequest } from "@/utils/database/fetch-request";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { JSX } from "react/jsx-runtime";
import { BriefcaseBusiness, CircleHelp, Landmark, ScrollText, Sparkles } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button"

import ChatSide from "@/components/chat-side";
import { ChatMessageHistory } from "@/utils/types";

interface DetailItem {
    icon: JSX.Element;
    value: string | number | undefined;
}
const CandidateInfo = () => {
    const searchParams = useSearchParams();
    const candidateId = searchParams.get("candidateId");

    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [chatHistory, setChatHistory] = useState<ChatMessageHistory[]>([])

    const detailsMap: DetailItem[] = [
        {
            icon: <Landmark size={20} />,
            value: candidate?.political_party
        },
        {
            icon: <BriefcaseBusiness size={20} />,

            value: candidate?.personal_info[0].profession
        },
        // {
        //     icon: <Vote size={20} />,
        //     value: candidate?.cand
        // },
    ]

    useEffect(() => {
        console.log(candidateId)
        const loadCandidate = async () => {
            console.log(candidate?.id)

            if (!candidateId) {
                setError("No candidate ID provided.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            const response = await fetchRequest("candidates");

            // console.log("Candidate:", JSON.stringify(response, null, 2));

            if (response.error) {
                setError("Failed to load candidates");
            } else if (response.Candidate) {
                const matchedCandidate = response.Candidate.find((c: Candidate) => c.id === candidateId);

                console.log(matchedCandidate)

                if (!matchedCandidate) {
                    setError("Candidate not found");
                }
                setCandidate(matchedCandidate || null);
            }

            setLoading(false);
        };

        loadCandidate();
    }, [candidateId]);

    // add skeleton

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="flex flex-grow">
            <div className="flex-col w-full p-4 bg-neutral-100">
                <div className="rounded-lg bg-white space-y-4 p-4">
                    <Image src={candidate?.image_url || ''} alt="Candidate Image" width={96} height={96} className="rounded-lg" />
                    <h2 className="font-bold text-xl">{candidate?.full_name}</h2>
                    <div className="space-y-2">
                        {detailsMap.map(({ icon, value }, index) =>
                            value ? (
                                <div
                                    key={index}
                                    className="flex items-center space-x-2 text-sm text-black"
                                >
                                    <span className="text-black">{icon}</span>
                                    <span>{value}</span>
                                </div>
                            ) : null
                        )}
                    </div>
                    <div className="flex flex-col bg-neutral-100 rounded-lg p-4 space-y-4">
                        <div className="flex flex-row items-center ">
                            <Sparkles size={20} />
                            <h1 className="font-bold text-lg ml-1">
                                AI Summary
                            </h1>
                        </div>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between items-center px-3 w-full py-3 rounded-lg bg-gray-100">
                            <div className="flex flex-row space-x-1">
                                <CircleHelp />
                                <p>May itatanong ka?</p>
                            </div>
                            <Button variant="outline" className="rounded-full flex flex-row space-x-2">
                                <Sparkles size={20} />
                                <p>Itanong Kay Yano</p>
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-start text-sm space-y-2">
                        <div className="flex flex-row items-center">
                            <div className="hidden md:flex">
                                <ScrollText size={20} />
                            </div>
                            <h1 className="text-lg font-bold md:ml-1">
                                Personal Info
                            </h1>
                        </div>
                        <p>Residence: {candidate?.personal_info[0].residence}</p>
                        <p>Birthplace: {candidate?.personal_info[0].birthplace}</p>
                        <p>
                            Birthdate: {candidate?.personal_info[0].birthdate
                                ? new Date(candidate.personal_info[0].birthdate).toLocaleDateString()
                                : "N/A"}
                        </p>
                        <p>Age: {candidate?.personal_info[0].age_on_election_day}</p>
                        <p>Sex: {candidate?.personal_info[0].sex}</p>
                        <p>Civil Status: {candidate?.personal_info[0].civil_status}</p>
                        <p>Spouse: {candidate?.personal_info[0].spouse}</p>
                    </div>
                    <div className="flex flex-col items-start text-sm">
                        {/* <ScrollText size={30} /> */}
                        <h1 className="text-lg font-bold">
                            Credentials
                        </h1>

                        <div className="flex flex-col justify-start items-start text-sm space-y-2">
                            <p>Residence: {candidate?.personal_info[0].residence}</p>
                            <p>Birthplace: {candidate?.personal_info[0].birthplace}</p>
                            <p>
                                Birthdate: {candidate?.personal_info[0].birthdate
                                    ? new Date(candidate.personal_info[0].birthdate).toLocaleDateString()
                                    : "N/A"}
                            </p>
                            <p>Age: {candidate?.personal_info[0].age_on_election_day}</p>
                            <p>Sex: {candidate?.personal_info[0].sex}</p>
                            <p>Civil Status: {candidate?.personal_info[0].civil_status}</p>
                            <p>Spouse: {candidate?.personal_info[0].spouse}</p>
                        </div>
                    </div>
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
};

export default CandidateInfo; 
