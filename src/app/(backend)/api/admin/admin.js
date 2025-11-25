import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Get admin by ID
 * @param {string} adminId - The admin ID
 * @returns {Promise<Object>} Admin data
 */
export async function getAdmin(adminId) {
  console.log("🚀 ~ adminId:", adminId);
  try {
    const { data, error } = await supabase
      .from('admin')
      .select('*')
      .eq('id', adminId)
      .limit(1);

    if (error) throw error;

    return { success: true, data: data && data.length > 0 ? data[0] : null };
  } catch (error) {
    console.error('Error fetching admin:', error);
    return { success: false, error: error.message, data: null };
  }
}

/**
 * Get all admins
 * @returns {Promise<Array>} List of admins
 */
export async function getAllAdmins() {
  try {
    const { data, error } = await supabase
      .from('admin')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching admins:', error);
    return { success: false, error: error.message, data: [] };
  }
}

/**
 * Create new admin
 * @param {Object} adminData - Admin information
 * @param {string} adminData.id - Admin ID (required)
 * @param {string} adminData.name - Admin name (required)
 * @param {string} adminData.email - Admin email (required)
 * @param {string} adminData.image - Profile image URL (optional)
 * @param {string} adminData.dob - Date of birth (optional)
 * @returns {Promise<Object>} Created admin data
 */
export async function createAdmin(adminData) {
  try {
    const { data, error } = await supabase
      .from('admin')
      .insert([
        {
          id: adminData.id,
          name: adminData.name,
          email: adminData.email,
          image: adminData.image || null,
          dob: adminData.dob || null
        }
      ])
      .select()
      .limit(1);

    if (error) throw error;
    
    return { success: true, data: data && data.length > 0 ? data[0] : null };
  } catch (error) {
    console.error('Error creating admin:', error);
    return { success: false, error: error.message, data: null };
  }
}

/**
 * Update admin information
 * @param {string} adminId - The admin ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated admin data
 */
export async function updateAdmin(adminId, updates) {
  try {
    const updateData = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.image !== undefined) updateData.image = updates.image;
    if (updates.dob !== undefined) updateData.dob = updates.dob;

    const { data, error } = await supabase
      .from('admin')
      .update(updateData)
      .eq('id', adminId)
      .select()
      .limit(1);

    if (error) throw error;
    
    return { success: true, data: data && data.length > 0 ? data[0] : null };
  } catch (error) {
    console.error('Error updating admin:', error);
    return { success: false, error: error.message, data: null };
  }
}

/**
 * Delete admin
 * @param {string} adminId - The admin ID
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteAdmin(adminId) {
  try {
    const { error } = await supabase
      .from('admin')
      .delete()
      .eq('id', adminId);

    if (error) throw error;
    
    return { success: true, message: 'Admin deleted successfully' };
  } catch (error) {
    console.error('Error deleting admin:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Upload admin profile image to Supabase Storage
 * @param {File} file - Image file
 * @param {string} adminId - Admin ID for filename
 * @returns {Promise<Object>} Upload result with public URL
 */
export async function uploadAdminImage(file, adminId) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${adminId}-${Date.now()}.${fileExt}`;
    const filePath = `admin-profiles/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('admin-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('admin-images')
      .getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: error.message, url: null };
  }
}