
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request, { params }) {
  try {
    // Await the params object (Next.js 15+ requirement)
    const resolvedParams = await params;
    const { course } = resolvedParams;

    if (!course) {
      return NextResponse.json(
        { message: 'Course parameter is required', success: false },
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

    // Query Supabase for pricing data
    const { data, error } = await supabase
      .from('pricing_powerpack') 
      .select('*')
      .or(`course_name.ilike.%${course}%,course_name.eq.${course}`)
      .single();

    if (error) {
      console.error('Supabase query error:', error);
      
      // If no exact match found, try a more flexible search
      const { data: flexibleData, error: flexibleError } = await supabase
        .from('pricing_powerpack')
        .select('*');

      if (flexibleError) {
        return NextResponse.json(
          { message: 'Failed to fetch pricing data', success: false, error: flexibleError.message },
          { status: 500 }
        );
      }

      // Find course with flexible matching
      const courseData = flexibleData?.find(row => {
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

      if (!courseData) {
        return NextResponse.json(
          { 
            message: `Pricing data not found for course: ${course}`, 
            success: false,
            availableCourses: flexibleData?.map(row => row.course_name).filter(Boolean) || []
          },
          { status: 404 }
        );
      }

      // Use the found course data
      const pricingData = {
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

      return NextResponse.json(pricingData, { status: 200 });
    }

    // Process the successful data
    const pricingData = {
      course_name: data.course_name || course,
      self_actual_price: parseFloat(data.self_actual_price) || 0,
      self_current_price: parseFloat(data.self_current_price) || 0,
      mentor_actual_price: parseFloat(data.mentor_actual_price) || 0,
      mentor_current_price: parseFloat(data.mentor_current_price) || 0,
      professional_actual_price: parseFloat(data.professional_actual_price) || 0,
      professional_current_price: parseFloat(data.professional_current_price) || 0,
      currency: data.currency || 'INR',
      created_at: data.created_at || new Date().toISOString(),
    };

    return NextResponse.json(pricingData, { status: 200 });

  } catch (error) {
    console.error('Error fetching pricing data:', error);
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

