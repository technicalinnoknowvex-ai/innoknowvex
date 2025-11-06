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
    
    // Normalize the slug (trim spaces, lowercase)
    const normalizedId = programId?.toString().trim().toLowerCase();
    
    if (!normalizedId) {
      console.error("Invalid program ID provided:", programId);
      return null;
    }

    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("id", normalizedId)
      .maybeSingle(); // Use maybeSingle() instead of single()

    if (error) {
      console.error("Error fetching program:", error);
      // Don't throw, just return null
      return null;
    }

    if (!data) {
      console.warn(`No program found with ID: ${normalizedId}`);
      
      // Optional: Try to find similar programs for debugging
      const { data: similarPrograms } = await supabase
        .from("programs")
        .select("id, title")
        .ilike("id", `%${normalizedId}%`)
        .limit(3);
      
      if (similarPrograms && similarPrograms.length > 0) {
        console.log("Did you mean one of these?", similarPrograms.map(p => p.id));
      }
      
      return null;
    }

    console.log("Fetched program:", data.title);
    return data;
  } catch (error) {
    console.error("Unexpected error fetching program:", error);
    return null;
  }
};