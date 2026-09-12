"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Clock,
  UserCheck,
  Workflow,
  Share2,
  Lock,
  Unlock,
  Layers,
  Terminal,
  Send,
} from "lucide-react";
import { ResourceItem } from "@/lib/resource-types";

interface ResourceDetailViewProps {
  resource: ResourceItem;
  relatedResources: ResourceItem[];
}

export function ResourceDetailView({
  resource,
  relatedResources,
}: ResourceDetailViewProps) {
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [shareToast, setShareToast] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberSuccess, setMemberSuccess] = useState(false);

  // Copy prompt handler
  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => {
      setCopiedPromptId(null);
    }, 2500);
  };

  // Toggle checklist
  const handleToggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Share URL handler
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.tagline,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  const isDirect = resource.accessLevel === "direct-access";
  const isOpen = resource.accessLevel === "open";
  const isMember = resource.accessLevel === "member-unlock";

  return (
    <div className="min-h-screen bg-[#06080E] text-white selection:bg-indigo-500/30 selection:text-indigo-100 font-sans relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-indigo-500/10 via-sky-500/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <main className="relative z-10 pt-28 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link & Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-indigo-400/30 text-xs font-mono tracking-wider text-white/70 hover:text-white transition-all group backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-indigo-400" />
            <span>Kembali ke Perpustakaan Sumber Daya</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/60 hover:text-white transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{shareToast ? "Link Disalin!" : "Bagikan"}</span>
          </button>
        </div>

        {/* Hero Detail Section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0B0F19]/90 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-mono uppercase tracking-widest text-indigo-300">
              {resource.type}
            </span>
            {resource.badge && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-mono text-sky-300">
                <Sparkles className="w-3 h-3" />
                {resource.badge}
              </span>
            )}
            <span className="text-xs font-mono text-white/40 ml-auto">
              Updated: {resource.updatedAt}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {resource.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-white/70 font-light leading-relaxed">
            {resource.tagline}
          </p>

          {/* Target Audience & Read Time Tags */}
          <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap items-center gap-4 text-xs font-mono text-white/60">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>{resource.readTimeOrEffort}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-white/20 hidden sm:inline" />
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Cocok untuk: {resource.bestFor.join(" • ")}</span>
            </div>
          </div>

          {/* Main Action Trigger */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {isMember ? (
              <button
                onClick={() => setShowMemberModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black hover:bg-slate-200 font-semibold text-sm transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)] group"
              >
                <Lock className="w-4 h-4 text-black" />
                <span>Buka Akses Gratis Member</span>
              </button>
            ) : resource.actionUrl ? (
              <a
                href={resource.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black hover:bg-slate-200 font-semibold text-sm transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)] group"
              >
                <span>{resource.actionLabel}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            ) : (
              <a
                href="#interactive-section"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black hover:bg-slate-200 font-semibold text-sm transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)] group"
              >
                <span>{resource.actionLabel}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}

            <div className="text-xs text-white/40 font-mono flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Free • Direct Utility</span>
            </div>
          </div>
        </div>

        {/* Narrative Section: Why I Created This & How I Use It */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <section className="p-8 rounded-3xl bg-[#0B0E17]/80 border border-white/5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-indigo-400 mb-3">
                <Workflow className="w-4 h-4" />
                <span>Field Context & Philosophy</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                Mengapa Saya Membuat Sistem Ini?
              </h2>
              <p className="text-sm sm:text-base text-white/75 font-light leading-relaxed">
                {resource.description}
              </p>

              <div className="mt-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <h3 className="text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
                  Bagaimana Saya Menggunakannya di Lapangan:
                </h3>
                <p className="text-sm text-white/80 italic font-serif leading-relaxed">
                  &ldquo;{resource.howKhadafiUsesThis}&rdquo;
                </p>
                <div className="mt-3 text-xs font-mono text-indigo-300">
                  — Daffa Dhiyaulhaq Khadafi
                </div>
              </div>
            </section>

            {/* Interactive Section / Preview Engine */}
            {resource.previewContent && (
              <section id="interactive-section" className="p-8 rounded-3xl bg-[#0B0E17]/80 border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-1">
                      Interactive Artifact
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {resource.previewContent.summaryTitle || "Pratinjau Langsung Sistem"}
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-white/40 hidden sm:inline">
                    Langsung dicoba di browser
                  </span>
                </div>

                {/* Prompt Pack Interactive Viewer */}
                {resource.previewContent.type === "prompt-pack" &&
                  resource.previewContent.promptItems && (
                    <div className="space-y-4">
                      {resource.previewContent.promptItems.map((prompt) => (
                        <div
                          key={prompt.id}
                          className="p-5 rounded-2xl bg-[#070A11] border border-white/10 shadow-lg relative"
                        >
                          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                            <div>
                              <h4 className="text-sm font-bold text-white">
                                {prompt.title}
                              </h4>
                              <span className="text-[11px] font-mono text-indigo-300">
                                {prompt.targetRoleOrTask}
                              </span>
                            </div>
                            <button
                              onClick={() => handleCopyPrompt(prompt.id, prompt.promptText)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
                            >
                              {copiedPromptId === prompt.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-300">Tersalin!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Salin Prompt</span>
                                </>
                              )}
                            </button>
                          </div>

                          <pre className="text-xs font-mono text-white/80 whitespace-pre-wrap leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5 overflow-x-auto">
                            {prompt.promptText}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Interactive Checklist Viewer */}
                {resource.previewContent.type === "checklist" &&
                  resource.previewContent.checklistItems && (
                    <div className="space-y-3">
                      {resource.previewContent.checklistItems.map((check) => {
                        const isChecked = !!checkedItems[check.id];
                        return (
                          <div
                            key={check.id}
                            onClick={() => handleToggleCheck(check.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                              isChecked
                                ? "bg-emerald-500/10 border-emerald-500/40"
                                : "bg-white/[0.02] hover:bg-white/[0.05] border-white/5"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center border transition-colors ${
                                isChecked
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "border-white/20 bg-white/5"
                              }`}
                            >
                              {isChecked && <Check className="w-3.5 h-3.5" />}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-white">
                                  {check.title}
                                </span>
                                {check.category && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/50">
                                    {check.category}
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-xs text-white/60 font-light leading-relaxed">
                                {check.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                {/* Framework Steps Visualizer */}
                {resource.previewContent.type === "framework-steps" &&
                  resource.previewContent.frameworkSteps && (
                    <div className="space-y-3">
                      {resource.previewContent.frameworkSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-xs flex items-center justify-center shrink-0">
                              {step.step}
                            </span>
                            <div>
                              <h4 className="text-sm font-semibold text-white">
                                {step.name}
                              </h4>
                              <p className="text-xs text-white/50 font-light mt-0.5">
                                {step.description}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 shrink-0 self-start sm:self-center">
                            Output: {step.deliverable}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Markdown reading section */}
                {resource.previewContent.type === "markdown" &&
                  resource.previewContent.markdownContent && (
                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5 font-sans text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                      {resource.previewContent.markdownContent}
                    </div>
                  )}
              </section>
            )}
          </div>

          {/* Right Column: Deliverables Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-[#0B0E17]/80 border border-white/5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-indigo-400 mb-4">
                Apa Saja Yang Termasuk
              </h3>
              <ul className="space-y-3">
                {resource.whatYouGet.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-white/80 font-light leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Steps / Community Bridge */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0F1424] to-[#0A0D15] border border-indigo-500/20">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300">
                Langkah Berikutnya
              </span>
              <h4 className="text-base font-bold text-white mt-1">
                Ingin diskusi & evaluasi sistem ini?
              </h4>
              <p className="mt-2 text-xs text-white/60 font-light leading-relaxed">
                Bergabunglah di komunitas Digital Builder Khadafi untuk bertukar feedback langsung mengenai implementasi AI dan produk.
              </p>
              <Link
                href="/komunitas"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 hover:text-white transition-colors"
              >
                <span>Kunjungi Halaman Komunitas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Related Resources Carousel / Grid */}
        {relatedResources.length > 0 && (
          <div className="mt-20 pt-12 border-t border-white/5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
                  Related Systems
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  Sistem & Template Terkait
                </h3>
              </div>
              <Link
                href="/resources"
                className="text-xs font-mono text-white/50 hover:text-white transition-colors"
              >
                Lihat Semua →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedResources.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/resources/${rel.slug}`}
                  className="p-6 rounded-2xl bg-[#0B0E17]/60 hover:bg-[#0F1320] border border-white/5 hover:border-indigo-500/30 transition-all duration-200 group"
                >
                  <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider">
                    {rel.type}
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors mt-1">
                    {rel.title}
                  </h4>
                  <p className="mt-1 text-xs text-white/60 line-clamp-2 font-light">
                    {rel.tagline}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs font-mono text-white/40">
                    <span>{rel.readTimeOrEffort}</span>
                    <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">
                      Eksplorasi →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Member Email Unlock Modal (Optional) */}
      <AnimatePresence>
        {showMemberModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="p-8 rounded-3xl bg-[#0D111D] border border-indigo-500/30 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowMemberModal(false)}
                className="absolute top-4 right-4 text-xs font-mono text-white/40 hover:text-white"
              >
                ✕ Close
              </button>

              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                <Sparkles className="w-5 h-5" />
              </div>

              <h3 className="text-xl font-bold text-white">
                Buka Akses Resource Gratis
              </h3>
              <p className="mt-2 text-xs text-white/60 leading-relaxed font-light">
                Masukkan emailmu untuk langsung menerima salinan template master dan update saat versi baru dirilis. Bebas spam.
              </p>

              {memberSuccess ? (
                <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                  ✓ Akses telah dibuka! Tautan duplikasi telah dikirimkan ke email kamu.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (memberEmail) setMemberSuccess(true);
                  }}
                  className="mt-6 space-y-3"
                >
                  <input
                    type="email"
                    required
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="nama@emailmu.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-white/30 focus:outline-none focus:border-indigo-400"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 font-semibold text-xs text-white transition-colors"
                  >
                    Dapatkan Template Sekarang
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
