import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration');
}

const supabase = createClient(supabaseUrl, supabaseKey);

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


