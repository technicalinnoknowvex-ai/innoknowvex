"use server";

import { createClient } from "@/utils/supabase/server";
import { ROLES } from "@/constants/roles";

const ROLE_TABLES = {
  [ROLES.STUDENT]: "STUDENT",
  [ROLES.ADMIN]: "ADMIN",
};

export async function validateUserRole({ email, expectedRole }) {
  const supabase = await createClient();

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        isValid: false,
        error: "No active session found.",
      };
    }

    if (user.email !== email) {
      return {
        isValid: false,
        error: "Email mismatch.",
      };
    }

    const userRole = user.user_metadata?.role;

    if (!userRole) {
      return {
        isValid: false,
        error: "Account role not set. Please contact support.",
      };
    }

    if (userRole !== expectedRole) {
      const correctPortal = userRole.toLowerCase();
      return {
        isValid: false,
        error: `This email is registered as ${userRole.toLowerCase()}. Please use the ${correctPortal} portal.`,
      };
    }

    return { isValid: true, user };
  } catch (error) {
    console.error("Validation error:", error);
    return {
      isValid: false,
      error: "Unable to validate account. Please try again.",
    };
  }
}

export async function adminSignIn({ email, password }) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      if (authError.message.includes("Email not confirmed")) {
        throw new Error("Please verify your email before signing in. Check your inbox for the verification link.");
      }
      if (authError.message.includes("Invalid login credentials")) {
        throw new Error("Invalid email or password.");
      }
      throw new Error(authError.message || "Sign in failed");
    }

    if (!user) {
      throw new Error("Authentication failed - no user returned");
    }

    const role = user.user_metadata?.role;
    
    if (!role) {
      await supabase.auth.signOut();
      throw new Error("Account setup incomplete. Please contact support.");
    }

    if (role !== ROLES.ADMIN) {
      await supabase.auth.signOut();
      throw new Error(`This account is registered as ${role}. Please use the ${role.toLowerCase()} portal.`);
    }

    // ✅ UPDATED: Just check if admin is approved (record should already exist from verification)
    const { data: adminData, error: adminError } = await supabase
      .from("admin")
      .select("is_approved")
      .eq("id", user.id)
      .single();

    if (adminError) {
      console.error("Error checking admin approval:", adminError);
      console.error("Admin error details:", {
        message: adminError.message,
        details: adminError.details,
        hint: adminError.hint,
        code: adminError.code
      });
      await supabase.auth.signOut();
      throw new Error("Unable to verify admin status. Please contact support.");
    }

    if (!adminData.is_approved) {
      await supabase.auth.signOut();
      throw new Error("Your admin account is pending approval. Please contact the system administrator.");
    }

    return {
      success: true,
      role,
      userId: user.id,
    };
  } catch (error) {
    console.error("Admin sign-in error:", error);
    throw error;
  }
}

export async function studentSignIn({ email, password }) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      if (authError.message.includes("Email not confirmed")) {
        throw new Error("Please verify your email before signing in. Check your inbox for the verification link.");
      }
      if (authError.message.includes("Invalid login credentials")) {
        throw new Error("Invalid email or password.");
      }
      throw new Error(authError.message || "Sign in failed");
    }

    if (!user) {
      throw new Error("Authentication failed - no user returned");
    }

    const role = user.user_metadata?.role;
    
    if (!role) {
      await supabase.auth.signOut();
      throw new Error("Account setup incomplete. Please contact support.");
    }

    if (role !== ROLES.STUDENT) {
      await supabase.auth.signOut();
      throw new Error(`This account is registered as ${role}. Please use the ${role.toLowerCase()} portal.`);
    }

    await ensureUserRecordExists(supabase, user, ROLES.STUDENT);

    return {
      success: true,
      role,
      userId: user.id,
    };
  } catch (error) {
    console.error("Student sign-in error:", error);
    throw error;
  }
}

async function ensureUserRecordExists(supabase, user, role) {
  const tableName = ROLE_TABLES[role];
  
  if (!tableName) {
    console.error("Invalid role for table creation:", role);
    return;
  }

  try {
    const { data: existingUser } = await supabase
      .from(tableName)
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!existingUser) {
      const insertData = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
        created_at: new Date().toISOString(),
      };

      // ✅ NEW: Add is_approved field for admin
      if (role === ROLES.ADMIN) {
        insertData.is_approved = false; // Default to not approved
      }

      const { error: insertError } = await supabase
        .from(tableName)
        .insert(insertData);

      if (insertError) {
        console.error("Error creating user record:", insertError);
      }
    }
  } catch (error) {
    console.error("Error ensuring user record exists:", error);
  }
}

export async function signOut() {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Sign-out failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Sign out failed",
    };
  }
}