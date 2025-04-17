"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { Candidate } from "@/components/model/models";
import { fetchRequest } from "@/utils/database/fetch-request";
import BallotTable from "@/components/ui/ballot";
import { useRouter } from "next/navigation";
import { MoonLoader } from "react-spinners";
import { Button } from "@/components/ui/button";

export default function BallotPage() {
  const [user, setUser] = useState<any>(null);
  const [reloadPage, setReloadPage] = useState(0);
  const [likedCandidates, setLikedCandidates] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  useEffect(() => {
    const loadCandidates = async () => {
      const { Candidate, error } = await fetchRequest("candidates");
      if (error) {
        setError("Failed to load candidates");
      } else {
        setCandidates(Candidate);
      }
    };

    loadCandidates();
    setLoading(false);
  }, []);

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

  const swipeCardPage = () => {
    router.push("/liked-candidates/swipecards");
  };
  const favoriteCandidate = () => {
    router.push("/my-favorites");
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <MoonLoader color="#000000" />
        </div>
      ) : (
        <div className="flex flex-col items-start justify-start pt-12 w-full h-screen">
          <div className="flex px-4 gap-4">
            <Button className="" onClick={swipeCardPage}>
              Swipe Card Mode
            </Button>
            <Button className="" onClick={favoriteCandidate}>
              Favorite Candidates
            </Button>
          </div>
          <BallotTable
            candidates={(filterLikedCandidates || []).map((candidate) => ({
              id: candidate.id,
              imgUrl: candidate.image_url || "N/A",
              displayName: candidate.display_name,
              politicalParty: candidate.political_party || "N/A",
            }))}
          />
        </div>
      )}
    </div>
  );
}
