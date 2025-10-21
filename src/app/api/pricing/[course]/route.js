import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============ HELPER FUNCTIONS (exported for use in components) ============

/**
 * Helper function to match program with pricing
 * Uses flexible matching strategies
 */
const findMatchingPricing = (program, pricingData) => {
  if (!pricingData || pricingData.length === 0) return null;

  const programId = program.id?.toLowerCase().trim();
  const programTitle = program.title?.toLowerCase().trim();

  // Try exact matches first
  let pricing = pricingData.find(p => {
    const pricingName = p.course_name?.toLowerCase().trim();
    return pricingName === programId || pricingName === programTitle;
  });

  if (pricing) {
    console.log('Found exact pricing match for:', program.id);
    return pricing;
  }

  // Try normalized matching (remove spaces, hyphens, underscores)
  const normalize = (str) => str?.replace(/[-\s_]/g, '').toLowerCase() || '';
  const normalizedId = normalize(programId);
  const normalizedTitle = normalize(programTitle);

  pricing = pricingData.find(p => {
    const normalizedPricing = normalize(p.course_name);
    return normalizedPricing === normalizedId || normalizedPricing === normalizedTitle;
  });

  if (pricing) {
    console.log('Found normalized pricing match for:', program.id);
    return pricing;
  }

  // Try partial matching
  pricing = pricingData.find(p => {
    const pricingName = p.course_name?.toLowerCase().trim() || '';
    return (
      pricingName.includes(programId) || 
      programId.includes(pricingName) ||
      pricingName.includes(programTitle) || 
      programTitle.includes(pricingName)
    );
  });

  if (pricing) {
    console.log('Found partial pricing match for:', program.id);
    return pricing;
  }

  // console.log('No pricing match found for:', program.id, 'Title:', program.title);
  return null;
};

/**
 * Fetch all programs with their pricing data
 * Combines data from programs and pricing tables
 */
export const getPrograms = async () => {
  try {
    console.log('Fetching all programs...');
    
    // Fetch all programs
    const { data: programs, error: programsError } = await supabase
      .from("programs")
      .select("*")
      .order("created_at", { ascending: true });

    if (programsError) {
      console.error("Error fetching programs:", programsError);
      throw programsError;
    }

    // console.log('Fetched programs:', programs?.length || 0);

    // Fetch all pricing data
    const { data: pricingData, error: pricingError } = await supabase
      .from("pricing")
      .select("*");

    if (pricingError) {
      console.error("Error fetching pricing:", pricingError);
    } else {
      console.log('Fetched pricing records:', pricingData?.length || 0);
      console.log('Pricing course names:', pricingData?.map(p => p.course_name) || []);
    }

    // Combine programs with their pricing
    const programsWithPricing = programs.map(program => {
      const pricing = findMatchingPricing(program, pricingData);

      return {
        ...program,
        pricing: pricing ? {
          self_actual_price: parseFloat(pricing.self_actual_price) || 0,
          self_current_price: parseFloat(pricing.self_current_price) || 0,
          mentor_actual_price: parseFloat(pricing.mentor_actual_price) || 0,
          mentor_current_price: parseFloat(pricing.mentor_current_price) || 0,
          professional_actual_price: parseFloat(pricing.professional_actual_price) || 0,
          professional_current_price: parseFloat(pricing.professional_current_price) || 0,
          currency: pricing.currency || 'INR',
          self_savings: pricing.self_actual_price > 0 
            ? Math.round(((pricing.self_actual_price - pricing.self_current_price) / pricing.self_actual_price) * 100)
            : 0,
          mentor_savings: pricing.mentor_actual_price > 0
            ? Math.round(((pricing.mentor_actual_price - pricing.mentor_current_price) / pricing.mentor_actual_price) * 100)
            : 0,
          professional_savings: pricing.professional_actual_price > 0
            ? Math.round(((pricing.professional_actual_price - pricing.professional_current_price) / pricing.professional_actual_price) * 100)
            : 0,
        } : null
      };
    });

    const programsWithoutPricing = programsWithPricing.filter(p => !p.pricing);
    if (programsWithoutPricing.length > 0) {
      console.warn('Programs without pricing:', programsWithoutPricing.map(p => ({
        id: p.id,
        title: p.title
      })));
    }

    console.log("Successfully combined programs with pricing");
    return programsWithPricing || [];
  } catch (error) {
    console.error("Unexpected error fetching programs:", error);
    return [];
  }
};

/**
 * Fetch a single program by ID with its pricing data
 * Combines data from programs and pricing tables
 */
