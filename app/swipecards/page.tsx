"use client";

import SwipeCards from "@/components/ui/swipe-cards";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { Candidate } from "@/components/model/models";
import { fetchRequest } from "@/utils/database/fetch-request";

export default function SwipeCardsPage() {
  const [user, setUser] = useState<any>(null);
  const [likedCandidates, setLikedCandidates] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchData = async () => {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("ERROR!", error.message);
      }
      setUser(data.user);
      console.log("User Data:", data.user);
    };

    fetchData();
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

  console.log("Liked Candidates:", likedCandidates);

  const filterLikedCandidates = candidates?.filter(
    (candidate) => !likedCandidates.includes(candidate.id)
  );

  return (
    <div>
      {filterLikedCandidates && filterLikedCandidates.length > 0 ? (
        <SwipeCards
          candidates={filterLikedCandidates.map((candidate) => ({
            id: candidate.id,
            imgUrl: candidate.image_url || "N/A",
            displayName: candidate.display_name,
            politicalParty: candidate.political_party || "N/A",
          }))}
        />
      ) : (
        <div>No candidates available.</div>
      )}
    </div>
  );
}
