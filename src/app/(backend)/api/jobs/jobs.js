import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// GET - Fetch all jobs
export const getJobs = async () => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching jobs:', error);
    return [];
  }
};

// POST - Create new job
export const createJob = async (jobData) => {
  try {
    const { title, category, description, skills, employment_type, experience } = jobData;

    // Validation
    if (!title || !category || !description || !skills || !employment_type) {
      throw new Error('All fields are required');
    }

    // Get the max ID and increment
    const { data: maxIdData, error: maxIdError } = await supabase
      .from('jobs')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    if (maxIdError) {
      console.error('Error fetching max ID:', maxIdError);
      throw maxIdError;
    }

    const newId = maxIdData && maxIdData.length > 0 ? maxIdData[0].id + 1 : 1;

    // Insert new job
    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
          id: newId,
          title,
          category,
          description,
          skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
          employment_type,
          experience: experience || null,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Error creating job:', error);
      throw error;
    }

    return { success: true, data: data[0], message: 'Job posted successfully' };
  } catch (error) {
    console.error('Error in createJob:', error);
    throw error;
  }
};

// PUT - Update existing job
export const updateJob = async (id, jobData) => {
  try {
    if (!id) {
      throw new Error('Job ID is required');
    }

    // Build update object with only provided fields
    const updateData = {};
    if (jobData.title) updateData.title = jobData.title;
    if (jobData.category) updateData.category = jobData.category;
    if (jobData.description) updateData.description = jobData.description;
    if (jobData.skills) updateData.skills = Array.isArray(jobData.skills) ? jobData.skills : jobData.skills.split(',').map(s => s.trim());
    if (jobData.employment_type) updateData.employment_type = jobData.employment_type;
    if (jobData.experience !== undefined) updateData.experience = jobData.experience || null;

    // Update job
    const { data, error } = await supabase
      .from('jobs')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating job:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('Job not found');
    }

    return { success: true, data: data[0], message: 'Job updated successfully' };
  } catch (error) {
    console.error('Error in updateJob:', error);
    throw error;
  }
};

// DELETE - Delete job
export const deleteJob = async (id) => {
  try {
    if (!id) {
      throw new Error('Job ID is required');
    }

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting job:', error);
      throw error;
    }

    return { success: true, message: 'Job deleted successfully' };
  } catch (error) {
    console.error('Error in deleteJob:', error);
    throw error;
  }
};
