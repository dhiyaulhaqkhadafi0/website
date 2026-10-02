import Link from "next/link";
import styles from "./discovery.module.css";
export function WorkAtlas() {
  return <div className={styles.atlas}>
    <div className={styles.atlasHeader}><span>Independent Work Atlas</span><span>Field notes / 01</span></div>
    <svg viewBox="0 0 440 300" fill="none" role="img" aria-label="Meja kerja independen: karya di laptop terhubung ke skill, portfolio, dan peluang">
      <defs><pattern id="atlas-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" stroke="currentColor" strokeOpacity=".09" /></pattern><linearGradient id="atlas-screen" x1="160" y1="105" x2="310" y2="210" gradientUnits="userSpaceOnUse"><stop stopColor="#a5ac91" stopOpacity=".18"/><stop offset="1" stopColor="#a5ac91" stopOpacity=".025"/></linearGradient></defs>
      <rect width="440" height="300" fill="url(#atlas-grid)"/>
      <ellipse cx="230" cy="201" rx="168" ry="73" stroke="currentColor" strokeOpacity=".2"/><ellipse cx="230" cy="201" rx="122" ry="48" stroke="currentColor" strokeOpacity=".12"/>
      <path className={styles.atlasPath} d="M52 98C100 56 145 67 196 94M340 61C393 104 399 162 361 218M70 235C94 254 141 265 175 256" stroke="currentColor" strokeOpacity=".6"/>
      <path d="m145 100 139-28 12 120-143 33-8-125Z" fill="#30332c" stroke="currentColor" strokeWidth="1.2"/>
      <path d="m156 108 118-24 9 98-122 27-5-101Z" fill="url(#atlas-screen)" stroke="currentColor" strokeOpacity=".3"/>
      <path d="m153 225 143-33 52 24-144 39-51-30Z" fill="#34372d" stroke="currentColor" strokeOpacity=".7"/>
      <path d="m181 227 112-26 25 11-113 29-24-14Z" stroke="currentColor" strokeOpacity=".25"/>
      <path d="m172 124 63-13m-62 24 88-18m-83 73 39-9" stroke="currentColor" strokeOpacity=".7"/>
      <path d="m177 149 26-5 3 29-28 6-1-30Zm38-8 44-9 3 29-46 10-1-30Z" stroke="currentColor" strokeOpacity=".4"/>
      <circle cx="52" cy="98" r="5" fill="#292a27" stroke="currentColor"/><circle cx="340" cy="61" r="5" fill="#292a27" stroke="currentColor"/><circle cx="70" cy="235" r="5" fill="#292a27" stroke="currentColor"/>
      <path d="M52 84V67h37M340 47V30h-38M70 249v17h35" stroke="currentColor" strokeOpacity=".4"/>
      <g fill="currentColor" fontSize="9" letterSpacing="1.5"><text x="92" y="69">SKILL</text><text x="243" y="33">PROOF OF WORK</text><text x="109" y="269">OPPORTUNITY</text></g>
      <path d="m330 153 36-8 4 24-37 9-3-25Z" stroke="currentColor" strokeOpacity=".4"/><path d="m337 158 20-4m-19 11 14-3" stroke="currentColor" strokeOpacity=".5"/>
    </svg>
    <div className={styles.atlasLinks}><Link href="/freelance/belajar/mulai-freelance"><small>01 / LEARN</small>Temukan arah ↗</Link><Link href="/freelance/belajar/mulai-freelance#04-portfolio"><small>02 / BUILD</small>Bangun bukti ↗</Link><Link href="/freelance/direktori"><small>03 / CONNECT</small>Jemput peluang ↗</Link></div>
    <p className={styles.atlasNote}>Satu skill. Satu karya nyata. Satu langkah berikutnya.</p>
  </div>;
}
