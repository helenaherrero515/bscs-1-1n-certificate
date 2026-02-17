"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Header } from "@/components/header"
import { CertificatePreview } from "@/components/certificate-preview"
import { Button } from "@/components/ui/button"
<<<<<<< HEAD
import { ArrowLeft } from "lucide-react"
=======
import { ArrowLeft, ShieldCheck } from "lucide-react"
>>>>>>> v3
import Link from "next/link"

function ResultContent() {
  const searchParams = useSearchParams()
  const name = searchParams.get("name")
  const studentId = searchParams.get("student_id")
  const award = searchParams.get("award") as "PL" | "DL" | null
<<<<<<< HEAD

  if (!name || !studentId || !award) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
        <p className="text-card-foreground/70">
          {"No student data found. Please verify your identity first."}
        </p>
        <Button asChild variant="outline" className="gap-2 border-card-foreground/20 bg-card/60 text-card-foreground hover:bg-card hover:text-card-foreground">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Go Back
=======
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
        <Button asChild variant="outline" className="gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Return to Search
>>>>>>> v3
          </Link>
        </Button>
      </div>
    )
  }

<<<<<<< HEAD
  const student = { name, student_id: studentId, award }

  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-6 py-12">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-fit gap-2 text-card-foreground/70 hover:bg-card/40 hover:text-card-foreground"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>

        <CertificatePreview student={student} />
=======
  const student = { name, student_id: studentId, award, gpa }

  return (
    <main className="flex flex-1 items-center justify-center py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6">

        {/* Top Navigation & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            asChild
            variant="ghost"
            className="group gap-2 text-white/70 hover:text-white"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Portal
            </Link>
          </Button>

          <div className="flex items-center gap-2 rounded-full border border-green-400/30 bg-green-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-green-300 backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified Student Record
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="relative">
          <CertificatePreview student={student} />
        </div>


>>>>>>> v3
      </div>
    </main>
  )
}

export default function ResultPage() {
  return (
<<<<<<< HEAD
    <div
      className="flex min-h-screen flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/web_background.png')" }}
    >
      <Header />

      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center">
            <p className="text-card-foreground/70">{"Loading..."}</p>
          </div>
        }
      >
        <ResultContent />
      </Suspense>

      <footer className="bg-card/50 py-4 text-center text-xs text-card-foreground/50 backdrop-blur-sm">
        <p>{"BSCS 1-1N \u00b7 Academic Year 2025\u20132026"}</p>
=======
    <div className="relative flex min-h-screen flex-col font-sans selection:bg-primary/30">
      {/* Dynamic Background with Overlay */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/web_background.png')" }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/20 via-transparent to-black/40 backdrop-blur-[2px]" aria-hidden="true" />

      <Header />

      <Suspense fallback={
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <p className="font-medium text-white/60">{"Retrieving Certificate..."}</p>
          </div>
        </div>
      }>
        <ResultContent />
      </Suspense>

      <footer className="mt-auto w-full border-t border-white/10 bg-black/40 py-6 text-center backdrop-blur-md">
        <p className="text-[10px] font-medium uppercase tracking-widest text-white/40">
          {"BSCS 1-1N \u2022 Academic Year 2025\u20132026"}
        </p>
>>>>>>> v3
      </footer>
    </div>
  )
}
