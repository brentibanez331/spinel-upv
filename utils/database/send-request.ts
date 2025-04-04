import { createClient } from "../supabase/client";

export const sendRequest = async (
  table: string,
  name: string
): Promise<{ data: any[] | null; error: any | null }> => {
  if (!name) {
    console.log("Empty");
  }
  const { data, error } = await createClient()
    .from(table)
    .insert([{ name }])
    .select();

  if (error) {
    console.log(error);
    return { data: null, error };
  }
  console.log("Successfuly Inserted Data");
  return { data, error: null };
};
