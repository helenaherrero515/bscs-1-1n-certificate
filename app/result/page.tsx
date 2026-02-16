"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Header } from "@/components/header"
import { CertificatePreview } from "@/components/certificate-preview"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

function ResultContent() {
  const searchParams = useSearchParams()
  const name = searchParams.get("name")
  const studentId = searchParams.get("student_id")
  const award = searchParams.get("award") as "PL" | "DL" | null

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
          </Link>
        </Button>
      </div>
    )
  }

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
      </div>
    </main>
  )
}

export default function ResultPage() {
  return (
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
      </footer>
    </div>
  )
}