export const getProgramById = async (programId) => {
  try {
    console.log("Fetching program with ID:", programId);
    
    // Fetch the program
    const { data: program, error: programError } = await supabase
      .from("programs")
      .select("*")
      .eq("id", programId)
      .single();

    if (programError) {
      console.error("Error fetching program:", programError);
      throw programError;
    }

    // console.log("Found program:", program.title);

    // Fetch all pricing data to use flexible matching
    const { data: allPricing, error: pricingError } = await supabase
      .from("pricing")
      .select("*");

    if (pricingError) {
      console.error("Error fetching pricing:", pricingError);
    } else {
      console.log("Available pricing entries:", allPricing?.map(p => p.course_name) || []);
    }

    // Find matching pricing
    const pricingData = findMatchingPricing(program, allPricing);

    if (!pricingData) {
      console.warn("No pricing found for program:", programId, "Title:", program.title);
    }

    // Combine program with pricing
    const programWithPricing = {
      ...program,
      pricing: pricingData ? {
        self_actual_price: parseFloat(pricingData.self_actual_price) || 0,
        self_current_price: parseFloat(pricingData.self_current_price) || 0,
        mentor_actual_price: parseFloat(pricingData.mentor_actual_price) || 0,
        mentor_current_price: parseFloat(pricingData.mentor_current_price) || 0,
        professional_actual_price: parseFloat(pricingData.professional_actual_price) || 0,
        professional_current_price: parseFloat(pricingData.professional_current_price) || 0,
        currency: pricingData.currency || 'INR',
        self_savings: pricingData.self_actual_price > 0 
          ? Math.round(((pricingData.self_actual_price - pricingData.self_current_price) / pricingData.self_actual_price) * 100)
          : 0,
        mentor_savings: pricingData.mentor_actual_price > 0
          ? Math.round(((pricingData.mentor_actual_price - pricingData.mentor_current_price) / pricingData.mentor_actual_price) * 100)
          : 0,
        professional_savings: pricingData.professional_actual_price > 0
          ? Math.round(((pricingData.professional_actual_price - pricingData.professional_current_price) / pricingData.professional_actual_price) * 100)
          : 0,
      } : null
    };

    console.log("Returning program with pricing:", {
      id: programWithPricing.id,
      title: programWithPricing.title,
      hasPricing: !!programWithPricing.pricing
    });

    return programWithPricing;
  } catch (error) {
    console.error("Unexpected error fetching program:", error);
    return null;
  }
};

/**
 * Get pricing for a specific plan of a program
 */
export const getProgramPricing = async (programId, plan) => {
  try {
    const program = await getProgramById(programId);
    
    if (!program || !program.pricing) {
      return {
        actual_price: 0,
        current_price: 0,
        savings: 0,
        currency: 'INR'
      };
    }

    const planLower = plan.toLowerCase();
    let actual_price = 0;
    let current_price = 0;
    let savings = 0;

    if (planLower === 'self' || planLower === 'self-paced') {
      actual_price = program.pricing.self_actual_price;
      current_price = program.pricing.self_current_price;
      savings = program.pricing.self_savings;
    } else if (planLower === 'mentor' || planLower === 'mentor-led') {
      actual_price = program.pricing.mentor_actual_price;
      current_price = program.pricing.mentor_current_price;
      savings = program.pricing.mentor_savings;
    } else if (planLower === 'professional') {
      actual_price = program.pricing.professional_actual_price;
      current_price = program.pricing.professional_current_price;
      savings = program.pricing.professional_savings;
    }

    return {
      actual_price,
      current_price,
      savings,
      currency: program.pricing.currency,
      program_title: program.title,
      program_category: program.category
    };
  } catch (error) {
    console.error("Error fetching program pricing:", error);
    return {
      actual_price: 0,
      current_price: 0,
      savings: 0,
      currency: 'INR'
    };
  }
};

/**
 * Search programs by title or category
 */
export const searchPrograms = async (searchTerm) => {
  try {
    const allPrograms = await getPrograms();
    
    const searchLower = searchTerm.toLowerCase().trim();
    
    return allPrograms.filter(program => {
      const titleMatch = program.title?.toLowerCase().includes(searchLower);
      const categoryMatch = program.category?.toLowerCase().includes(searchLower);
      const idMatch = program.id?.toLowerCase().includes(searchLower);
      
      return titleMatch || categoryMatch || idMatch;
    });
  } catch (error) {
    console.error("Error searching programs:", error);
    return [];
  }
};

// ============ API ROUTE HANDLER (for HTTP requests) ============

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { course } = resolvedParams;

    if (!course) {
      return NextResponse.json(
        { message: 'Course parameter is required', success: false },
        { status: 400 }
      );
    }

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { message: 'Server configuration error', success: false },
        { status: 500 }
      );
    }

    // console.log('API: Fetching pricing for course:', course);

    // Use the helper function to get program with pricing
    const programData = await getProgramById(course);

    if (!programData) {
      const allPrograms = await getPrograms();
      
      return NextResponse.json(
        { 
          message: `Program not found: ${course}`, 
          success: false,
          course_name: course,
          course_id: course,
          self_actual_price: 0,
          self_current_price: 0,
          mentor_actual_price: 0,
          mentor_current_price: 0,
          professional_actual_price: 0,
          professional_current_price: 0,
          currency: 'INR',
          availablePrograms: allPrograms?.map(p => ({
            id: p.id,
            title: p.title,
            category: p.category,
            hasPricing: !!p.pricing
          })) || []
        },
        { status: 404 }
      );
    }

    const pricingData = {
      success: true,
      course_name: programData.title,
      course_id: programData.id,
      course_title: programData.title,
      category: programData.category,
      self_actual_price: programData.pricing?.self_actual_price || 0,
      self_current_price: programData.pricing?.self_current_price || 0,
      mentor_actual_price: programData.pricing?.mentor_actual_price || 0,
      mentor_current_price: programData.pricing?.mentor_current_price || 0,
      professional_actual_price: programData.pricing?.professional_actual_price || 0,
      professional_current_price: programData.pricing?.professional_current_price || 0,
      currency: programData.pricing?.currency || 'INR',
      created_at: programData.created_at || new Date().toISOString(),
      self_savings: programData.pricing?.self_savings || 0,
      mentor_savings: programData.pricing?.mentor_savings || 0,
      professional_savings: programData.pricing?.professional_savings || 0,
      has_pricing: !!programData.pricing
    };

    // console.log('API: Returning pricing data:', {
    //   course_id: pricingData.course_id,
    //   has_pricing: pricingData.has_pricing,
    //   self_price: pricingData.self_current_price
    // });

    return NextResponse.json(pricingData, { status: 200 });

  } catch (error) {
    console.error('API Error fetching pricing data:', error);
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