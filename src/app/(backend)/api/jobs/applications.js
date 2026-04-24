import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// POST - Submit job application
export const submitJobApplication = async (applicationData) => {
  try {
    const {
      fullName,
      email,
      phone,
      role,
      location,
      resumeLink,
      coverNote,
      jobId,
    } = applicationData;

    // Validation - resume link is required
    if (!fullName || !email || !phone || !role || !resumeLink) {
      throw new Error('Required fields missing: fullName, email, phone, role, resumeLink');
    }

    console.log('Attempting to insert application:', { fullName, email, phone, role });

    // Get the max ID and increment to generate new ID
    const { data: maxIdData, error: maxIdError } = await supabase
      .from('job_applications')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    if (maxIdError) {
      console.error('Error fetching max ID:', maxIdError);
      throw maxIdError;
    }

    const newId = maxIdData && maxIdData.length > 0 ? maxIdData[0].id + 1 : 1;

    // Insert application with generated ID
    const { data, error } = await supabase
      .from('job_applications')
      .insert([
        {
          id: newId,
          full_name: fullName,
          email,
          phone,
          job_title: role,
          location: location || null,
          resume_link: resumeLink,
          cover_note: coverNote || null,
          job_id: jobId || null,
          applied_at: new Date().toISOString(),
          status: 'received',
        },
      ])
      .select();

    if (error) {
      console.error('Error submitting application to database:', {
        error: error,
        message: error.message,
        code: error.code,
        details: error.details
      });
      throw error;
    }

    console.log('Application inserted successfully:', data);

    return { 
      success: true, 
      data: data[0], 
      message: 'Application submitted successfully. We will review and contact you soon!' 
    };
  } catch (error) {
    console.error('Error in submitJobApplication:', {
      message: error.message,
      error: error
    });
    throw error;
  }
};

// GET - Fetch all applications (admin only)
export const getApplications = async () => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .order('applied_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching applications:', error);
    return [];
  }
};

// GET - Fetch applications for specific job
export const getApplicationsByJobId = async (jobId) => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('job_id', jobId)
      .order('applied_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
};

// PUT - Update application status (admin only)
export const updateApplicationStatus = async (applicationId, status) => {
  try {
    if (!applicationId || !status) {
      throw new Error('Application ID and status are required');
    }

    const { data, error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', applicationId)
      .select();

    if (error) {
      console.error('Error updating application:', error);
      throw error;
    }

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error in updateApplicationStatus:', error);
    throw error;
  }
};

// DELETE - Delete application (admin only)
export const deleteApplication = async (applicationId) => {
  try {
    if (!applicationId) {
      throw new Error('Application ID is required');
    }

    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', applicationId);

    if (error) {
      console.error('Error deleting application:', error);
      throw error;
    }

    return { success: true, message: 'Application deleted successfully' };
  } catch (error) {
    console.error('Error in deleteApplication:', error);
    throw error;
  }
};
