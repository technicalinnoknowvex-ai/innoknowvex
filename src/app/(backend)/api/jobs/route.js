import { submitJobApplication } from './applications.js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key for server-side operations (including storage uploads)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!serviceRoleKey && !anonKey) {
  console.error('❌ CRITICAL: No Supabase keys configured! Set SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabaseKey = serviceRoleKey || anonKey;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req) {
  try {
    // Parse FormData
    const formData = await req.formData();
    
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const role = formData.get('role');
    const location = formData.get('location');
    const coverNote = formData.get('coverNote');
    const jobId = formData.get('jobId');
    const resumeFile = formData.get('resume');

    // Validate required fields
    if (!fullName || !email || !phone || !role || !resumeFile) {
      console.error('Missing required fields:', { fullName, email, phone, role, resumeFile: !!resumeFile });
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate resume file
    if (!(resumeFile instanceof File)) {
      console.error('Resume file is not a File instance');
      return Response.json(
        { success: false, error: "Invalid resume file" },
        { status: 400 }
      );
    }

    if (resumeFile.type !== 'application/pdf') {
      console.error('Resume file is not PDF:', resumeFile.type);
      return Response.json(
        { success: false, error: "Resume must be a PDF file" },
        { status: 400 }
      );
    }

    if (resumeFile.size > 5 * 1024 * 1024) {
      console.error('Resume file size exceeds 5MB:', resumeFile.size);
      return Response.json(
        { success: false, error: "Resume file must not exceed 5MB" },
        { status: 400 }
      );
    }

    console.log('Job application received:', { fullName, email, role, fileSize: resumeFile.size });

    // Upload resume to Supabase Storage
    let resumeUrl = null;
    try {
      const timestamp = Date.now();
      const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `resumes/${sanitizedEmail}_${timestamp}_${resumeFile.name}`;
      const arrayBuffer = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log('Attempting to upload file to Supabase:', { 
        fileName, 
        fileSize: buffer.length,
        contentType: resumeFile.type,
        supabaseUrl: supabaseUrl ? '✓ configured' : '✗ NOT configured',
        hasServiceRoleKey: !!serviceRoleKey,
        hasAnonKey: !!anonKey,
        usingKey: serviceRoleKey ? 'SERVICE_ROLE_KEY ✓' : (anonKey ? 'ANON_KEY (⚠️ limited permissions)' : '✗ NO KEY')
      });

      const { data, error: uploadError } = await supabase.storage
        .from('job-applications')
        .upload(fileName, buffer, {
          contentType: 'application/pdf',
          upsert: false,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('Resume upload error details:', { 
          error: uploadError,
          message: uploadError.message,
          status: uploadError.status,
          statusCode: uploadError.statusCode,
          hint: uploadError.hint,
          details: uploadError.details,
          keyBeingUsed: serviceRoleKey ? 'SERVICE_ROLE_KEY' : 'ANON_KEY'
        });
        // Provide more specific error guidance
        if (uploadError.message && uploadError.message.includes('base64url')) {
          throw new Error('Authentication failed. Service role key may be invalid or not configured. Please check SUPABASE_SERVICE_ROLE_KEY environment variable.');
        }
        if (uploadError.status === 401 || uploadError.statusCode === 401) {
          throw new Error('Unauthorized: Storage bucket permissions issue. Please verify storage bucket configuration.');
        }
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      if (data && data.path) {
        // Get public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from('job-applications')
          .getPublicUrl(fileName);
        
        resumeUrl = urlData?.publicUrl;
        console.log('Resume uploaded successfully:', { fileName, resumeUrl });
      } else {
        console.warn('Upload returned no data path');
      }
    } catch (uploadErr) {
      console.error('Failed to upload resume to Supabase:', {
        message: uploadErr.message,
        details: uploadErr,
        stack: uploadErr.stack
      });
      
      // Reject application if resume upload fails - resume is mandatory
      return Response.json(
        { success: false, error: `Resume upload failed: ${uploadErr.message}. Please try again.` },
        { status: 400 }
      );
    }

    // Ensure resume was successfully uploaded
    if (!resumeUrl) {
      console.error('Resume upload did not produce a URL');
      return Response.json(
        { success: false, error: "Resume upload failed. Please try again." },
        { status: 400 }
      );
    }

    // Prepare application data
    const applicationData = {
      fullName,
      email,
      phone,
      role,
      location,
      resumeLink: resumeUrl,
      coverNote,
      jobId: jobId ? parseInt(jobId) : null,
    };

    // Validate environment variable for Google Sheets
    const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL_JOB_APPLICATION || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

    // Submit to database first
    let dbResult;
    try {
      console.log('Submitting application to database...');
      dbResult = await submitJobApplication(applicationData);
      console.log('Database submission successful:', dbResult);
    } catch (dbError) {
      console.error('Database error details:', {
        message: dbError.message,
        error: dbError,
        applicationData: applicationData
      });
      return Response.json(
        { 
          success: false, 
          error: `Database Error: ${dbError.message || 'Failed to save application to database'}. Please try again or contact support.`
        },
        { status: 500 }
      );
    }

    // Then submit to Google Sheets if configured
    if (googleScriptUrl) {
      try {
        const payload = {
          ...applicationData,
          requestType: "jobApplication",
          timestamp: new Date().toISOString()
        };

        const response = await fetch(googleScriptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        // Don't fail completely if sheets fails, just continue
      } catch (sheetError) {
        console.error('Google Sheets submission failed:', sheetError);
        // Don't fail completely if sheets fails
      }
    }

    return Response.json({ 
      success: true, 
      dbResult: dbResult,
      message: '✅ Application submitted successfully with your resume. We will review and contact you soon!'
    });

  } catch (error) {
    console.error('Application submission error:', error);
    return Response.json(
      { success: false, error: error.message || "Unknown server error" },
      { status: 500 }
    );
  }
}
