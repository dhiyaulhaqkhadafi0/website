"use client";
import { useEffect, useState } from "react";
export function useAccountDestination() {
  const [account, setAccount] = useState({ label: "Masuk", href: "/login" });
  useEffect(() => {
    let active = true;
    let revision = 0;
    let unsubscribe = () => {};
    let initialized = false, previousToken: string | undefined;
    async function update(token?: string) {
      if (initialized && token === previousToken) return;
      initialized = true; previousToken = token;
      const current = ++revision;
      if (!token) {
        if (active) setAccount({ label: "Masuk", href: "/login" });
        return;
      }
      try {
        const response = await fetch("/api/auth/session", { method: "POST", headers: { Authorization: "Bearer " + token } });
        const data = await response.json();
        if (!response.ok) initialized = false;
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
        initialized = false;
        if (active && current === revision)
          setAccount({ label: "Masuk", href: "/login" });
      }
    }
    // The anonymous navbar can render without downloading the auth SDK first.
    const timer = setTimeout(() => { void import("@/lib/supabase").then(({supabase}) => {
      if (!active) return;
      void supabase.auth
      .getSession()
      .then(({ data }) => update(data.session?.access_token))
      .catch(() => update());
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      queueMicrotask(() => {
        void update(session?.access_token);
      });
    });
    unsubscribe = () => data.subscription.unsubscribe();
    }).catch(() => update()); }, 300);
    return () => {
      active = false;
      revision++;
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);
  return account;
}
