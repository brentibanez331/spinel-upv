import { createClient } from "../supabase/client";
import { log } from "console";

export const deleteRequest = async (
  table: string,
  rowId: number
): Promise<{ data: any[] | null; error: any | null }> => {
  if (!table) {
    console.log("error");
    return { data: null, error: "Add table" };
  }
  const { data, error } = await createClient()
    .from(table)
    .delete()
    .eq("id", rowId);

  if (error) {
    console.log(error);
  }
  console.log(data);
  return { data, error: null };
};
