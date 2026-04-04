import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const body = await request.json();
    const { courses } = body;

    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      return NextResponse.json(
        { message: 'Courses array is required', success: false },
        { status: 400 }
      );
    }

    // Validate Supabase configuration
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { message: 'Server configuration error', success: false },
        { status: 500 }
      );
    }

    // Fetch all pricing data at once
    const { data, error } = await supabase
      .from('pricing_powerpack')
      .select('*');

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { message: 'Failed to fetch pricing data', success: false, error: error.message },
        { status: 500 }
      );
    }

    // Process all courses and match them
    const pricingResults = {};

    courses.forEach((course) => {
      // Find matching course data with flexible matching
      const courseData = data?.find(row => {
        const courseName = row.course_name?.toLowerCase().replace(/[-\s]/g, '-');
        const searchCourse = course.toLowerCase().replace(/[-\s]/g, '-');
        
        // Try exact match first
        if (courseName === searchCourse) return true;
        
        // Try partial matches for common variations
        if (courseName && searchCourse) {
          if (courseName.includes(searchCourse) || searchCourse.includes(courseName)) {
            return true;
          }
          
          const normalizedCourseName = courseName.replace(/[^a-z]/g, '');
          const normalizedSearchCourse = searchCourse.replace(/[^a-z]/g, '');
          
          if (normalizedCourseName === normalizedSearchCourse) {
            return true;
          }
        }
        
        return false;
      });

      if (courseData) {
        pricingResults[course] = {
          course_name: courseData.course_name || course,
          self_actual_price: parseFloat(courseData.self_actual_price) || 0,
          self_current_price: parseFloat(courseData.self_current_price) || 0,
          mentor_actual_price: parseFloat(courseData.mentor_actual_price) || 0,
          mentor_current_price: parseFloat(courseData.mentor_current_price) || 0,
          professional_actual_price: parseFloat(courseData.professional_actual_price) || 0,
          professional_current_price: parseFloat(courseData.professional_current_price) || 0,
          currency: courseData.currency || 'INR',
          created_at: courseData.created_at || new Date().toISOString(),
        };
      }
    });

    return NextResponse.json({ success: true, data: pricingResults }, { status: 200 });

  } catch (error) {
    console.error('Error fetching batch pricing data:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch pricing data',
        error: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}
