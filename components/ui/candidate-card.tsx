"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { IoMale, IoFemale } from "react-icons/io5";
import { User } from "@supabase/supabase-js";

import { Candidate } from '../model/models';
import { Sparkles } from 'lucide-react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { createClient } from "@/utils/supabase/client";

interface CandidateCardProps {
    candidate: Candidate;
    selectedCandidate: Candidate | null;
    setSelectedCandidate: (value: Candidate) => void | null;
    isPreviouslyLiked: boolean | null;
    user: User | null;
    onUnsaveCandidate: ((candidateId: string) => void) | null;
}

export const CandidateCard = ({
    candidate,
    selectedCandidate,
    setSelectedCandidate,
    isPreviouslyLiked,
    user,
    onUnsaveCandidate,  // Include the callback
}: CandidateCardProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const isMale = candidate.personal_info[0].sex!.toLowerCase() === "m";
    const router = useRouter();
    const supabase = createClient();

    const candidateDetails = [
        { key: "Profession", value: candidate.personal_info[0]?.profession },
        { key: "Position Sought", value: candidate.candidacy[0]?.position_sought },
        { key: "Political Party", value: candidate.political_party },
    ];

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);

        if (!user) {
            console.warn("User not logged in.");
            return;
        }

        try {
            const { data: existing, error: fetchError } = await supabase
                .from("ballot")
                .select("id")
                .eq("candidate_id", candidate.id)
                .eq("user_id", user.id)
                .maybeSingle();

            if (fetchError) {
                console.error("Fetch error:", fetchError);
                return;
            }

            if (newLikedState) {
                if (existing) {
                    // If already exists, update status to 'saved'
                    const { error: updateError } = await supabase
                        .from("ballot")
                        .update({ status: 'saved' })
                        .eq("id", existing.id);

                    if (updateError) console.error("Update error:", updateError);
                }
                else {
                    // Else, insert new
                    const { error: insertError } = await supabase.from("ballot").insert([{
                        candidate_id: candidate.id,
                        user_id: user.id,
                        status: 'saved',
                    }]);
                    if (insertError) console.error("Insert error:", insertError);
                }
            } else {
                if (existing) {
                    // Instead of delete, update status to 'hidden'
                    const { error: hideError } = await supabase
                        .from("ballot")
                        .update({ status: 'hidden' })
                        .eq("id", existing.id);

                    if (hideError) console.error("Update (hidden) error:", hideError);
                }

                // Trigger frontend update callback
                if (onUnsaveCandidate != null) {
                    onUnsaveCandidate(candidate.id);
                }
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };


    useEffect(() => {
        if (isPreviouslyLiked != null) {
            setIsLiked(isPreviouslyLiked);
        }
    }, [isPreviouslyLiked]);

    return (
        <div className='cursor-pointer flex flex-col shadow-lg bg-white hover:bg-gray-50 rounded-lg min-w-[18rem] w-full p-4 gap-2'>
            <div onClick={() => router.push(`/candidate/${candidate.id}`)} className="flex flex-row">
                <div className="flex-none bg-gray-400 h-24 w-24 rounded-lg ">
                    {typeof candidate.image_url === "string" ? (
                        <Image
                            src={candidate.image_url}
                            alt="Candidate Image"
                            height={96}
                            width={96}
                            className="rounded-lg"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-300 rounded-lg">
                            <span className="text-gray-600 text-sm">No Image</span>
                        </div>
                    )}
                </div>
                <div className='flex flex-col ml-2 w-[calc(100%-7rem)]'>
                    <div className='flex flex-row justify-between'>
                        <div className='flex flex-row items-center gap-2'>
                            <div className="text-black font-bold text-xl">
                                {candidate.display_name}
                            </div>
                            {isMale ? (
                                <IoMale className="text-blue-600 text-lg" />
                            ) : (
                                <IoFemale className="text-pink-600 text-lg" />
                            )}
                        </div>
                        <Button
                            onClick={handleLike}
                            variant="ghost"
                            size="icon"
                            className='rounded-full'
                        >
                            {isLiked ? <FaHeart className='text-red-500 size-6' /> : <FaRegHeart className='text-red-500 size-6' />}
                        </Button>
                    </div>
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-gray-600 text-sm">
                        <p>{candidate.political_party}</p>
                        <p>{candidate.candidacy?.[0]?.position_sought}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 py-2">
                        {candidateDetails.map((detail) =>
                            detail.value ? (
                                <FilterContainer key={detail.key} filter={`${detail.value}`} />
                            ) : null
                        )}
                    </div>
                </div>
            </div>

            <div className='flex flex-row justify-end items-center space-x-4'>
                <Button
                    className='rounded-full space-x-2'
                    variant="outline"
                    size="sm"
                    onClick={() => { setSelectedCandidate(candidate) }}
                >
                    <Sparkles size={20} />
                    <p className='font-bold text-sm'>Itanong kay Gabay</p>
                </Button>
            </div>
        </div>
    );
};
const FilterContainer = ({ filter }: { filter: string }) => (
    <div className='bg-[#f8f8fa] rounded-sm p-1'>
        <p className='text-black text-xs'>{filter}</p>
    </div>
);