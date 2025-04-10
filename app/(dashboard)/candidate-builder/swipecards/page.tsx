"use client";

import SwipeCards from "@/components/swipe-cards";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { Candidate } from "@/components/model/models";
import { User } from "@supabase/supabase-js";
import { fetchRequest } from "@/utils/database/fetch-request";
import { useRouter } from "next/navigation";
import { MoonLoader } from "react-spinners";

export default function SwipeCardsPage() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  const [likedCandidates, setLikedCandidates] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () =>{
      const { data: {user} } = await supabase.auth.getUser()
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


  // console.log("User:", user);

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
          setLikedCandidates(data.map((item) => item.candidate_id));
          console.log("USER LIKED CANDIDATES", data);
        }
        if (data?.length === 0) {
          console.log("NO LIKED CANDIDATES");
        }
      } else {
        console.log("No user found");
      }
    };
    loadUserLikedCandidates();
  }, [user]);

  const filterLikedCandidates = candidates?.filter(
    (candidate) => !likedCandidates.includes(candidate.id)
  );

  const swipeCardPage = () => {
    router.push("/liked-candidates/ballot");
  };

  return (
    <div className="flex flex-col items-center justify-center pt-8 w-full h-screen">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <MoonLoader color="#000000" />
        </div>
      ) : (
        <div className="">
          <button onClick={swipeCardPage}>Ballot Mode</button>
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
      )}
    </div>
  );
}
