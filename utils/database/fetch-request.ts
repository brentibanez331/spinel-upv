import { createClient } from "@/utils/supabase/client";
import { Candidate, PersonalInfo, Candidacy } from "@/components/model/models";

export const fetchRequest = async (
  table: string
): Promise<{ Candidate: Candidate[] | null; error: any | null }> => {
  if (!table) {
    console.log("add table");
    return { Candidate: null, error: "Missing table name" };
  }

  // Fetch candidates
  const { data: candidates, error: candidatesError } = await createClient()
    .from(table)
    .select();

  if (candidatesError) {
    console.log(candidatesError);
    return { Candidate: null, error: candidatesError };
  }

  // Fetch related personal info for each candidate
  const candidatesWithPersonalInfo = await Promise.all(
    candidates?.map(async (candidate: Candidate) => {
      const { data: personalInfo, error: personalInfoError } =
        await createClient()
          .from("personal_info")
          .select()
          .eq("candidate_id", candidate.id)
          .single();

      if (personalInfoError) {
        console.log(personalInfoError);
      }

      // Fetch related candidacy for each candidate
      const { data: candidacies, error: candidaciesError } =
        await createClient()
          .from("candidacy")
          .select()
          .eq("candidate_id", candidate.id);

      if (candidaciesError) {
        console.log(candidaciesError);
      }

      let imageUrl: string | undefined = undefined;
      if (candidate.image_path) {
        const { data } = await createClient()
          .storage.from("images")
          .getPublicUrl(candidate.image_path);

        // Check if the data contains the public URL
        if (data?.publicUrl) {
          imageUrl = data.publicUrl;
        } else {
          console.log(
            `No public URL found for image path ${candidate.image_path}`
          );
        }
      } else {
        console.log(`No image path found for candidate ID ${candidate.id}`);
      }

      return {
        ...candidate,
        personal_info: personalInfo || null,
        candidacies: candidacies || [],
        image_url: imageUrl,
      };
    })
  );

  console.log(candidatesWithPersonalInfo);
  return { Candidate: candidatesWithPersonalInfo, error: null };
};
