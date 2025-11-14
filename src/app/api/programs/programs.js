
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



// const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get pricing for a specific course
 * @param {string} courseName - The course name to fetch pricing for
 * @returns {Promise<Object|null>} Pricing data or null
 */
export const getPricingByCourse = async (courseName) => {
  try {
    const { data, error } = await supabase
      .from('pricing')
      .select('*')
      .eq('course_name', courseName)
      .single();

    if (error) {
      console.error('Error fetching pricing:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching pricing:', error);
    return null;
  }
};

/**
 * Get all pricing records
 * @returns {Promise<Array>} Array of pricing records
 */
export const getAllPricing = async () => {
  try {
    const { data, error } = await supabase
      .from('pricing')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching all pricing:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching all pricing:', error);
    return [];
  }
};

/**
 * Create or update pricing for a course
 * @param {string} courseName - The course name
 * @param {Object} pricingData - Pricing data object
 * @returns {Promise<Object>} Result object with success status
 */
export const upsertPricing = async (courseName, pricingData) => {
  try {
    const { data, error } = await supabase
      .from('pricing')
      .upsert({
        course_name: courseName,
        self_actual_price: parseFloat(pricingData.self_actual_price) || 0,
        self_current_price: parseFloat(pricingData.self_current_price) || 0,
        mentor_actual_price: parseFloat(pricingData.mentor_actual_price) || 0,
        mentor_current_price: parseFloat(pricingData.mentor_current_price) || 0,
        professional_actual_price: parseFloat(pricingData.professional_actual_price) || 0,
        professional_current_price: parseFloat(pricingData.professional_current_price) || 0,
        currency: pricingData.currency || 'INR',
      }, {
        onConflict: 'course_name'
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting pricing:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error upserting pricing:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete pricing for a course
 * @param {string} courseName - The course name
 * @returns {Promise<Object>} Result object with success status
 */
export const deletePricing = async (courseName) => {
  try {
    const { error } = await supabase
      .from('pricing')
      .delete()
      .eq('course_name', courseName);

    if (error) {
      console.error('Error deleting pricing:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting pricing:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Calculate savings percentage
 * @param {number} actualPrice - Original price
 * @param {number} currentPrice - Current price
 * @returns {number} Savings percentage
 */
export const calculateSavings = (actualPrice, currentPrice) => {
  if (!actualPrice || actualPrice <= 0) return 0;
  return Math.round(((actualPrice - currentPrice) / actualPrice) * 100);
};


