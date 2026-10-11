export interface RemoteJob {
  id: string;
  title: string;
  company: string;
  field: string;
  level: "Pemula" | "Intermediate" | "Expert";
  employment: string;
  locations: string[];
  locationNote: string;
  summary: string;
  requirements: string;
  salary: string;
  sourceUrl: string;
  verifiedAt: string;
  reviewBy: string;
  status: "open" | "closed";
}

// Editorial summaries of individual roles, verified against the employer's
// Greenhouse board. Recheck the original listing before extending reviewBy.
const wikimedia = {
  company: "Wikimedia Foundation",
  locations: ["Indonesia", "Negara tertentu"],
  locationNote: "Indonesia tercantum dalam daftar negara hiring. Izin kerja lokal wajib; negara lain mengikuti daftar pada sumber resmi.",
  verifiedAt: "2026-10-11",
  reviewBy: "2026-10-25",
  status: "open" as const,
};
export const REMOTE_JOBS: RemoteJob[] = [
  { ...wikimedia, id: "wikimedia-8248898", title: "Communications Lead, Wikimedia Enterprise", field: "Marketing", level: "Expert", employment: "Contract", summary: "Mengembangkan komunikasi eksternal, hubungan media, dan peluncuran Wikimedia Enterprise. Kontrak awal 6 bulan, 40 jam per minggu.", requirements: "Pengalaman komunikasi 8+ tahun, termasuk teknologi B2B; kemampuan editorial dan pengelolaan stakeholder.", salary: "Rentang AS US$118.361–182.658/tahun. Kompensasi di luar AS disesuaikan negara; bukan kisaran gaji Indonesia.", sourceUrl: "https://job-boards.greenhouse.io/wikimedia/jobs/8248898" },
  { ...wikimedia, id: "wikimedia-8136610", title: "Lead Learning Experience Designer", field: "Design", level: "Expert", employment: "Periksa sumber", summary: "Merancang pengalaman belajar digital yang aksesibel untuk relawan dan komunitas Wikimedia.", requirements: "Peran lead untuk profesional berpengalaman dalam learning experience; cek persyaratan dan bentuk kontrak pada listing.", salary: "Kompensasi mengikuti lokasi kandidat. Periksa rentang dan ketentuan pada sumber resmi.", sourceUrl: "https://job-boards.greenhouse.io/wikimedia/jobs/8136610" },
  { ...wikimedia, id: "wikimedia-8210560", title: "Senior Data Scientist, Safety & Security", field: "Data", level: "Expert", employment: "Periksa sumber", summary: "Peran data science senior untuk mendukung keselamatan dan keamanan ekosistem Wikimedia.", requirements: "Periksa syarat pengalaman, kemampuan statistik, dan tanggung jawab teknis pada listing resmi.", salary: "Kompensasi mengikuti lokasi kandidat. Periksa rentang dan ketentuan pada sumber resmi.", sourceUrl: "https://job-boards.greenhouse.io/wikimedia/jobs/8210560" },
  { ...wikimedia, id: "wikimedia-8223864", title: "Senior Software Engineer, Core Experiences", field: "Development", level: "Expert", employment: "Contract", summary: "Membangun pengalaman web mobile, API, dan integrasi platform. Kontrak full-time 3 bulan.", requirements: "Pengalaman 5–10+ tahun; JavaScript/TypeScript, framework web, dan backend seperti PHP. Minimal 4 jam kerja beririsan dengan 15.00–21.00 UTC (22.00–04.00 WIB).", salary: "Rentang AS US$56,07–87,13/jam. Kompensasi di luar AS disesuaikan negara; bukan kisaran gaji Indonesia.", sourceUrl: "https://job-boards.greenhouse.io/wikimedia/jobs/8223864" },
];
export function activeRemoteJobs(now = new Date()) {
  const day = now.toISOString().slice(0, 10);
  return REMOTE_JOBS.filter(job => job.status === "open" && job.verifiedAt <= day && job.reviewBy >= day);
}
export function filterRemoteJobs(jobs: RemoteJob[], params: URLSearchParams) {
  const words = (params.get("q") || "").trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return jobs.filter(job => words.every(word => `${job.title} ${job.company} ${job.summary} ${job.field} ${job.requirements}`.toLocaleLowerCase().includes(word)) &&
    (!params.get("location") || job.locations.includes(params.get("location")!)) &&
    (!params.get("field") || job.field === params.get("field")) &&
    (!params.get("level") || job.level === params.get("level")) &&
    (!params.get("employment") || job.employment === params.get("employment")))
    .sort((a, b) => params.get("sort") === "az" ? a.title.localeCompare(b.title) : b.verifiedAt.localeCompare(a.verifiedAt));
}
