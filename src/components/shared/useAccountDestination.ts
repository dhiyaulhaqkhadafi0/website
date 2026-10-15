"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { syncSession } from "@/components/commerce/SessionBridge";
export function useAccountDestination() {
  const [account, setAccount] = useState({ label: "Masuk", href: "/login" });
  useEffect(() => {
    let active = true;
    let revision = 0;
    async function update(token?: string) {
      const current = ++revision;
      if (!token) {
        if (active) setAccount({ label: "Masuk", href: "/login" });
        return;
      }
      try {
        const response = await syncSession(token);
        const data = await response.json();
        if (active && current === revision)
          setAccount(
            response.ok
              ? {
                  label: "Dashboard",
                  href:
                    data.destination === "/studio/overview"
                      ? data.destination
                      : "/account",
                }
              : { label: "Masuk", href: "/login" },
          );
      } catch {
        if (active && current === revision)
          setAccount({ label: "Masuk", href: "/login" });
      }
    }
    void supabase.auth
      .getSession()
      .then(({ data }) => update(data.session?.access_token))
      .catch(() => update());
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      queueMicrotask(() => {
        void update(session?.access_token);
      });
    });
    return () => {
      active = false;
      revision++;
      data.subscription.unsubscribe();
    };
  }, []);
  return account;
}
