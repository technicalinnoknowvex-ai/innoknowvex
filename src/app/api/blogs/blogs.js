import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const getBlogs = async () => {
  try {
    const { data, error } = await supabase
      .from('blogsdata')
      .select('*')
      .order('date', { ascending: false }); 

    if (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching blogs:', error);
    return [];
  }
};
