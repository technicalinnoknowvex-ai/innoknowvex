import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request) {
  console.log('✅ CHECKPOINT 1: Callback route hit!')
  
  const requestUrl = new URL(request.url)
  console.log('✅ CHECKPOINT 2: Full URL:', requestUrl.href)
  console.log('✅ CHECKPOINT 2.5: Search string:', requestUrl.search)
  console.log('✅ CHECKPOINT 2.6: All search params:', Object.fromEntries(requestUrl.searchParams))
  
  const code = requestUrl.searchParams.get('code')
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')
  
  console.log('✅ CHECKPOINT 3: URL Parameters:', {
    code: code ? 'EXISTS' : 'MISSING',
    token_hash: token_hash ? 'EXISTS' : 'MISSING',
    type: type,
    error: error,
    error_description: error_description
  })

  // 🔥 CRITICAL: Don't process password reset (recovery) tokens here!
  // Let the reset password page handle them
 // Handle recovery type - redirect to reset password page AFTER verification
if (type === 'recovery' && code) {
  console.log('🔄 [CALLBACK] Recovery type detected - will verify and redirect');
  // Continue to code exchange below
}

  if (error) {
    console.error('❌ Error from Supabase:', error, error_description)
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/student/sign-in?error=${error}&message=${encodeURIComponent(error_description || error)}`
    )
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials')
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/student/sign-in?error=config_error`
    )
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })

  if (code) {
    console.log('✅ CHECKPOINT 5: Code exists, attempting to exchange for session...')
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('❌ CHECKPOINT 6: Code exchange error:', error)
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/student/sign-in?error=verification_failed&message=${encodeURIComponent(error.message)}`
        )
      }

      console.log('✅ CHECKPOINT 7: Code exchange successful!', {
        user: data.user?.email,
        session_exists: !!data.session
      })
      
      // ✅ Create user record in database after verification
      const user = data.user
      const userRole = user?.user_metadata?.role
      console.log('✅ CHECKPOINT 7.5: User role:', userRole)
      
      if (user && userRole) {
        await createUserRecordAfterVerification(supabase, user, userRole)
      }
      
      let redirectPath = '/auth/student/sign-in?verified=true'
      
    if (type === 'recovery') {
  // For password reset, redirect to reset password page
  redirectPath = '/auth/student/reset-password?verified=true'
} else if (userRole === 'admin') {
  redirectPath = '/auth/admin/sign-in?verified=true'
} else if (userRole === 'student') {
  redirectPath = '/auth/student/sign-in?verified=true'
}
      
      console.log('✅ CHECKPOINT 7.6: Redirecting to:', redirectPath)
      
      return NextResponse.redirect(
        `${requestUrl.origin}${redirectPath}`
      )

    } catch (error) {
      console.error('❌ CHECKPOINT 8: Callback error:', error)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/student/sign-in?error=verification_failed`
      )
    }
  }

  if (token_hash && type) {
    console.log('✅ CHECKPOINT 9: Token_hash exists, attempting legacy verification...')
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash,
        type
      })

      if (error) {
        console.error('❌ CHECKPOINT 10: Verification error:', error)
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/student/sign-in?error=verification_failed&message=${encodeURIComponent(error.message)}`
        )
      }

      console.log('✅ CHECKPOINT 11: Verification successful!')
      
      // ✅ Create user record in database after verification
      const user = data.user
      const userRole = user?.user_metadata?.role
      console.log('✅ CHECKPOINT 11.5: User role:', userRole)
      
      if (user && userRole) {
        await createUserRecordAfterVerification(supabase, user, userRole)
      }
      
      let redirectPath = '/auth/student/sign-in?verified=true'
      
      if (userRole === 'admin') {
        redirectPath = '/auth/admin/sign-in?verified=true'
      } else if (userRole === 'student') {
        redirectPath = '/auth/student/sign-in?verified=true'
      }
      
      console.log('✅ CHECKPOINT 11.6: Redirecting to:', redirectPath)
      
      return NextResponse.redirect(
        `${requestUrl.origin}${redirectPath}`
      )

    } catch (error) {
      console.error('❌ CHECKPOINT 12: Callback error:', error)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/student/sign-in?error=verification_failed`
      )
    }
  }

  console.log('❌ CHECKPOINT 13: No code or token_hash found')
  console.log('This likely means the email template is not using {{ .ConfirmationURL }} correctly')
  
  return NextResponse.redirect(
    `${requestUrl.origin}/auth/student/sign-in?error=missing_token`
  )
}

// ✅ Helper function to create user record after email verification
async function createUserRecordAfterVerification(supabase, user, role) {
  const ROLE_TABLES = {
    'student': 'student',
    'admin': 'admin',
  }
  
  const tableName = ROLE_TABLES[role]
  
  if (!tableName) {
    console.error('❌ Invalid role for table creation:', role)
    return
  }

  try {
    console.log(`✅ CHECKPOINT: Checking if ${role} record exists for user:`, user.id)
    
    // Check if record already exists
    const { data: existingUser } = await supabase
      .from(tableName)
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    if (existingUser) {
      console.log(`✅ CHECKPOINT: ${role} record already exists`)
      return
    }

    console.log(`✅ CHECKPOINT: Creating ${role} record...`)
    
    // Generate user_code
    const userCode = `${role.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    
    const insertData = {
      id: user.id,
      user_code: userCode,
      name: user.user_metadata?.full_name || 'Unknown',
      email: user.email,
      created_at: new Date().toISOString(),
    }

    // Add is_approved field for admin (default false)
    if (role === 'admin') {
      insertData.is_approved = false
    }

    const { data, error: insertError } = await supabase
      .from(tableName)
      .insert(insertData)
      .select()

    if (insertError) {
      console.error(`❌ Error creating ${role} record:`, insertError)
    } else {
      console.log(`✅ CHECKPOINT: ${role} record created successfully:`, data)
    }
  } catch (error) {
    console.error(`❌ Error in createUserRecordAfterVerification for ${role}:`, error)
  }
}