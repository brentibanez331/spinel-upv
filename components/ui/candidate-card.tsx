"use client"
import React from 'react';
import Image from 'next/image';

import { useState, useEffect } from 'react';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";

import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Ellipsis } from 'lucide-react';


interface CandidateCardProps {
    imgUrl?: string;
    fullName: string,
    politicalParty?: string;

    birthdate?: string,
    ageOnElection?: number,
    birthplace?: string,
    residence?: string,
    sex?: string;
    civilStatus?: string,
    Spouse?: string,
    profession?: string,

    positionSought?: string,
    periodOfResidence?: string,
    registeredVoterOf?: string
}

export const CandidateCard = ({
    //candidate info
    imgUrl,
    fullName,
    politicalParty,
    //personal info
    birthdate,
    ageOnElection,
    birthplace,
    residence,
    sex,
    civilStatus,
    Spouse,
    profession,
    //candidacy info
    positionSought,
    periodOfResidence,
    registeredVoterOf
}: CandidateCardProps) => {
    const [isTap, setIsTap] = useState(false)
    useEffect(() => {
        console.log("Image URL:", imgUrl);
    }, [imgUrl]);

    const candidateDetails: Record<string, string | number | undefined> = {
        positionSought: positionSought,
        Birthdate: birthdate,
        "Age on Election": ageOnElection,
        Birthplace: birthplace,
        Residence: residence,
        Sex: sex,
        "Civil Status": civilStatus,
        Spouse: Spouse,
        Profession: profession,
        "Period of Residence": periodOfResidence,
        "Registered Voter Of": registeredVoterOf,
    };
    return (
        <div className='flex flex-col shadow-lg bg-white rounded-lg min-w-[18rem] w-full p-4 gap-2'>

            <div onClick={() => { }} className=" flex flex-row ">
                {/* candidate image */}
                <div className="flex-none bg-gray-400 h-24 w-24 rounded-lg ">

                    {typeof imgUrl === "string" ? (
                        <Image
                            src={imgUrl}
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
                    <div className="text-black font-bold text-xl">
                        {fullName}
                    </div>
                    {/* You might want to display the other properties too */}
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-gray-600 text-sm">
                        {politicalParty} | {positionSought}
                    </div>
                    <div className="flex flex-wrap gap-1 pt-2">
                        {Object.entries(candidateDetails).map(([key, value]) => (
                            value ? <FilterContainer key={key} filter={String(value)} /> : null
                        ))}
                    </div>
                </div>
            </div>
            <div className='flex flex-row justify-between'>
                <div className='flex flex-row gap-1'>
                    <IoIosInformationCircleOutline className='text-gray-500' />
                    <p className='text-xs text-gray-500 '>
                        See more
                    </p>
                </div>
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
    return (
        <div className='bg-[#f8f8fa] rounded-sm p-1'>
            <p className='text-black text-xs'>
                {filter}
            </p>
        </div>
    )
}