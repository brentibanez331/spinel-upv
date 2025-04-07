"use client";
import Image from "next/image";

import { Candidate } from "@/components/model/models";
import { fetchRequest } from "@/utils/database/fetch-request";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { JSX } from "react/jsx-runtime";
import { BriefcaseBusiness, IdCard, Landmark, Languages, RefreshCw, ScrollText, Sparkles } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import ChatSide from "@/components/chat-side";
import { ChatMessageHistory } from "@/utils/types";
import { motion } from "framer-motion";
// import { CircularProgressbar } from "react-circular-progressbar";
// import 'react-circular-progressbar/dist/styles.css';

interface DetailItem {
    icon: JSX.Element;
    value: string | number | undefined;
}
const CandidateInfo = () => {
    const params = useParams();
    const candidateId = params.id;

    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<string>('')
    const [isTagalog, setIsTagalog] = useState<boolean>(false)

    const [suggestions, setSuggestions] = useState<string[]>([])
    const [chatHistory, setChatHistory] = useState<ChatMessageHistory[]>([])

    const [experienceLevel, setExperienceLevel] = useState<number>(0)
    const [educationLevel, setEducationLevel] = useState<number>(0)
    const [advocacyLevel, setAdvocacyLevel] = useState<number>(0)


    const generateSummary = async () => {
        if (candidate) {
            const question = `Who is ${candidate.display_name}`

            const response = await fetch('/api/candidate-summary',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ input: question })
                }
            )

            const rawResponse = await response.json()
            setSummary(rawResponse.data)
        }
    }

    const generateScores = async () => {
        if (candidate) {
            const response = await fetch('/api/score-candidate',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ input: candidate.display_name })
                }
            )

            const rawResponse = await response.json()
            console.log("Candidate score: ", rawResponse)
            
            setExperienceLevel(rawResponse.data.experience)
            setEducationLevel(rawResponse.data.education)
            setAdvocacyLevel(rawResponse.data.platform)

        }


    }

    useEffect(() => {
        if (candidate) {

            const gender = candidate.personal_info[0].sex === 'M' ? 'his' : 'her'

            setChatHistory([{ role: 'AI', message: `Nakita ko na interesado ka na malaman patungkol kay ${candidate.display_name}. Ano ang gusto mong malaman?` }])

            setSuggestions([
                `Who is ${candidate.display_name}?`,
                `What are ${gender} current platforms?`,
                `What are some of ${gender} previous projects?`
            ])

            generateSummary()
            generateScores()
        }
    }, [candidate])


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
        console.log("credentials:", candidate?.credentials[0]?.education)
        // console.log(params)
        // console.log(candidateId)
        const loadCandidate = async () => {
            // console.log(candidate?.id)

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

                // console.log(matchedCandidate)

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
            <div className="flex-col w-full p-4 sm:pr-96">
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
                        <div className="flex justify-between">
                            <div className="flex items-center ">
                                <Sparkles size={20} />
                                <div className="font-bold text-lg ml-1 flex space-x-4">
                                    <p>AI Summary</p>
                                    {!summary && (
                                        <div className="flex items-center space-x-1">
                                            <RefreshCw size={14} className="text-neutral-500 animate-spin" /> <p className="text-sm font-normal text-neutral-500"> Generating</p>
                                        </div>
                                    )}

                                </div>
                            </div>
                            <Button size={"icon"} variant={"secondary"}>
                                <Languages className={`${isTagalog ? 'text-neutral-800' : 'text-neutral-400'} hover:text-neutral-800 transition`} />
                            </Button>
                        </div>
                        {summary ?
                            (<p>{summary}</p>) :
                            (<div className="flex flex-col space-y-2">
                                <motion.div
                                    className="h-4 w-full bg-neutral-200 rounded-md"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Skeleton />
                                </motion.div>
                                <motion.div
                                    className="h-4 w-11/12 bg-neutral-200 rounded-md"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                >
                                    <Skeleton />
                                </motion.div>
                                <motion.div
                                    className="h-4 w-10/12 bg-neutral-200 rounded-md"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <Skeleton />
                                </motion.div>
                            </div>)
                        }
                    </div>
                    {/* <div className="flex">
                        <div className="flex flex-col space-y-2">
                            <CircularProgressbar value={2} />
                            <p>Experience</p>
                        </div>
                    </div> */}
                    <div className="flex w-full justify-evenly py-10">
                        <div className="flex flex-col space-y-2 items-center">
                            <CircularProgressbar value={educationLevel} text={`${educationLevel}%`}  styles={{ root: { width: 100, height: 100 } }} />
                            <p>Education</p>
                        </div>
                        <div className="flex flex-col space-y-2 items-center">
                            <CircularProgressbar value={experienceLevel} text={`${experienceLevel}%`} styles={{ root: { width: 100, height: 100 } }} />
                            <p>Experience</p>
                        </div>
                        <div className="flex flex-col space-y-2 items-center">
                            <CircularProgressbar value={advocacyLevel} text={`${advocacyLevel}%`} styles={{ root: { width: 100, height: 100 } }} />
                            <p>Platform and Advocacy</p>
                        </div>
                    </div>
                    {/* <div className="flex flex-col">
                        <div className="flex flex-row justify-between items-center px-3 w-full py-3 rounded-lg bg-gray-100">
                            <div className="flex flex-row space-x-1">
                                <CircleHelp />
                                <p>May itatanong ka?</p>
                            </div>
                            <Button variant="outline" className="rounded-full flex flex-row space-x-2">
                                <Sparkles size={20} />
                                <p>Itanong kay Gabay</p>
                            </Button>
                        </div>
                    </div> */}
                    {/* <div className="flex flex-col justify-start items-start text-sm space-y-2">
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
                    </div> */}
                    <div className="space-y-4 pt-4">
                        <div className="flex flex-row items-center ">
                            <ScrollText size={30} className="mr-2" />
                            <h1 className="text-lg font-bold">
                                Personal Info
                            </h1>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-4 text-sm">
                            <p className="font-semibold">Residence</p>
                            <div className="space-y-1">
                                {candidate?.personal_info[0].residence || 'N/A'}
                            </div>
                            <p className="font-semibold">Birthplace</p>
                            <div className="space-y-1">
                                {candidate?.personal_info[0].birthplace || 'N/A'}
                            </div>
                            <p className="font-semibold">Birthdate</p>
                            <div className="space-y-1">
                                {candidate?.personal_info[0].birthdate
                                    ? new Date(candidate.personal_info[0].birthdate).toLocaleDateString()
                                    : "N/A"}
                            </div>
                            <p className="font-semibold">Age</p>
                            <div className="space-y-1">
                                {candidate?.personal_info[0].age_on_election_day || 'N/A'}
                            </div>
                            <p className="font-semibold">Sex</p>
                            <div className="space-y-1">
                                {candidate?.personal_info[0].sex || 'N/A'}
                            </div>
                            <p className="font-semibold">Civil Status</p>
                            <div className="space-y-1">
                                {candidate?.personal_info[0].civil_status || 'N/A'}
                            </div>
                            <p className="font-semibold">Spouse</p>
                            <div className="space-y-1">
                                {candidate?.personal_info[0].spouse || 'N/A'}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 pt-4">
                        <div className="flex flex-row items-center">
                            <IdCard size={30} className="mr-2" />
                            <h1 className="text-lg font-bold">Credentials</h1>
                        </div>

                        <div className="grid grid-cols-[120px_1fr] gap-4 text-sm ">
                            <p className="font-semibold">Education</p>
                            <div className="space-y-1">
                                {candidate?.credentials?.[0]?.education.map((item, index) => (
                                    <p key={index}>{item}</p>
                                ))}
                            </div>
                            <p className="font-semibold">Positions Held</p>
                            <div className="space-y-1">

                                {candidate?.credentials?.[0]?.positions_held.map((item, index) => (
                                    <p key={index}>{item} </p>
                                ))}

                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <ChatSide
                candidate={candidate}
                suggestions={suggestions}
                setSuggestions={setSuggestions}
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
            />
        </div>
    );
};

export default CandidateInfo; 
