export interface ResearchFrontier {
  id: string;
  number: string;
  title: string;
  question: string;
  description: string;
  keywords: string[];
  status: string;
}

export interface ResearchStage {
  code: string;
  name: string;
  summary: string;
}

export interface EvidenceLevel {
  level: number;
  name: string;
  description: string;
}

export interface SafetyClass {
  tier: 'GREEN' | 'AMBER' | 'RED';
  title: string;
  description: string;
  examples: string[];
  posture: string;
  colorHex: string;
  bgRgba: string;
}

export interface AutonomyLevel {
  code: 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5';
  name: string;
  description: string;
  posture: 'DEFAULT_FOCUS' | 'ELEVATED_REVIEW' | 'NOT_TARGET';
  postureLabel: string;
}

export interface LabStatusMetrics {
  state: string;
  version: string;
  experiments: number;
  publications: number;
  releases: number;
  priority: string;
}

export const LAB_METRICS: LabStatusMetrics = {
  state: 'FOUNDATION',
  version: '1.0',
  experiments: 0,
  publications: 0,
  releases: 0,
  priority: 'INSTITUTIONAL FOUNDATION',
};

export const RESEARCH_FRONTIERS: ResearchFrontier[] = [
  {
    id: 'physical-intelligence',
    number: '01',
    title: 'Physical Intelligence',
    question: 'Bagaimana sistem cerdas memahami, menafsirkan, dan berinteraksi dengan lingkungan fisik secara aman?',
    description:
      'Mempelajari bagaimana sistem cerdas memahami, menafsirkan, dan berinteraksi dengan lingkungan fisik secara aman.',
    keywords: [
      'Robotics',
      'Embodied Intelligence',
      'Physical Sensing',
      'Human-Machine Interaction',
    ],
    status: 'FIELD OPEN',
  },
  {
    id: 'collective-intelligence',
    number: '02',
    title: 'Collective Intelligence',
    question: 'Bagaimana berbagai agen cerdas dapat berkoordinasi menuju tujuan bersama tanpa hambatan sentralisasi?',
    description:
      'Bagaimana berbagai agen cerdas dapat berkoordinasi menuju tujuan bersama tanpa hambatan sentralisasi.',
    keywords: [
      'Multi-Agent Systems',
      'Distributed Intelligence',
      'Agent Coordination',
      'Collective Decision Systems',
    ],
    status: 'FIELD OPEN',
  },
  {
    id: 'resilience-technology',
    number: '03',
    title: 'Resilience Technology',
    question: 'Bagaimana sistem cerdas dapat membantu manusia menyerap disrupsi, kondisi iklim, dan guncangan sistemik?',
    description:
      'Teknologi yang membantu manusia merespons disrupsi, ketidakpastian, dan lingkungan ekstrem.',
    keywords: [
      'Disaster Response',
      'Infrastructure Resilience',
      'Environmental Intelligence',
      'Emergency Systems',
    ],
    status: 'FIELD OPEN',
  },
  {
    id: 'digital-twin-intelligence',
    number: '04',
    title: 'Digital Twin Intelligence',
    question: 'Bagaimana representasi resolusi tinggi dari lingkungan fisik dapat memprediksi berbagai kemungkinan masa depan?',
    description:
      'Sistem AI yang membangun representasi resolusi tinggi dari lingkungan fisik untuk memprediksi berbagai kemungkinan masa depan.',
    keywords: [
      'Simulation',
      'World Models',
      'Predictive Systems',
      'Scenario Intelligence',
    ],
    status: 'FIELD OPEN',
  },
  {
    id: 'safe-autonomous-systems',
    number: '05',
    title: 'Safe Autonomous Systems',
    question: 'Bagaimana sistem otonom yang kuat dapat tetap terukur, terbatasi, dapat diaudit, dan berada di bawah kendali manusia yang bermakna?',
    description:
      'Mengeksplorasi bagaimana sistem otonom yang semakin kuat dapat tetap terukur, terbatasi, dapat diaudit, dan berada di bawah kendali manusia yang bermakna.',
    keywords: [
      'Human-in-the-Loop',
      'Permission Boundaries',
      'Agent Safety',
      'Observability',
      'Controlled Autonomy',
    ],
    status: 'FIELD OPEN',
  },
];

