
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// For storage operations, use service role key if available (backend only)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase;

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

export const getProgramById = async (programId) => {
  try {
    console.log("Fetching program with ID:", programId, "Type:", typeof programId);
    
    const normalizedId = programId?.toString().trim().toLowerCase();
    
    if (!normalizedId) {
      console.error("Invalid program ID provided:", programId);
      return null;
    }

    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("id", normalizedId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching program:", error);
      return null;
    }

    if (!data) {
      console.warn(`No program found with ID: ${normalizedId}`);
      
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

export const updateProgram = async (programId, programData) => {
  try {
    console.log("Updating program:", programId, programData);

    const { data, error } = await supabase
      .from("programs")
      .update(programData)
      .eq("id", programId)
      .select()
      .single();

    if (error) {
      console.error("Error updating program:", error);
      throw new Error(error.message || "Failed to update program");
    }

    console.log("Program updated successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error updating program:", error);
    throw error;
  }
};

export const uploadImage = async (file, programId) => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${programId}_${Date.now()}.${fileExt}`;
    const filePath = `Programs/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('Innoknowvex website content')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Error uploading image:", error);
      throw new Error(error.message || "Failed to upload image");
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('Innoknowvex website content')
      .getPublicUrl(filePath);

    console.log("Image uploaded successfully:", publicUrl);
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Unexpected error uploading image:", error);
    throw error;
  }
};

export const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl) {
      return { success: true };
    }

    // Extract the file path from the URL
    const urlParts = imageUrl.split('/Innoknowvex%20website%20content/');
    if (urlParts.length < 2) {
      console.warn("Invalid image URL format:", imageUrl);
      return { success: true };
    }

    const filePath = decodeURIComponent(urlParts[1]);

    const { error } = await supabase.storage
      .from('Innoknowvex website content')
      .remove([filePath]);

    if (error) {
      console.error("Error deleting image:", error);
      return { success: false, error: error.message };
    }

    console.log("Image deleted successfully:", filePath);
    return { success: true };
  } catch (error) {
    console.error("Unexpected error deleting image:", error);
    return { success: false, error: error.message };
  }
};

export const uploadBrochure = async (file, programId) => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${programId}_${Date.now()}.${fileExt}`;
    const filePath = `brochure/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('Innoknowvex website content')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Error uploading brochure:", error);
      throw new Error(error.message || "Failed to upload brochure");
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('Innoknowvex website content')
      .getPublicUrl(filePath);

    console.log("Brochure uploaded successfully:", publicUrl);
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Unexpected error uploading brochure:", error);
    throw error;
  }
};

export const deleteBrochure = async (brochureUrl) => {
  try {
    if (!brochureUrl) {
      return { success: true };
    }

    // Extract the file path from the URL
    const urlParts = brochureUrl.split('/Innoknowvex%20website%20content/');
    if (urlParts.length < 2) {
      console.warn("Invalid brochure URL format:", brochureUrl);
      return { success: true };
    }

    const filePath = decodeURIComponent(urlParts[1]);

    const { error } = await supabase.storage
      .from('Innoknowvex website content')
      .remove([filePath]);

    if (error) {
      console.error("Error deleting brochure:", error);
      return { success: false, error: error.message };
    }

    console.log("Brochure deleted successfully:", filePath);
    return { success: true };
  } catch (error) {
    console.error("Unexpected error deleting brochure:", error);
    return { success: false, error: error.message };
  }
};