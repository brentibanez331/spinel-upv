import { createClient } from "@/utils/supabase/client";

export const getCandidateImageUrl = (imagePath: string): string | null => {
  const supabase = createClient();

  const { data } = supabase.storage.from("images").getPublicUrl(imagePath);

  //   console.log("Generated image public URL:", data?.publicUrl);
  return data?.publicUrl || null;
};