export const RESEARCH_STAGES: ResearchStage[] = [
  { code: 'R01', name: 'Question', summary: 'Merumuskan masalah empiris atau tantangan fundamental' },
  { code: 'R02', name: 'Research Charter', summary: 'Mendefinisikan asumsi, batasan ruang lingkup, dan kriteria keberhasilan yang dapat diuji' },
  { code: 'R03', name: 'Safety Classification', summary: 'Menilai tingkat risiko, batasan otonomi, dan kondisi penghentian sistem' },
  { code: 'R04', name: 'Simulation', summary: 'Mengisolasi dan menguji dalam lingkungan digital kembar (digital twin) yang terbatasi' },
  { code: 'R05', name: 'Experiment', summary: 'Menjalankan uji terkendali dengan telemetri multi-kanal yang berkelanjutan' },
  { code: 'R06', name: 'Evidence', summary: 'Mengukur hasil, mencatat deviasi, dan mendaftarkan telemetri secara lengkap' },
  { code: 'R07', name: 'Reproduction', summary: 'Memverifikasi bahwa hasil yang diamati dapat direproduksi secara deterministik' },
  { code: 'R08', name: 'Release Review', summary: 'Mengevaluasi tata kelola antara rilis terbuka, terbatasi, atau retensi internal' },
  { code: 'R09', name: 'Publication', summary: 'Mempublikasikan temuan, catatan sejawat, batasan, dan log kegagalan' },
];

export const EVIDENCE_LADDER: EvidenceLevel[] = [
  { level: 1, name: 'Concept', description: 'Hipotesis teoretis, kerangka analitik, dan asumsi arsitektural' },
  { level: 2, name: 'Prototype', description: 'Implementasi fungsional yang membuktikan kelayakan rekayasa dalam kotak pasir' },
  { level: 3, name: 'Controlled Experiment', description: 'Eksekusi terisolasi di bawah batasan yang terstruktur dan terukur' },
  { level: 4, name: 'Reproducible Result', description: 'Hasil konsisten yang diverifikasi di berbagai uji coba independen' },
  { level: 5, name: 'Real-World Validation', description: 'Diuji di bawah gangguan operasional, kondisi ekstrem, dan friksi lingkungan nyata' },
  { level: 6, name: 'Production System', description: 'Sistem yang diperkeras, dapat diamati, dan dikelola, beroperasi di bawah pengawasan terus-menerus' },
];

export const SAFETY_CLASSES: SafetyClass[] = [
  {
    tier: 'GREEN',
    title: 'Positive-Use Research',
    description:
      'Riset risiko rendah yang berfokus pada bantuan kemanusiaan, pemantauan lingkungan, simulasi, aksesibilitas, dan perangkat yang aman.',
    examples: ['Accessibility Systems', 'Disaster Response', 'Physical Simulation', 'Benign Robotics'],
    posture: 'OPEN AFTER STANDARD REVIEW',
    colorHex: '#34D399',
    bgRgba: 'rgba(52, 211, 153, 0.08)',
  },
  {
    tier: 'AMBER',
    title: 'Higher-Capability / Dual-Use',
    description:
      'Sistem otonom yang kuat, pertahanan siber tingkat lanjut, robotika berdampak tinggi, atau model infrastruktur sensitif yang membawa risiko fungsi ganda (dual-use).',
    examples: ['Autonomous Agent Collectives', 'Advanced Cyber Defense', 'High-Force Physical Actuation'],
    posture: 'BOUNDED / CONTROLLED RELEASE',
    colorHex: '#FBBF24',
    bgRgba: 'rgba(251, 191, 36, 0.08)',
  },
  {
    tier: 'RED',
    title: 'Prohibited Research',
    description:
      'Kemampuan yang tujuan praktisnya memungkinkan persenjataan, penargetan manusia secara otonom, rekayasa patogen, atau sistem siber ofensif yang merusak.',
    examples: ['Autonomous Targeting', 'Harmful Weaponization', 'Pathogen Design', 'Offensive Cyber Weapons'],
    posture: 'NOT PURSUED / STRICT PROHIBITION',
    colorHex: '#F87171',
    bgRgba: 'rgba(248, 113, 113, 0.08)',
  },
];

