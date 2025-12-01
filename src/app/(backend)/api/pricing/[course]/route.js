import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// GET method to fetch pricing by course
export async function GET(request, { params }) {
  try {
    const { course } = await params;
    
    console.log('📊 [PRICING API] Fetching pricing for course:', course);

    if (!course) {
      return NextResponse.json(
        { error: 'Course name is required' },
        { status: 400 }
      );
    }

    // Fetch pricing directly from Supabase
    const { data, error } = await supabase
      .from('pricing')
      .select('*')
      .eq('course_name', course)
      .single();

    if (error) {
      console.error('❌ [PRICING API] Supabase error:', error);
      return NextResponse.json(
        { error: 'Pricing not found for this course' },
        { status: 404 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Pricing not found for this course' },
        { status: 404 }
      );
    }

    console.log('✅ [PRICING API] Pricing data found:', data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('❌ [PRICING API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing data' },
      { status: 500 }
    );
  }
}

// POST method (if you need it for admin updates)
export async function POST(request, { params }) {
  try {
    const { course } = params;
    const body = await request.json();
    
    console.log('📊 [PRICING API POST] Updating pricing for course:', course);
    
    const { data, error } = await supabase
      .from('pricing')
      .upsert({
        course_name: course,
        ...body
      }, {
        onConflict: 'course_name'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [PRICING API POST] Error:', error);
      return NextResponse.json(
        { error: 'Failed to update pricing' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('❌ [PRICING API POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update pricing data' },
      { status: 500 }
    );
  }
}