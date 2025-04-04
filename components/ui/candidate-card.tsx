"use client"
import React from 'react';
import Image from 'next/image';
import { useRouter } from "next/navigation";

import { useState, useEffect } from 'react';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";

import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Ellipsis, Icon } from 'lucide-react';
import { IoMale, IoFemale } from "react-icons/io5";

import CandidateInfo from '@/app/(dashboard)/candidate-info/page'
import { Candidate } from '../model/models';
import { filter } from 'cheerio/dist/commonjs/api/traversing';


interface CandidateCardProps {
    candidate: Candidate
    selectedCandidate: Candidate | null
    setSelectedCandidate: (value: Candidate) => void
}

export const CandidateCard = ({
    //candidate info
    candidate,
    selectedCandidate,
    setSelectedCandidate
}: CandidateCardProps) => {
    const isMale = candidate.personal_info[0].sex!.toLowerCase() === "m";
    const router = useRouter()

    const candidateDetails = [
        { key: "Profession", value: candidate.personal_info[0]?.profession },
        { key: "Position Sought", value: candidate.candidacy[0]?.position_sought },
        { key: "Political Party", value: candidate.political_party },
        { key: "Civil Status", value: candidate.personal_info[0]?.civil_status }
    ];

    return (
        <div className='cursor-pointerflex flex-col shadow-lg bg-white hover:bg-gray-50 rounded-lg min-w-[18rem] w-full p-4 gap-2'>
            {/*Go to next page on click */}
            <div onClick={() => router.push(`/candidate-info?candidateId=${candidate.id}`)} className="flex flex-row">
                {/* candidate image */}
                <div className="relative flex-none bg-gray-400 h-24 w-24 rounded-lg ">

                    {typeof candidate.image_url === "string" ? (
                        <Image
                            src={candidate.image_url}
                            alt="Candidate Image"
                            fill={true}
                            className="rounded-lg"

                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-300 rounded-lg">
                            <span className="text-gray-600 text-sm">No Image</span>
                        </div>
                    )}
                </div>
                <div className='flex flex-col ml-2 w-[calc(100%-7rem)]'>
                    {/* candidate name */}
                    <div className='flex flex-row items-center gap-2'>
                        <div className="text-black font-bold text-xl">
                            {candidate.display_name}
                        </div>
                        {isMale ? (
                            <IoMale className="text-blue-600 text-lg" />
                        ) : (
                            <IoFemale className="text-pink-600 text-lg" />)
                        }
                    </div>
                    {/* You might want to display the other properties too */}
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-gray-600 text-sm">
                        {candidate.political_party} | {candidate.candidacy[0].position_sought}
                    </div>
                    <div className="flex flex-wrap gap-2 py-2">
                        {candidateDetails.map((detail) => (
                            detail.value ? (
                                <FilterContainer
                                    key={detail.key}
                                    filter={`${detail.value}`}
                                />
                            ) : null
                        ))}
                    </div>

                </div>
            </div>

            <div className='flex flex-row justify-end items-center space-x-4'>
                <Button
                    className='rounded-full'
                    variant="outline"
                    size="sm"
                    onClick={() => { setSelectedCandidate(candidate) }}
                >
                    <p className='font-bold text-sm'>
                        Itanong kay Yano
                    </p>
                </Button>
                {/* <Ellipsis className="text-black" size={18} /> */}
            </div>
        </div>
    );
};

const FilterContainer = ({ filter }: { filter: string }) => {
    return (
        <div className='bg-[#f8f8fa] rounded-sm p-1'>
            <p className='text-black text-xs'>
                {filter}
            </p>
        </div>
    );
};