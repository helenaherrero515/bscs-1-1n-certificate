"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Header } from "@/components/header"
import { CertificatePreview } from "@/components/certificate-preview"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import Link from "next/link"

function ResultContent() {
  const searchParams = useSearchParams()
  const name = searchParams.get("name")
  const studentId = searchParams.get("student_id")
  const award = searchParams.get("award") as "PL" | "DL" | "AA" | null
  const gpa = searchParams.get("gpa")

  if (!name || !studentId || !award || !gpa) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
        <div className="space-y-2 text-center">
          <p className="text-xl font-semibold text-white">
            {"Oops! No Data Found"}
          </p>
          <p className="max-w-xs text-white/60">
            {"We couldn't find your record. Please go back and ensure your Student ID matches the class list."}
          </p>
        </div>
        <Button asChild variant="outline" className="gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Return to Search
          </Link>
        </Button>
      </div>
    )
  }

  const student = { name, student_id: studentId, award, gpa }

  return (
    <main className="flex flex-1 items-center justify-center py-6 px-4 sm:py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">

        {/* Top Navigation & Status */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <Button
            asChild
            variant="ghost"
            className="group gap-2 text-white/90 hover:text-white hover:bg-white/10 w-fit"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Portal
            </Link>
          </Button>

          <div className="flex items-center gap-2 rounded-full border border-green-400/30 bg-green-500/20 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-green-300 backdrop-blur-sm w-fit">
            <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Verified Student Record</span>
            <span className="sm:hidden">Verified</span>
          </div>
        </div>

        {/* Certificate Display Area */}
        <CertificatePreview student={student} />

      </div>
    </main>
  )
}

export default function ResultPage() {
  return (
    <div className="relative flex min-h-screen flex-col font-sans selection:bg-primary/30">
      {/* Dynamic Background with Overlay */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/web_background.png')" }}
        aria-hidden="true"
      />
      {/* Fixed dark overlay to make the result card pop */}
      <div className="fixed inset-0 -z-10 bg-black/10" aria-hidden="true" />

      <Header />

      <Suspense fallback={
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-white">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
            <p className="font-medium opacity-60">{"Retrieving Certificate..."}</p>
          </div>
        </div>
      }>
        <ResultContent />
      </Suspense>

      <footer className="mt-auto w-full border-t border-white/10 bg-black/60 py-4 px-4 text-center backdrop-blur-md sm:py-6">
        <p className="text-[10px] font-medium uppercase tracking-widest text-white/40">
          {"BSCS 1-1N \u2022 Academic Year 2025\u20132026"}
        </p>
      </footer>
    </div>
  )
}
