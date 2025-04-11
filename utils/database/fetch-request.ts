import { createClient } from "@/utils/supabase/client";
import { Candidate } from "@/components/model/models";

export const fetchRequest = async (
  table: string
): Promise<{ Candidate: Candidate[] | null; error: any | null }> => {
  if (!table) {
    console.log("add table");
    return { Candidate: null, error: "Missing table name" };
  }

  // Single query to fetch candidates with related data
  const { data: candidates, error } = await createClient().from(table).select(`
      *,
      personal_info (*),
      candidacy (*),
      credentials (*)
    `);

  // console.log(candidates

  if (error) {
    console.log(error);
    return { Candidate: null, error };
  }

  // Process image URLs in a single loop
  const candidatesWithImages = await Promise.all(
    candidates.map(async (candidate) => {
      let imageUrl = undefined;

      if (candidate.image_path) {
        const { data } = await createClient()
          .storage.from("images")
          .getPublicUrl(candidate.image_path);

        imageUrl = data?.publicUrl;
      }

      return {
        ...candidate,
        image_url: imageUrl,
      };
    })
  );

  return { Candidate: candidatesWithImages, error: null };
};