export const AUTONOMY_LEVELS: AutonomyLevel[] = [
  {
    code: 'A0',
    name: 'Advisory',
    description: 'Sistem hanya menampilkan data kontekstual, analisis, dan telemetri sensor tanpa merumuskan rekomendasi.',
    posture: 'DEFAULT_FOCUS',
    postureLabel: 'CORE HCFTL RESEARCH TARGET',
  },
  {
    code: 'A1',
    name: 'Recommend',
    description: 'Sistem mengevaluasi kemungkinan dan mengusulkan tindakan; eksekusi sepenuhnya berada di tangan manusia.',
    posture: 'DEFAULT_FOCUS',
    postureLabel: 'CORE HCFTL RESEARCH TARGET',
  },
  {
    code: 'A2',
    name: 'Assisted',
    description: 'Sistem mempersiapkan tindakan; eksekusi hanya berlanjut setelah otorisasi eksplisit dari manusia.',
    posture: 'DEFAULT_FOCUS',
    postureLabel: 'CORE HCFTL RESEARCH TARGET',
  },
  {
    code: 'A3',
    name: 'Bounded Autonomy',
    description: 'Sistem bertindak secara otonom dalam kotak pasir yang telah diotorisasi sebelumnya, diatur oleh pengaman kriptografi atau fisik.',
    posture: 'DEFAULT_FOCUS',
    postureLabel: 'CORE HCFTL RESEARCH TARGET',
  },
  {
    code: 'A4',
    name: 'Supervisory Autonomy',
    description: 'Eksekusi otonom di ranah yang lebih luas dengan pemantauan manusia aktif, kontrol intervensi, dan tombol darurat (kill-switches).',
    posture: 'ELEVATED_REVIEW',
    postureLabel: 'REQUIRES INSTITUTIONAL SAFETY REVIEW',
  },
  {
    code: 'A5',
    name: 'Unbounded Consequential Autonomy',
    description: 'Eksekusi tanpa batas dengan otoritas dunia nyata yang tidak dapat diubah tanpa perlindungan intervensi manusia.',
    posture: 'NOT_TARGET',
    postureLabel: 'NOT A RESEARCH TARGET FOR HCFTL',
  },
];

export const RESEARCH_OUTPUTS = [
  { label: 'Research Notes', value: 0, status: '0 PUBLIC', desc: 'Memo kerja, catatan arsitektur, dan ringkasan metodologi.' },
  { label: 'Formal Publications', value: 0, status: '0 PUBLIC', desc: 'Makalah sejawat, temuan empiris, dan laporan teknis.' },
  { label: 'Open Research Releases', value: 0, status: '0 RELEASES', desc: 'Dataset terbuka, bobot model, dan paket replikasi.' },
  { label: 'Failure Log', value: 0, status: '0 RECORDED', desc: 'Anomali terdokumentasi, hipotesis yang terbukti salah, dan hasil negatif.' },
];

export const LAB_NAV_ITEMS = [
  { id: 'tentang', label: 'Tentang' },
  { id: 'riset', label: 'Bidang Riset' },
  { id: 'metode', label: 'Metode' },
  { id: 'prinsip', label: 'Tata Kelola' },
  { id: 'perkembangan', label: 'Perkembangan' },
  { id: 'founder', label: 'Founder' },
];
