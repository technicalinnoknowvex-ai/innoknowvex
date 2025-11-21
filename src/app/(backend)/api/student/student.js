// app/api/student/student.js
import { createClient } from '@supabase/supabase-js';

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
  try {
    const { data, error } = await supabase
      .from('student')
      .select('*')
      .eq('id', studentId)
      .limit(1);

    if (error) throw error;
    
    return { success: true, data: data && data.length > 0 ? data[0] : null };
  } catch (error) {
    console.error('Error fetching student:', error);
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
      .from('student')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching students:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create new student
 * @param {Object} studentData - Student information
 * @param {string} studentData.id - Student ID (required)
 * @param {string} studentData.name - Student name (required)
 * @param {string} studentData.email - Student email (required)
 * @param {string} studentData.image - Profile image URL (optional)
 * @param {string} studentData.dob - Date of birth (optional)
 * @param {Array} studentData.skills - Array of skills (optional)
 * @param {Array} studentData.projects - Array of project objects (optional)
 * @param {Array} studentData.courses_enrolled - Array of courses (optional)
 * @returns {Promise<Object>} Created student data
 */
export async function createStudent(studentData) {
  try {
    const { data, error } = await supabase
      .from('student')
      .insert([{
        id: studentData.id,
        name: studentData.name,
        email: studentData.email,
        image: studentData.image || null,
        dob: studentData.dob || null,
        skills: studentData.skills || [],
        projects: studentData.projects || [],
        courses_enrolled: studentData.courses_enrolled || []
      }])
      .select()
      .limit(1);

    if (error) throw error;
    return { success: true, data: data && data.length > 0 ? data[0] : null };
  } catch (error) {
    console.error('Error creating student:', error);
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
    if (updates.courses_enrolled !== undefined) updateData.courses_enrolled = updates.courses_enrolled;

    const { data, error } = await supabase
      .from('student')
      .update(updateData)
      .eq('id', studentId)
      .select()
      .limit(1);

    if (error) throw error;
    return { success: true, data: data && data.length > 0 ? data[0] : null };
  } catch (error) {
    console.error('Error updating student:', error);
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
      .from('student')
      .delete()
      .eq('id', studentId);

    if (error) throw error;
    return { success: true, message: 'Student deleted successfully' };
  } catch (error) {
    console.error('Error deleting student:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Upload student profile image to Supabase Storage
 * @param {File} file - Image file
 * @param {string} studentId - Student ID for filename
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function uploadStudentImage(file, studentId) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${studentId}-${Date.now()}.${fileExt}`;
    const filePath = `student-profiles/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('student-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('student-images')
      .getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: error.message };
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
    if (!student.success) throw new Error('Student not found');

    const skills = student.data.skills || [];
    if (!skills.includes(skill)) {
      skills.push(skill);
      return await updateStudent(studentId, { skills });
    }
    return { success: true, data: student.data };
  } catch (error) {
    console.error('Error adding skill:', error);
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
    if (!student.success) throw new Error('Student not found');

    const projects = student.data.projects || [];
    projects.push(project);
    return await updateStudent(studentId, { projects });
  } catch (error) {
    console.error('Error adding project:', error);
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
    if (!student.success) throw new Error('Student not found');

    const courses = student.data.courses_enrolled || [];
    if (!courses.includes(course)) {
      courses.push(course);
      return await updateStudent(studentId, { courses_enrolled: courses });
    }
    return { success: true, data: student.data };
  } catch (error) {
    console.error('Error adding course:', error);
    return { success: false, error: error.message };
  }
}