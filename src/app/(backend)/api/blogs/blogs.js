import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// GET - Fetch all blogs
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

// POST - Create new blog
export const createBlog = async (blogData) => {
  try {
    const { image, title, description, link } = blogData;

    // Validation
    if (!image || !title || !description || !link) {
      throw new Error('All fields are required');
    }

    // Get the max ID and increment
    const { data: maxIdData, error: maxIdError } = await supabase
      .from('blogsdata')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    if (maxIdError) {
      console.error('Error fetching max ID:', maxIdError);
      throw maxIdError;
    }

    const newId = maxIdData && maxIdData.length > 0 ? maxIdData[0].id + 1 : 1;

    // Insert new blog
    const { data, error } = await supabase
      .from('blogsdata')
      .insert([
        {
          id: newId,
          image,
          title,
          description,
          link,
          date: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Error creating blog:', error);
      throw error;
    }

    return { success: true, data: data[0], message: 'Blog created successfully' };
  } catch (error) {
    console.error('Error in createBlog:', error);
    throw error;
  }
};

// PUT - Update existing blog
export const updateBlog = async (id, blogData) => {
  try {
    if (!id) {
      throw new Error('Blog ID is required');
    }

    // Build update object with only provided fields
    const updateData = {};
    if (blogData.image) updateData.image = blogData.image;
    if (blogData.title) updateData.title = blogData.title;
    if (blogData.description) updateData.description = blogData.description;
    if (blogData.link) updateData.link = blogData.link;

    // Update blog
    const { data, error } = await supabase
      .from('blogsdata')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating blog:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('Blog not found');
    }

    return { success: true, data: data[0], message: 'Blog updated successfully' };
  } catch (error) {
    console.error('Error in updateBlog:', error);
    throw error;
  }
};

// DELETE - Delete blog
export const deleteBlog = async (id) => {
  try {
    if (!id) {
      throw new Error('Blog ID is required');
    }

    const { error } = await supabase
      .from('blogsdata')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }

    return { success: true, message: 'Blog deleted successfully' };
  } catch (error) {
    console.error('Error in deleteBlog:', error);
    throw error;
  }
};