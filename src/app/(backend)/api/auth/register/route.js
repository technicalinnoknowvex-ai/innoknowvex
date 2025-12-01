import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

function generateCustomId(role) {
  const prefix = role === "ADMIN" ? "inno" : "stud";
  const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit number
  return `${prefix}${randomNum}`; // e.g. "inno963" or "stud452"
}

export async function POST(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password and role are required" },
        { status: 400 }
      );
    }

    if (!["ADMIN", "STUDENT"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be ADMIN or STUDENT." },
        { status: 400 }
      );
    }

    // Sign up user in Supabase auth with role metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      const tableName = role.toLowerCase(); // 'admin' or 'student'

      // Generate custom ID for profile record
      const customId = generateCustomId(role);

      try {
        // Insert into appropriate table with custom ID
        const { data: profileData, error: profileError } = await supabase
          .from(tableName)
          .insert({
            id: data.user.id,
            user_code: customId,
            name,
            email,
          })
          .select("id")
          .single();

        if (profileError) {
          console.error(`${role} profile creation error:`, profileError);
          return NextResponse.json(
            { error: `Failed to create ${role.toLowerCase()} profile` },
            { status: 500 }
          );
        }

        // Update user metadata with full info for frontend validation
        const { error: metaError } = await supabase.auth.updateUser({
          data: {
            user_id: data.user.id,
            email,
            fullname: name,
            user_code: customId,
            role,
            profile_id: profileData.id,
          },
        });

        if (metaError) {
          console.error("Error updating user metadata:", metaError);
        } else {
          console.log(
            `User metadata updated with ${role.toLowerCase()} profile info`
          );
        }
      } catch (profileErr) {
        console.error(
          `Exception during ${role.toLowerCase()} profile creation:`,
          profileErr
        );
      }
    }

    return NextResponse.json(
      { user: data.user, message: `${role} registered successfully` },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register API Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
