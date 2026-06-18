import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { userId, email, fullName } = body;

    // Validate required fields
    if (!userId || !email) {
      return NextResponse.json(
        { error: "userId and email are required" },
        { status: 400 }
      );
    }

    console.log('📝 Creating admin record for:', { userId, email, fullName });

    // Check if admin record already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from("admin")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing admin:", checkError);
      return NextResponse.json(
        { error: "Failed to check existing admin record" },
        { status: 500 }
      );
    }

    // If admin record already exists, just return success
    if (existingAdmin) {
      console.log('✅ Admin record already exists for:', userId);
      return NextResponse.json(
        { success: true, message: "Admin record already exists" },
        { status: 200 }
      );
    }

    // Create new admin record with is_approved = false
    const { data: newAdmin, error: insertError } = await supabase
      .from("admin")
      .insert({
        id: userId,
        email,
        name: fullName || null, // ✅ Fixed: use "name" not "full_name"
        is_approved: false, // ✅ Default to not approved
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Error creating admin record:", insertError);
      return NextResponse.json(
        { error: "Failed to create admin record: " + insertError.message },
        { status: 500 }
      );
    }

    console.log('✅ Admin record created successfully:', newAdmin);

    return NextResponse.json(
      {
        success: true,
        message: "Admin record created successfully. Awaiting approval.",
        admin: newAdmin,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ Unexpected error in create admin record:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create admin record" },
      { status: 500 }
    );
  }
}
