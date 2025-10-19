import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getPrograms = async () => {
  try {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .order("created_at", { ascending: true }); 

    if (error) {
      console.error("Error fetching programs:", error);
      throw error;
    }

    console.log("Fetched programs:", data);
    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching programs:", error);
    return [];
  }
};

// New function to fetch a single program by ID
export const getProgramById = async (programId) => {
  try {
    console.log("Fetching program with ID:", programId, "Type:", typeof programId);
    
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("id", programId)
      .single();

    if (error) {
      console.error("Error fetching program:", error);
      throw error;
    }

    console.log("Fetched program:", data);
    return data;
  } catch (error) {
    console.error("Unexpected error fetching program:", error);
    return null;
  }
};