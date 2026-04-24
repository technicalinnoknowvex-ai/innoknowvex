# Supabase Setup Guide for Job Applications

## Problem
Resume uploads are failing with: `Upload failed: Failed to base64url decode the Progran signature`

This happens because the authentication token is invalid or not configured properly.

## Solution

### 1. Get Your Supabase Service Role Key
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API** 
4. Copy the **Service Role** key (the longer one, NOT the public/anon key)
   - It looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2. Add to Environment Variables
Create or update `.env.local` in the root directory with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**DO NOT commit the `.env.local` file to Git** - this is local only.

### 3. Set Up Storage Bucket

Make sure you have a Supabase storage bucket named `job-applications`:

1. In Supabase Dashboard → **Storage**
2. Create a bucket called `job-applications` (if it doesn't exist)
3. Go to the bucket settings and set policies to allow uploads:
   - **Public Read**: Anonymous users can read
   - **Service Role Full Access**: Server-side uploads allowed

Or add this policy in SQL:
```sql
CREATE POLICY "Service role can upload resumes"
ON storage.objects
FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'job-applications');

CREATE POLICY "Public can read resumes"
ON storage.objects
FOR SELECT
USING (bucket_id = 'job-applications');
```

### 4. Verify Setup
After adding the environment variables, restart your dev server:

```bash
npm run dev
```

When you upload a resume, check the server logs. You should see:
```
Attempting to upload file to Supabase: { 
  ...
  usingKey: 'SERVICE_ROLE_KEY ✓'
}
```

## Troubleshooting

### Error: "base64url decode"
- **Cause**: Invalid or missing service role key
- **Fix**: Verify you copied the EXACT key from Supabase, with no extra spaces

### Error: "Unauthorized"
- **Cause**: Service role key is correct but storage bucket permissions are wrong
- **Fix**: Check storage bucket policies in Supabase dashboard

### Error: "Job-applications bucket not found"
- **Cause**: Bucket doesn't exist
- **Fix**: Create the bucket in Supabase Storage settings

## Files Updated
- `/src/app/(backend)/api/jobs/route.js` - Improved error logging and validation
- `/src/app/(backend)/api/jobs/applications.js` - Made resume URL mandatory
- `/src/components/Pages/Careers/CareersPage.jsx` - Updated success messages
