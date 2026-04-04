// app/api/student/student.js
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Get student by ID
 * @param {string} studentId - The student ID
 * @returns {Promise<Object>} Student data
 */
export async function getStudent(studentId) {
  console.log("🚀 ~ studentId:", studentId);
  try {
    const { data, error } = await supabase
      .from("student")
      .select("*")
      .eq("id", studentId)
      .limit(1);

    if (error) throw error;

    return { success: true, data: data && data.length > 0 ? data[0] : null };
  } catch (error) {
    console.error("Error fetching student:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all students
 * @returns {Promise<Array>} List of students
 */
export async function getAllStudents() {
  try {
    const { data, error } = await supabase
      .from("student")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching students:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Create new student
 * @param {Object} studentData - Student information
 * @returns {Promise<Object>} Created student data
 */
export async function createStudent(studentData) {
  try {
    const { data, error } = await supabase
      .from("student")
      .insert([
        {
          id: studentData.id,
          name: studentData.name,
          email: studentData.email,
          image: studentData.image || null,
          dob: studentData.dob || null,
          skills: studentData.skills || [],
          projects: studentData.projects || [],
          courses_enrolled: studentData.courses_enrolled || [],
        },
      ])
      .select()
      .limit(1);

    if (error) throw error;
    return { success: true, data: data && data.length > 0 ? data[0] : null };
  } catch (error) {
    console.error("Error creating student:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Update student information
 * @param {string} studentId - The student ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated student data
 */
export async function updateStudent(studentId, updates) {
  try {
    const updateData = {};

    if (updates.name) updateData.name = updates.name;
    if (updates.email) updateData.email = updates.email;
    if (updates.image !== undefined) updateData.image = updates.image;
    if (updates.dob !== undefined) updateData.dob = updates.dob;
    if (updates.skills !== undefined) updateData.skills = updates.skills;
    if (updates.projects !== undefined) updateData.projects = updates.projects;
    if (updates.courses_enrolled !== undefined)
      updateData.courses_enrolled = updates.courses_enrolled;

    const { data, error } = await supabase
      .from("student")
      .update(updateData)
      .eq("id", studentId)
      .select()
      .limit(1);

    if (error) throw error;
    return { success: true, data: data && data.length > 0 ? data[0] : null };
  } catch (error) {
    console.error("Error updating student:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete student
 * @param {string} studentId - The student ID
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteStudent(studentId) {
  try {
    const { error } = await supabase
      .from("student")
      .delete()
      .eq("id", studentId);

    if (error) throw error;
    return { success: true, message: "Student deleted successfully" };
  } catch (error) {
    console.error("Error deleting student:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete old student profile image from Supabase Storage
 * @param {string} imageUrl - The full image URL to delete
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteStudentImage(imageUrl) {
  try {
    if (!imageUrl) return { success: true };

    // Don't delete the default placeholder image
    if (imageUrl.includes('images.jpg')) {
      console.log('Skipping deletion of default image');
      return { success: true };
    }

    // Extract the file path from the URL
    const bucketName = 'Innoknowvex website content';
    const folderPath = 'Profile Images';
    
    // Try to extract filename from URL
    const urlParts = imageUrl.split(`${folderPath}/`);
    if (urlParts.length < 2) {
      console.log('Invalid image URL format, skipping deletion');
      return { success: true };
    }

    const fileName = decodeURIComponent(urlParts[1]);
    const filePath = `${folderPath}/${fileName}`;
    
    console.log('Deleting image at path:', filePath);

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting old image:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Old image deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('Error in deleteStudentImage:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Upload student profile image to Supabase Storage
 * @param {File} file - Image file
 * @param {string} studentId - Student ID for filename
 * @param {string} oldImageUrl - Old image URL to delete (optional)
 * @returns {Promise<Object>} Upload result with public URL
 */
export async function uploadStudentImage(file, studentId, oldImageUrl = null) {
  try {
    console.log('Starting image upload process...');
    console.log('Student ID:', studentId);
    console.log('Old image URL:', oldImageUrl);

    const bucketName = 'Innoknowvex website content';
    const folderPath = 'Profile Images';

    // Delete old image if it exists and it's not the default
    if (oldImageUrl && !oldImageUrl.includes('images.jpg')) {
      console.log('Deleting old image...');
      await deleteStudentImage(oldImageUrl);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `student_${studentId}.${fileExt}`;
    const filePath = `${folderPath}/${fileName}`;

    console.log('Uploading new image to:', filePath);

    // Upload with upsert: true to replace if exists
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    console.log('✅ Upload successful! Public URL:', publicUrl);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: error.message, url: null };
  }
}

/**
 * Add skill to student
 * @param {string} studentId - Student ID
 * @param {string} skill - Skill to add
 * @returns {Promise<Object>} Updated student data
 */
export async function addSkillToStudent(studentId, skill) {
  try {
    const student = await getStudent(studentId);
    if (!student.success) throw new Error("Student not found");

    const skills = student.data.skills || [];
    if (!skills.includes(skill)) {
      skills.push(skill);
      return await updateStudent(studentId, { skills });
    }
    return { success: true, data: student.data };
  } catch (error) {
    console.error("Error adding skill:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Add project to student
 * @param {string} studentId - Student ID
 * @param {Object} project - Project object with title, description, link
 * @returns {Promise<Object>} Updated student data
 */
export async function addProjectToStudent(studentId, project) {
  try {
    const student = await getStudent(studentId);
    if (!student.success) throw new Error("Student not found");

    const projects = student.data.projects || [];
    projects.push(project);
    return await updateStudent(studentId, { projects });
  } catch (error) {
    console.error("Error adding project:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Add course to student
 * @param {string} studentId - Student ID
 * @param {string} course - Course name
 * @returns {Promise<Object>} Updated student data
 */
export async function addCourseToStudent(studentId, course) {
  try {
    const student = await getStudent(studentId);
    if (!student.success) throw new Error("Student not found");

    const courses = student.data.courses_enrolled || [];
    if (!courses.includes(course)) {
      courses.push(course);
      return await updateStudent(studentId, { courses_enrolled: courses });
    }
    return { success: true, data: student.data };
  } catch (error) {
    console.error("Error adding course:", error);
    return { success: false, error: error.message };
  }
}