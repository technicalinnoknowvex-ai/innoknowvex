"use client";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect, useCallback } from "react";

const supabase = createClient();

const useUserSession = () => {
  const [session, setSession] = useState(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateSession = useCallback((user, token) => {
    if (!user) {
      setSession(null);
      return;
    }

    const { user_metadata, email, id } = user;

    setSession({
      user_id: id,
      email: email || "",
      fullname: user_metadata?.fullname || "",
      user_code: user_metadata?.user_code || "",
      role: user_metadata?.role || "STUDENT",
      token,
    });
  }, []);

  const fetchSession = useCallback(async () => {
    setIsSessionLoading(true);
    setError(null);

    try {
      const {
        data: { session: authSession },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (authSession?.user) {
        updateSession(authSession.user, authSession.access_token);
      } else {
        setSession(null);
      }
    } catch (err) {
      console.error("Error fetching session:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setSession(null);
    } finally {
      setIsSessionLoading(false);
    }
  }, [updateSession]);

  useEffect(() => {
    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
        setIsSessionLoading(false);
        return;
      }

      if (session?.user) {
        updateSession(session.user, session.access_token);
      } else {
        setSession(null);
      }
      setIsSessionLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchSession, updateSession]);

  return {
    session,
    isSessionLoading,
    error,
    refreshSession: fetchSession,
  };
};

export default useUserSession;
