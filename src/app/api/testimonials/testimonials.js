import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
