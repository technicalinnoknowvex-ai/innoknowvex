import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all testimonials - NO CHANGES
export const getTestimonials = async () => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching testimonials:', error);
    return [];
  }
};

// Create new testimonial
export const createTestimonial = async (testimonialData) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonialData])
      .select()
      .single();

    if (error) {
      console.error('Error creating testimonial:', error);
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error creating testimonial:', error);
    throw new Error(error.message);
  }
};

// Update testimonial
export const updateTestimonial = async (id, testimonialData) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .update(testimonialData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating testimonial:', error);
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error updating testimonial:', error);
    throw new Error(error.message);
  }
};

// Delete testimonial
export const deleteTestimonial = async (id) => {
  try {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting testimonial:', error);
      throw error;
    }
    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting testimonial:', error);
    throw new Error(error.message);
  }
};