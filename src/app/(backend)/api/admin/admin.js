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
  // // console.log("🚀 ~ adminId:", adminId);
  try {
    const { data, error } = await supabase
      .from('admin')
      .select('*')
      .eq('id', adminId)
      .limit(1);

    if (error) throw error;

    return { success: true, data: data && data.length > 0 ? data[0] : null };
  } catch (error) {
    // // console.error('Error fetching admin:', error);
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
    // console.error('Error fetching admins:', error);
    return { success: false, error: error.message, data: [] };
  }
}

/**
 * Create new admin
 * @param {Object} adminData - Admin information
 * @returns {Promise<Object>} Created admin data
 */
export async function createAdmin(adminData) {
  try {
    const { data, error } = await supabase
      .from('admin')
      .insert([
        {
          id: adminData.id,
          user_code: adminData.user_code,
          name: adminData.name,
          email: adminData.email,
          image: adminData.image || null,
          dob: adminData.dob || null,
          is_approved: adminData.is_approved || false
        }
      ])
      .select()
      .limit(1);

    if (error) throw error;
    
    return { success: true, data: data && data.length > 0 ? data[0] : null };
  } catch (error) {
    // console.error('Error creating admin:', error);
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
    // console.error('Error updating admin:', error);
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
    // console.error('Error deleting admin:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete old admin profile image from Supabase Storage
 * @param {string} imageUrl - The full image URL to delete
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteAdminImage(imageUrl) {
  try {
    if (!imageUrl) return { success: true };

    // Don't delete the default placeholder image
    if (imageUrl.includes('images.jpg')) {
      // console.log('Skipping deletion of default image');
      return { success: true };
    }

    // Extract the file path from the URL
    // URL format: https://xxx.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/Profile%20Images/filename.jpg
    const bucketName = 'Innoknowvex website content';
    const folderPath = 'Profile Images';
    
    // Try to extract filename from URL
    const urlParts = imageUrl.split(`${folderPath}/`);
    if (urlParts.length < 2) {
      // console.log('Invalid image URL format, skipping deletion');
      return { success: true };
    }

    const fileName = decodeURIComponent(urlParts[1]);
    const filePath = `${folderPath}/${fileName}`;
    
    // console.log('Deleting image at path:', filePath);

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      // console.error('Error deleting old image:', error);
      // Don't throw error, just log it - we don't want to block the upload
      return { success: false, error: error.message };
    }

    // console.log('✅ Old image deleted successfully');
    return { success: true };
  } catch (error) {
    // console.error('Error in deleteAdminImage:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Upload admin profile image to Supabase Storage
 * @param {File} file - Image file
 * @param {string} adminId - Admin ID for filename
 * @param {string} oldImageUrl - Old image URL to delete (optional)
 * @returns {Promise<Object>} Upload result with public URL
 */
export async function uploadAdminImage(file, adminId, oldImageUrl = null) {
  try {
    // console.log('Starting image upload process...');
    // console.log('Admin ID:', adminId);
    // console.log('Old image URL:', oldImageUrl);

    const bucketName = 'Innoknowvex website content';
    const folderPath = 'Profile Images';

    // Delete old image if it exists and it's not the default
    if (oldImageUrl && !oldImageUrl.includes('images.jpg')) {
      // console.log('Deleting old image...');
      await deleteAdminImage(oldImageUrl);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `admin_${adminId}.${fileExt}`; // Use adminId as filename for easy replacement
    const filePath = `${folderPath}/${fileName}`;

    // console.log('Uploading new image to:', filePath);

    // Upload with upsert: true to replace if exists
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // This will replace the file if it already exists
      });

    if (uploadError) {
      // console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    // console.log('✅ Upload successful! Public URL:', publicUrl);

    return { success: true, url: publicUrl };
  } catch (error) {
    // console.error('Error uploading image:', error);
    return { success: false, error: error.message, url: null };
  }
}