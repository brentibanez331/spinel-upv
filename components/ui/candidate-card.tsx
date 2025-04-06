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

import CandidateInfo from '@/app/(dashboard)/candidate-info/page';
import { Candidate } from '../model/models';


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

    const [isTap, setIsTap] = useState(false)

    return (
        <div className='cursor-pointer flex flex-col shadow-lg bg-white hover:bg-gray-50 rounded-lg min-w-[18rem] w-full p-4 gap-2'>
            {/*Go to next page on click */}
            <div onClick={() => router.push(`/user/dashboard/candidate-info?candidateId=${candidate.id || ''}`)} className="flex flex-row">
                {/* candidate image */}
                <div className="flex-none bg-gray-400 h-24 w-24 rounded-lg ">

                    {typeof candidate.image_url === "string" ? (
                        <Image
                            src={candidate.image_url}
                            alt="Candidate Image"
                            width={96}
                            height={96}
                            className="object-cover rounded-lg"
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
                        {candidate.political_party} | {candidate.candidacy.toString()}
                    </div>
                </div>
            </div>

            <div className='flex flex-row justify-end items-center space-x-4'>
                {/* <div className='flex flex-row gap-1'>
                    <IoIosInformationCircleOutline className='text-gray-500' />
                        <p className='text-xs text-gray-500 '>
                            See more
                        </p>
                </div> */}
                <Button
                    className='rounded-full'
                    variant="outline"
                    size="sm"
                    onClick={() => {setSelectedCandidate(candidate)}}
                >
                    <p className='font-bold text-sm'>
                        Itanong kay Yano
                    </p>
                </Button>
                <Ellipsis className="text-black" size={18} />
            </div>


            {/* <Separator orientation="vertical" className='w-full bg-gray-200 h-px' />
            <div className='flex items-end justify-end'>
                <Button className='bg-gray-100 rounded-3xl font-bold' variant="outline" size="sm">Ask Yano</Button>
            </div> */}
            {/* button for ai */}
            {/* <div onClick={() => {setIsTap(true), console.log(isTap)}} className='flex flex-row gap-1 '>
                <IoIosInformationCircleOutline className='text-gray-500' />
                {isTap ?
                    <p className='text-xs text-gray-500 '>
                        Tap to hide details
                    </p> :
                    <p className='text-xs text-gray-500 '>
                        Tap for more details
                    </p>}
            </div>
            {isTap && (
                <div className='mt-2'>
                    <div className='h-px bg-gray-200 w-full mb-3'></div>
                    <div className='bg-gray-50 p-3 rounded-md'>
                        <h3 className="font-medium mb-2">Candidate Details</h3>
                        <div className='grid grid-cols-2 gap-y-2 gap-x-4'>
                            {Object.entries(candidateDetails).map(([key, value]) => (
                                value ? (
                                    <div key={key} className="text-sm">
                                        <span className="font-medium text-gray-700">{key}: </span>
                                        <span className="text-gray-600">{value}</span>
                                    </div>
                                ) : null
                            ))}
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};

const FilterContainer = ({ filter }: { filter: string }) => {
    // const isMale = filter.toLowerCase() === "m";
    // const isFemale = filter.toLowerCase() === "f";

    // const bgColor = isMale
    //     ? "bg-blue-100 text-blue-700"
    //     : isFemale
    //         ? "bg-pink-100 text-pink-700"
    //         : "bg-gray-100 text-gray-800";

    return (
        // <div className={`flex items-center gap-1 rounded-sm p-1 ${bgColor}`}>
        //     {isMale && <IoMale className="text-lg" />}
        //     {isFemale && <IoFemale className="text-lg" />}
        //     {!isMale && !isFemale && <p className="text-xs">{filter}</p>}

        // </div>
        <div className='bg-[#f8f8fa] rounded-sm p-1'>
            <p className='text-black text-xs'>
                {filter}
            </p>
        </div>
    );
};