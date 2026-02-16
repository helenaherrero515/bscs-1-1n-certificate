"use client"

import { useState } from "react"
import Image from "next/image"
import { Download, Loader2, Trophy, Medal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface StudentResult {
  name: string
  student_id: string
  award: "PL" | "DL"
}

interface CertificatePreviewProps {
  student: StudentResult
}

export function CertificatePreview({ student }: CertificatePreviewProps) {
  const [downloading, setDownloading] = useState(false)

  const awardLabel =
    student.award === "PL" ? "President's Lister" : "Dean's Lister"
  const templateSrc =
    student.award === "PL"
      ? "/certificates/certificate_pl.png"
      : "/certificates/certificate_dl.png"

  async function handleDownload() {
    setDownloading(true)
    try {
      const res = await fetch("/api/generate-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: student.name,
          student_id: student.student_id,
          award: student.award,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to generate certificate.")
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Certificate_${student.award}_${student.name.replace(/\s+/g, "_")}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert("Failed to generate certificate. Please try again.")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card className="border-card-foreground/10 bg-card/80 shadow-xl backdrop-blur-sm">
      <CardContent className="flex flex-col gap-5 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-card-foreground">
            {student.award === "PL" ? (
              <Trophy className="h-5 w-5 text-gold" />
            ) : (
              <Medal className="h-5 w-5 text-primary" />
            )}
            <span className="font-semibold">{student.name}</span>
          </div>
          <Badge
            variant="secondary"
            className={
              student.award === "PL"
                ? "bg-gold/20 text-card-foreground border border-gold/30"
                : "bg-primary/15 text-card-foreground border border-primary/25"
            }
          >
            {awardLabel}
          </Badge>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-card-foreground/10">
          <div className="relative aspect-[1.414/1] w-full">
            <Image
              src={templateSrc}
              alt={`${awardLabel} certificate for ${student.name}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              className="object-contain"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="-translate-y-[8%] text-center">
                <p
                  className="font-display text-2xl font-bold tracking-wide sm:text-4xl md:text-5xl"
                  style={{
                    color: "#ffffff",
                    WebkitTextStroke: "2px #6B8EFF",
                    paintOrder: "stroke fill",
                    textShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  {student.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={handleDownload}
          disabled={downloading}
          size="lg"
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {downloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download PDF
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
