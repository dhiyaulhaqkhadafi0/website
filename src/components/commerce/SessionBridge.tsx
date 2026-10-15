"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
export async function syncSession(token: string) {
  return fetch("/api/auth/session", {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
  });
}
export function SessionBridge() {
  useEffect(() => {
    let alive = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (alive && data.session) void syncSession(data.session.access_token);
    });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT")
        void fetch("/api/auth/session", { method: "DELETE" });
      else if (session) void syncSession(session.access_token);
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);
  return null;
}
