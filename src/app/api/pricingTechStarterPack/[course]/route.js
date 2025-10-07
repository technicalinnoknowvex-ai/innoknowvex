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
    // Get the course parameter from the URL using Next.js 15+ approach
    const resolvedParams = await params;
    const course = resolvedParams.course;

    console.log('🔍 Fetching pricing for course:', course);

    if (!course || course === '[course]') {
      return NextResponse.json(
        { message: 'Course parameter is required', success: false },
        { status: 400 }
      );
    }

    // Validate Supabase configuration
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase configuration');
      return NextResponse.json(
        { message: 'Server configuration error', success: false },
        { status: 500 }
      );
    }

    console.log('📊 Querying Supabase for course:', course);

    const { data, error } = await supabase
      .from('pricing_techpack') 
      .select('*')
      .eq('program_id', course)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('❌ Supabase query error:', error);
      
      // If no exact match found, try to get any active tech pack
      const { data: allData, error: allError } = await supabase
        .from('pricing_techpack')
        .select('*')
        .eq('is_active', true)
        .limit(1);

      if (allError) {
        console.error('❌ Error fetching all techpacks:', allError);
        return NextResponse.json(
          { 
            message: 'Failed to fetch pricing data', 
            success: false, 
            error: allError.message 
          },
          { status: 500 }
        );
      }

      if (!allData || allData.length === 0) {
        console.log('📭 No active tech packs found in database');
        return NextResponse.json(
          { 
            message: `No active tech packs found`, 
            success: false,
            suggestion: 'Please check if tech-starter-pack exists in pricing_techpack table'
          },
          { status: 404 }
        );
      }

      // Use the first active tech pack as fallback
      const fallbackData = allData[0];
      console.log('🔄 Using fallback data:', fallbackData);

      const pricingData = {
        program_id: fallbackData.program_id,
        program_name: fallbackData.program_name,
        original_price: parseInt(fallbackData.original_price) || 33000,
        current_price: parseInt(fallbackData.current_price) || 25000,
        currency: fallbackData.currency || 'INR',
        description: fallbackData.description,
        features: fallbackData.features || [
          { name: "All Programming Languages", included: true },
          { name: "Complete DSA Coverage", included: true },
          { name: "Multiple Learning Plans", included: true },
          { name: "Lifetime Support", included: true }
        ],
        is_active: fallbackData.is_active,
      };

      return NextResponse.json(pricingData, { status: 200 });
    }

    console.log('✅ Found pricing data:', data);

    // Process the successful data
    const pricingData = {
      program_id: data.program_id,
      program_name: data.program_name,
      original_price: parseInt(data.original_price) || 33000,
      current_price: parseInt(data.current_price) || 25000,
      currency: data.currency || 'INR',
      description: data.description,
      features: data.features || [
        { name: "All Programming Languages", included: true },
        { name: "Complete DSA Coverage", included: true },
        { name: "Multiple Learning Plans", included: true },
        { name: "Lifetime Support", included: true }
      ],
      is_active: data.is_active,
    };

    return NextResponse.json(pricingData, { status: 200 });

  } catch (error) {
    console.error('💥 Error fetching techpack pricing data:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch techpack pricing data',
        error: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}