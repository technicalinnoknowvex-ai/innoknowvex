import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Test database connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('count', { count: 'exact' })
    
    if (error) {
      console.error('Database connection failed:', error)
      return false
    }
    
    console.log('✅ Database connected successfully')
    return true
  } catch (error) {
    console.error('Database connection error:', error)
    return false
  }
}

// ========== AUTH HELPER FUNCTIONS ==========

// Sign up with email confirmation
export const signUpWithEmail = async (email, password, redirectUrl, additionalData = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: additionalData
      }
    })

    if (error) throw error

    return {
      success: true,
      user: data.user,
      session: data.session,
      emailConfirmationRequired: !data.session
    }
  } catch (error) {
    console.error('Sign up error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    return {
      success: true,
      user: data.user,
      session: data.session
    }
  } catch (error) {
    console.error('Sign in error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Request password reset email
export const requestPasswordReset = async (email, redirectUrl) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    })

    if (error) throw error

    return {
      success: true,
      message: 'Password reset email sent successfully'
    }
  } catch (error) {
    console.error('Password reset request error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Update password (used after clicking reset link)
export const updatePassword = async (newPassword) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error

    return {
      success: true,
      message: 'Password updated successfully'
    }
  } catch (error) {
    console.error('Password update error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) throw error

    return {
      success: true,
      message: 'Signed out successfully'
    }
  } catch (error) {
    console.error('Sign out error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) throw error

    return {
      success: true,
      user
    }
  } catch (error) {
    console.error('Get user error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Get current session
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) throw error

    return {
      success: true,
      session
    }
  } catch (error) {
    console.error('Get session error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Resend confirmation email
export const resendConfirmationEmail = async (email, redirectUrl) => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: redirectUrl
      }
    })

    if (error) throw error

    return {
      success: true,
      message: 'Confirmation email resent successfully'
    }
  } catch (error) {
    console.error('Resend confirmation error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Set session from tokens (used in verification callbacks)
export const setSessionFromTokens = async (accessToken, refreshToken) => {
  try {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    })

    if (error) throw error

    return {
      success: true,
      session: data.session,
      user: data.user
    }
  } catch (error) {
    console.error('Set session error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// ========== STORAGE HELPER FUNCTIONS ==========

// Helper function to get public image URL
export const getImageUrl = (bucketName, folderPath, fileName) => {
  // Remove any leading/trailing slashes and format the path properly
  const cleanFolderPath = folderPath.replace(/^\/+|\/+$/g, '')
  const cleanFileName = fileName.replace(/^\/+|\/+$/g, '')
  
  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${cleanFolderPath}/${cleanFileName}`
}

// Helper function to get signed URL (if files are private)
export const getSignedImageUrl = async (bucketName, filePath) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, 3600) // 1 hour expiry
  
  if (error) {
    console.error('Error creating signed URL:', error)
    return null
  }
  
  return data?.signedUrl
}

// Function to list all files in a folder
export const listFilesInFolder = async (bucketName, folderPath = '') => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(folderPath, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    })
  
  if (error) {
    console.error('Error listing files:', error)
    throw error
  }
  
  return data || []
}

// Function to get all images from a specific folder
export const getFolderImages = async (bucketName, folderPath) => {
  try {
    const files = await listFilesInFolder(bucketName, folderPath)
    
    const imageFiles = files.filter(file => 
      file.name && file.name.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)
    )
    
    return imageFiles.map(file => ({
      name: file.name,
      url: getImageUrl(bucketName, folderPath, file.name),
      path: `${folderPath}/${file.name}`.replace(/\/\//g, '/')
    }))
  } catch (error) {
    console.error('Error getting folder images:', error)
    return []
  }
}

// Function to get all available folders in your bucket
export const getStorageFolders = async (bucketName) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', { // Root level
        limit: 100
      })
    
    if (error) throw error
    
    // Return only folders (items with null mimetype are folders in Supabase)
    return data.filter(item => !item.mimetype).map(folder => folder.name)
  } catch (error) {
    console.error('Error getting storage folders:', error)
    return []
  }
}

// Test storage connection
export const testStorageConnection = async () => {
  try {
    const { data, error } = await supabase.storage
      .from('Innoknowvex website content')
      .list('', { limit: 1 })
    
    if (error) {
      console.error('Storage connection failed:', error)
      return false
    }
    
    console.log('✅ Storage connected successfully')
    return true
  } catch (error) {
    console.error('Storage connection error:', error)
    return false
  }
}