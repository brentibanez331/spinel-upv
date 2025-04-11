"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { IoMale, IoFemale } from "react-icons/io5";

import { Candidate } from "./model/models";
import { Sparkles } from "lucide-react";

interface CandidateCardProps {
  id: string;
  full_name: string;
  display_name: string;
  political_party: string;
  image_url: string;
}

export const ShowLikedCandidates = ({
  //candidate info
  id,
  full_name,
  display_name,
  political_party,
  image_url,
}: CandidateCardProps) => {
  //   const isMale = personal_info[0].sex!.toLowerCase() === "m";
  const router = useRouter();

  const candidateDetails = [
    // { key: "Profession", value: candidate.personal_info[0]?.profession },
    // { key: "Position Sought", value: candidate.candidacy[0]?.position_sought },
    { key: "Political Party", value: political_party },
    // { key: "Civil Status", value: candidate.personal_info[0]?.civil_status }
  ];

  return (
    <div className="cursor-pointer flex flex-col shadow-lg bg-white hover:bg-gray-50 rounded-lg min-w-[18rem] w-full p-2 gap-2">
      {/*Go to next page on click */}
      <div
        onClick={() => router.push(`/candidate/${id}`)}
        className="flex flex-row"
      >
        {/* candidate image */}
        <div className="flex-none bg-gray-400 h-14 w-14 rounded-lg ">
          {typeof image_url === "string" ? (
            <Image
              src={image_url}
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
        <div className="flex flex-col ml-2 w-full]">
          {/* candidate name */}
          <div className="flex flex-row items-center gap-1">
            <div className="text-black font-bold text-sm">{display_name}</div>
            {/* {isMale ? (
              <IoMale className="text-blue-600 text-lg" />
            ) : (
              <IoFemale className="text-pink-600 text-lg" />
            )} */}
          </div>
          <div className="overflow-hidden text-ellipsis text-xs whitespace-nowrap text-gray-600">
            <p>{political_party}</p>
            {/* <p>{candidacy?.[0]?.position_sought}</p> */}
            {/* {candidate.political_party} | {candidate.candidacy?.[0]?.position_sought} */}
          </div>
          <div className="flex flex-wrap gap-1 py-1 text-xs">
            {candidateDetails.map((detail) =>
              detail.value ? (
                <FilterContainer key={detail.key} filter={`${detail.value}`} />
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterContainer = ({ filter }: { filter: string }) => {
  return (
    <div className="bg-[#f8f8fa] rounded-sm p-1">
      <p className="text-black text-xs">{filter}</p>
    </div>
  );
};
