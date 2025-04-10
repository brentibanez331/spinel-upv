"use client";

import SwipeCards from "@/components/swipe-cards";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect, useMemo } from "react";
import { Candidate } from "@/components/model/models";
import { User } from "@supabase/supabase-js";
import { fetchRequest } from "@/utils/database/fetch-request";
import { useRouter } from "next/navigation";
import { MoonLoader } from "react-spinners";
import ChatSide from "@/components/chat-side";
import { ChatMessageHistory } from "@/utils/types";

export default function SwipeCardsPage() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  const [likedCandidates, setLikedCandidates] = useState<Candidate[]>([]);
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [suggestions, setSuggestions] = useState<string[]>([])
  const [chatHistory, setChatHistory] = useState<ChatMessageHistory[]>([])

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchUser()

  }, [])

  useEffect(() => {
    const loadCandidates = async () => {
      const { Candidate, error } = await fetchRequest("candidates");
      if (error) {
        setError("Failed to load candidates");
      } else {
        setCandidates(Candidate);
      }
      setLoading(false);
    };

    loadCandidates();
  }, []);

  const fetchedLikedCandidates = async (id: string) => {
    const { data, error } = await supabase.from("ballot").select("*, candidates (*)").eq("user_id", id).eq("status", "saved")

    if (data) {
      const likedCandidates = data.map((data) => data.candidates)
      console.log(likedCandidates)
    }


    return data
  }

  useEffect(() => {
    if (user) {
      fetchedLikedCandidates(user.id)
    }

  }, [user])


  const filterLikedCandidates = useMemo(() => {
    return candidates?.filter(
      (candidate) => !likedCandidates.includes(candidate.id)
    );
  }, [candidates, likedCandidates]);

  useEffect(() => {
    if (filterLikedCandidates && filterLikedCandidates[0]) {
      const gender = filterLikedCandidates[0].personal_info?.[0]?.sex === 'M' ? 'his' : 'her';

      setChatHistory([{
        role: 'AI',
        message: `Nakita ko na interesado ka na malaman patungkol kay ${filterLikedCandidates[0].display_name}. Ano ang gusto mong malaman?`
      }]);

      setSuggestions([
        `Who is ${filterLikedCandidates[0].display_name}?`,
        `What are ${gender} current platforms?`,
        `What are some of ${gender} previous projects?`
      ]);
    }
  }, [filterLikedCandidates, likedCandidates]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full pt-10 px-4 flex">
        <div>
          <div>
            <p className="text-xl font-bold">Candidate Builder</p>
            <p className="text-sm text-neutral-600">I-buo ang iyong lista ng kandidato</p>
          </div>
          {user && filterLikedCandidates && filterLikedCandidates.length > 0 ? (
            <SwipeCards

              candidates={filterLikedCandidates.map((candidate) => ({
                id: candidate.id,
                userId: user.id,
                imgUrl: candidate.image_url || "N/A",
                displayName: candidate.display_name,
                politicalParty: candidate.political_party || "N/A",
              }))}
            />
          ) : (
            <div>No candidates available.</div>
          )}
        </div>
        <div className="ml-96 border border-neutral-200 p-4 w-[500px] h-auto shadow-md rounded-md">
          <p className="text-lg font-bold">Saved Candidates</p>
          <div>
            {likedCandidates.length > 0 ? (

              likedCandidates.map((candidate) => (
                <div className="border buto border-neutral-400">
                  {candidate.display_name}
                </div>
              ))


            ) : (
              <div></div>
            )}
          </div>
        </div>
        {/* <ChatSide candidate={filterLikedCandidates![0]} chatHistory={chatHistory} setChatHistory={setChatHistory} setSuggestions={setSuggestions} suggestions={suggestions} /> */}

      </div>
    </div>
  );
}
