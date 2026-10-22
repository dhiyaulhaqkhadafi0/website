import type { Metadata } from "next";
import { EmailConfirmation } from "@/components/commerce/EmailConfirmation";
import { supabaseUrl, supabasePublishableKey } from "@/lib/supabase";
export const metadata: Metadata = { title: "Konfirmasi email", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default function Page() { return <EmailConfirmation url={supabaseUrl} publicKey={supabasePublishableKey} />; }
