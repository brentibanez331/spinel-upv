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
import { Skeleton } from "@/components/ui/skeleton";
import { ShowLikedCandidates } from "@/components/show-liked-candidates";
export default function SwipeCardsPage() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  const [likedCandidates, setLikedCandidates] = useState<string[]>([]);
  const [hiddenCandidate, setHiddenCandidate] = useState<string[]>([]);

  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessageHistory[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

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
    const { data, error } = await supabase
      .from("ballot")
      .select("*, candidates (*)")
      .eq("user_id", id)
      .eq("status", "saved");

    if (data) {
      const likedCandidates = data.map((data) => data.candidates);
      console.log(likedCandidates);
    }

    return data;
  };

  useEffect(() => {
    const loadUserLikedCandidates = async () => {
      if (user) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("ballot")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          console.error("ERROR LIKED DETAILS:", error);
          setError("Failed to load liked candidates");
        } else {
          console.log("USER FOUND!", user);
          const liked = data.filter((item) => item.status === "saved");
          const hidden = data.filter((item) => item.status === "hidden");

          setLikedCandidates(liked.map((item) => item.candidate_id));
          setHiddenCandidate(hidden.map((item) => item.candidate_id));

          console.log("HIDDEN CANDIDATES", hiddenCandidate);
          console.log("USER LIKED CANDIDATES", likedCandidates);
        }

        if (data?.length === 0) {
          console.log("NO LIKED CANDIDATES");
        }
      } else {
        console.log("No user found");
      }
      setLoading(false);
    };
    loadUserLikedCandidates();
  }, [user]);

  const filterLikedCandidates = useMemo(() => {
    return candidates
      ?.filter((candidate) => !hiddenCandidate.includes(candidate.id))
      ?.filter((candidate) => !likedCandidates.includes(candidate.id));
  }, [candidates, likedCandidates, hiddenCandidate]);

  console.log("FILTERED CANDIDATES", filterLikedCandidates);

  const filterLikedDataCandidates = useMemo(() => {
    return candidates
      ?.filter((candidate) => !hiddenCandidate.includes(candidate.id))
      ?.filter((candidate) => likedCandidates.includes(candidate.id));
  }, [candidates, likedCandidates, hiddenCandidate]);

  useEffect(() => setLoading(false), [candidates, likedCandidates]);

  console.log("FILTERED LIKED CANDIDATES", filterLikedDataCandidates);

  const refetchCandidates = async () => {
    if (user) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("ballot")
        .select("*")
        .eq("user_id", user.id)
        .neq("status", "hidden");

      if (error) {
        console.error("Error fetching liked candidates:", error);
        setError("Failed to refresh liked candidates");
      } else {
        setLikedCandidates(data.map((item) => item.candidate_id));
      }
    }

    const { Candidate, error } = await fetchRequest("candidates");
    if (error) {
      setError("Failed to refresh candidates");
    } else {
      setCandidates(Candidate);
    }
  };

  useEffect(() => {
    if (filterLikedCandidates && filterLikedCandidates[0]) {
      const gender =
        filterLikedCandidates[0].personal_info?.[0]?.sex === "M"
          ? "his"
          : "her";

      setChatHistory([
        {
          role: "AI",
          message: `Nakita ko na interesado ka na malaman patungkol kay ${filterLikedCandidates[0].display_name}. Ano ang gusto mong malaman?`,
        },
      ]);

      setSuggestions([
        `Who is ${filterLikedCandidates[0].display_name}?`,
        `What are ${gender} current platforms?`,
        `What are some of ${gender} previous projects?`,
      ]);
    }
  }, [filterLikedCandidates, likedCandidates]);

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <MoonLoader color="#000000" />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full h-screen">
          <div className="w-full pt-10 px-4 flex sm:pr-96">
            <div>
              <div>
                <p className="text-xl font-bold">Candidate Builder</p>
                <p className="text-sm text-neutral-600">
                  I-buo ang iyong lista ng kandidato
                </p>
              </div>
              <div className="flex flex-row">
                <div className="w-full -translate-x-24 h-screen">
                  {user &&
                  filterLikedCandidates &&
                  filterLikedCandidates.length > 0 ? (
                    <SwipeCards
                      candidates={filterLikedCandidates.map((candidate) => ({
                        id: candidate.id,
                        userId: user.id,
                        imgUrl: candidate.image_url || "N/A",
                        displayName: candidate.display_name,
                        politicalParty: candidate.political_party || "N/A",
                      }))}
                      refetchCandidates={refetchCandidates}
                    />
                  ) : (
                    <div className="flex flex-col  space-y-4 h-full mt-10 p-4 w-full">
                      <Skeleton className="w-[300px] h-10 rounded-xl" />
                      <div className="flex flex-col gap-4"></div>
                    </div>
                  )}
                </div>
                <div>
                  <div className=" ml-64 p-4 rounded-lg shadow-lg">
                    <p className="text-xl font-bold">Favorite Candidates</p>{" "}
                    <div className=" h-[28rem] overflow-y-auto">
                      {isLoading ? (
                        <div>Is Loading</div>
                      ) : user &&
                        filterLikedDataCandidates &&
                        filterLikedDataCandidates.length > 0 ? (
                        filterLikedDataCandidates.map((candidate) => (
                          <ShowLikedCandidates
                            key={candidate.id}
                            id={candidate.id}
                            full_name={candidate.full_name}
                            display_name={candidate.display_name}
                            political_party={candidate.political_party || "N/A"}
                            image_url={candidate.image_url || "N/A"}
                          />
                        ))
                      ) : (
                        <div className="w-[300px]">No Favorite Candidates</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ChatSide
              candidate={
                filterLikedCandidates ? filterLikedCandidates[0] : null
              }
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              setSuggestions={setSuggestions}
              suggestions={suggestions}
            />
          </div>
        </div>
      )}
    </>
  );
}
