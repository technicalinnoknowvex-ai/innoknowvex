"use server";

import { createClient } from "@/utils/supabase/server";
import { ROLES } from "@/constants/roles";

// Role-to-table mapping
const ROLE_TABLES = {
  [ROLES.STUDENT]: "student",
  [ROLES.ADMIN]: "admin",
};

// Validate if user exists and has correct role BEFORE attempting login
export async function validateUserRole({ email, expectedRole }) {
  const supabase = await createClient();

  try {
    const tableName = ROLE_TABLES[expectedRole];

    if (!tableName) {
      return {
        isValid: false,
        error: "Invalid role specified.",
      };
    }

    // Check if user exists in the expected role's table
    const { data: user, error } = await supabase
      .from(tableName)
      .select("email, id")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Validation query error:", error);
      return {
        isValid: false,
        error: "Unable to validate account. Please try again.",
      };
    }

    if (!user) {
      // Check if user exists in other role's table
      const otherRole =
        expectedRole === ROLES.STUDENT ? ROLES.ADMIN : ROLES.STUDENT;
      const otherTable = ROLE_TABLES[otherRole];

      const { data: otherUser } = await supabase
        .from(otherTable)
        .select("email")
        .eq("email", email)
        .maybeSingle();

      if (otherUser) {
        const correctPortal = otherRole.toLowerCase();
        return {
          isValid: false,
          error: `This email is registered as ${otherRole.toLowerCase()}. Please use the ${correctPortal} portal.`,
        };
      }

      return {
        isValid: false,
        error: "No account found with this email. Please sign up first.",
      };
    }

    return { isValid: true };
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
      throw new Error(authError.message || "Sign in failed");
    }
    if (!user) {
      throw new Error("Authentication failed - no user returned");
    }

    const role = user.user_metadata?.role || ROLES.STUDENT;
    if (role !== ROLES.ADMIN) {
      await supabase.auth.signOut();
      throw new Error("Unauthorized access: This is an admin-only portal");
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
      throw new Error(authError.message || "Sign in failed");
    }
    if (!user) {
      throw new Error("Authentication failed - no user returned");
    }

    const role = user.user_metadata?.role || ROLES.STUDENT;
    if (role !== ROLES.STUDENT) {
      await supabase.auth.signOut();
      throw new Error("Unauthorized access: This is a student-only portal");
    }

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
