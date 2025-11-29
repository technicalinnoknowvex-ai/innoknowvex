import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔧 Supabase Config:', {
  url: supabaseUrl,
  hasKey: !!supabaseKey
});

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // CRITICAL: Disabled to prevent auto-signin
    flowType: 'pkce'
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
export const requestPasswordReset = async (email) => {
  try {
    console.log('🔄 [RESET] Starting password reset request');
    console.log('📧 [RESET] Email:', email);
    console.log('🌐 [RESET] Origin:', window.location.origin);
    
    const redirectUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/student/reset-password`;
    console.log('🔗 [RESET] Redirect URL:', redirectUrl);
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    console.log('📬 [RESET] Supabase response:', { 
      data, 
      error,
      hasError: !!error 
    });

    if (error) throw error;

    console.log('✅ [RESET] Email sent successfully');
    return {
      success: true,
      message: 'Password reset email sent successfully'
    }
  } catch (error) {
    console.error('❌ [RESET] Error:', error);
    console.error('❌ [RESET] Error details:', {
      message: error.message,
      status: error.status,
      name: error.name
    });
    return {
      success: false,
      error: error.message
    }
  }
}

// Update password
export const updatePassword = async (newPassword) => {
  try {
    console.log('🔄 [UPDATE] Starting password update');
    
    // Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log('🔍 [UPDATE] Session check:', { 
      hasSession: !!session, 
      sessionError,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    });

    if (sessionError) {
      console.error('❌ [UPDATE] Session error:', sessionError);
      throw new Error('Session error: ' + sessionError.message);
    }

    if (!session) {
      console.error('❌ [UPDATE] No active session found');
      throw new Error('No active session. Please click the reset link again.');
    }

    console.log('✅ [UPDATE] Valid session found, updating password...');
    
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    console.log('📝 [UPDATE] Update response:', { 
      data, 
      error,
      hasError: !!error 
    });

    if (error) throw error;

    console.log('✅ [UPDATE] Password updated successfully');
    return {
      success: true,
      message: 'Password updated successfully'
    }
  } catch (error) {
    console.error('❌ [UPDATE] Error:', error);
    console.error('❌ [UPDATE] Error details:', {
      message: error.message,
      status: error.status,
      name: error.name
    });
    return {
      success: false,
      error: error.message
    }
  }
}

// Sign out
export const signOut = async () => {
  try {
    console.log('🔄 [SIGNOUT] Starting sign out');
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;

    console.log('✅ [SIGNOUT] Signed out successfully');
    return {
      success: true,
      message: 'Signed out successfully'
    }
  } catch (error) {
    console.error('❌ [SIGNOUT] Error:', error);
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

// Set session from tokens
export const setSessionFromTokens = async (accessToken, refreshToken) => {
  try {
    console.log('🔄 [SESSION] Setting session from tokens');
    console.log('🔑 [SESSION] Has access token:', !!accessToken);
    console.log('🔑 [SESSION] Has refresh token:', !!refreshToken);
    
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    console.log('📝 [SESSION] Set session response:', { 
      hasSession: !!data?.session,
      hasUser: !!data?.user,
      error 
    });

    if (error) throw error;

    console.log('✅ [SESSION] Session set successfully');
    return {
      success: true,
      session: data.session,
      user: data.user
    }
  } catch (error) {
    console.error('❌ [SESSION] Error:', error);
    return {
      success: false,
      error: error.message
    }
  }
}

// ========== STORAGE HELPER FUNCTIONS ==========

// Helper function to get public image URL
export const getImageUrl = (bucketName, folderPath, fileName) => {
  const cleanFolderPath = folderPath.replace(/^\/+|\/+$/g, '')
  const cleanFileName = fileName.replace(/^\/+|\/+$/g, '')
  
  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${cleanFolderPath}/${cleanFileName}`
}

// Helper function to get signed URL
export const getSignedImageUrl = async (bucketName, filePath) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, 3600)
  
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
      .list('', {
        limit: 100
      })
    
    if (error) throw error
    
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