export function PageLoading() {
  return <section className="page-loading" role="status" aria-live="polite" aria-label="Memuat halaman">
    <div className="page-loading-heading"><span className="loading-orbit"><i /><i /><i /></span><span>KHADAFI / MENYIAPKAN RUANG</span></div>
    <div className="loading-line loading-title" /><div className="loading-line loading-description" />
    <div className="loading-grid">{[0, 1, 2].map(i => <div key={i} className="loading-card"><span /><i /><i /></div>)}</div>
    <span className="sr-only">Halaman sedang dimuat. Navigasi tetap dapat digunakan.</span>
  </section>;
}
