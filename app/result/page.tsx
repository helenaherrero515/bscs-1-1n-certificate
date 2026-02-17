"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Header } from "@/components/header"
import { CertificatePreview } from "@/components/certificate-preview"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2, ShieldCheck, Printer } from "lucide-react"
import Link from "next/link"

function ResultContent() {
  const searchParams = useSearchParams()
  const name = searchParams.get("name")
  const studentId = searchParams.get("student_id")
  const award = searchParams.get("award") as "PL" | "DL" | null

  if (!name || !studentId || !award) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold text-white">Oops! No Data Found</p>
          <p className="text-white/60 max-w-xs">
            We couldn't find your record. Please go back and ensure your Student ID matches the class list.
          </p>
        </div>
        <Button asChild variant="outline" className="gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Return to Search
          </Link>
        </Button>
      </div>
    )
  }

  const student = { name, student_id: studentId, award }

  return (
    <main className="flex flex-1 items-center justify-center py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6">
        
        {/* Top Navigation & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <Button
            asChild
            variant="ghost"
            className="group gap-2 text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Portal
            </Link>
          </Button>

          <div className="flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-green-400 border border-green-500/30 backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified Student Record
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="relative group animate-in fade-in zoom-in-95 duration-1000">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-yellow-500/20 via-white/5 to-yellow-500/20 blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <CertificatePreview student={student} />
          </div>
        </div>

        

        <p className="text-center text-[10px] text-white/30 uppercase tracking-[0.2em]">
          Digital Signature Hash: {Math.random().toString(36).substring(7).toUpperCase()}
        </p>
      </div>
    </main>
  )
}

export default function ResultPage() {
  return (
    <div className="relative flex min-h-screen flex-col font-sans">
      {/* Background Layering */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/web_background.png')" }}
      />
      <div className="fixed inset-0 -z-10 bg-slate-950/60 backdrop-blur-[4px]" />

      <Header />

      <Suspense fallback={
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-yellow-500" />
            <p className="text-white/50 font-medium animate-pulse">Retrieving Certificate...</p>
          </div>
        </div>
      }>
        <ResultContent />
      </Suspense>

      <footer className="w-full border-t border-white/10 bg-black/40 py-6 text-center backdrop-blur-md mt-auto">
        <p className="text-[10px] font-medium tracking-widest text-white/40 uppercase">
          BSCS 1-1N • Academic Year 2025–2026 • Official Recognition System
        </p>
      </footer>
    </div>
  )
}