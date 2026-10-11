import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { Unsubscribe } from "@/components/freelance/Unsubscribe";
export const metadata: Metadata = { title: "Kelola Freelance Field Notes", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default function Page() { return <><Navbar/><Unsubscribe/></>; }
