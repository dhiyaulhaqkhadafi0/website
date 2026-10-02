import Link from "next/link";
import { Compass, BriefcaseBusiness, PenTool, ArrowUpRight, Route } from "lucide-react";
import { FREELANCE_PLATFORMS, type FreelancePlatform } from "@/content/freelance-directory";
import styles from "./directory.module.css";

export function DirectoryVisual() {
  const lanes = [
    { label: "Proyek independen", note: "Offer, proposal, kontrak", type: "Freelance Platform", icon: BriefcaseBusiness },
    { label: "Karier remote", note: "Listing, profil, interview", type: "Remote Job Board", icon: Compass },
    { label: "Karya kreatif", note: "Portfolio, brief, discovery", type: "Creative Job Board", icon: PenTool },
  ];
  return <aside className={styles.opportunityMap} aria-label="Peta jalur peluang">
    <div className={styles.visualCaption}><span>Peta peluang</span><Route size={17} aria-hidden="true"/></div>
    <div className={styles.mapOrigin}><span className={styles.mapDot}/><span>Mulai dari cara kerjamu.</span></div>
    <div className={styles.mapLanes}>{lanes.map(({ label, note, type, icon: Icon }, i) => <Link key={type} href={`/freelance/direktori?type=${encodeURIComponent(type)}`}><span className={styles.laneIcon}><Icon size={20} strokeWidth={1.5} aria-hidden="true"/></span><div><small>0{i + 1}</small><strong>{label}</strong><span>{note}</span></div><span className={styles.laneCount}>{FREELANCE_PLATFORMS.filter(p => p.type === type).length}<ArrowUpRight size={14} aria-hidden="true"/></span></Link>)}</div>
    <p>Setiap jalur punya proses berbeda.<br/>Kenali modelnya sebelum memilih platform.</p>
  </aside>;
}
export function PlatformWorkflow({ platform }: { platform: FreelancePlatform }) {
  return <figure className={styles.workflow} aria-label={`Alur kerja ${platform.name}`}>
    <figcaption><span>Cara peluang terbentuk</span><Route size={17} aria-hidden="true"/></figcaption>
    <ol>{platform.workflow.map((step, i) => <li key={step}><span>0{i + 1}</span><strong>{step}</strong></li>)}</ol>
    <p>Model: {platform.model}. Alur ini merangkum proses, bukan jaminan mendapat pekerjaan.</p>
  </figure>;
}
