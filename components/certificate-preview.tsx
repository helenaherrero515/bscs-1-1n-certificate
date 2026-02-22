'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Download, Trophy, Medal, Copy, Check, Award, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface StudentResult {
  name: string
  student_id: string
  award: 'PL' | 'DL' | 'AA'
  gpa: string
}

interface CertificatePreviewProps {
  student: StudentResult
}

export function CertificatePreview({ student }: CertificatePreviewProps) {
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)

  const getAwardLabel = () => {
    if (student.award === 'PL') return "President's Lister"
    if (student.award === 'DL') return "Dean's Lister"
    return "Academic Achiever"
  }

  const getAwardIcon = () => {
    if (student.award === 'PL')
      return <Trophy className="h-6 w-6 text-amber-400 drop-shadow-lg" />
    if (student.award === 'DL')
      return <Medal className="h-6 w-6 text-blue-400 drop-shadow-lg" />
    return <Award className="h-6 w-6 text-purple-400 drop-shadow-lg" />
  }

  const getCertificateImage = () => {
    if (student.award === 'PL') return '/certificates/certificate_pl.png'
    if (student.award === 'DL') return '/certificates/certificate_dl.png'
    return '/certificates/certificate_acad.png'
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(student.student_id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  async function downloadPDF() {
    setDownloading(true)
    try {
      const res = await fetch('/api/generate-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
      })

      if (!res.ok) throw new Error('Failed to generate PDF')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Certificate_${student.name.replace(/\s+/g, '_')}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card className="border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl overflow-hidden">
      <CardContent className="flex flex-col gap-6 pt-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {getAwardIcon()}
            <h3 className="text-lg sm:text-2xl font-bold text-white break-words max-w-full">
              {student.name}
            </h3>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-amber-200 text-center">
            {getAwardLabel()}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
              Student ID
            </p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <p className="text-sm sm:text-lg font-mono font-bold text-white break-all">
                {student.student_id}
              </p>
              <button
                onClick={copyToClipboard}
                className="text-white/40 hover:text-white transition"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
              GWA
            </p>
            <p className="mt-1 text-sm sm:text-lg font-bold text-white">
              {student.gpa}
            </p>
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="rounded-xl border border-white/10 bg-zinc-950 overflow-hidden shadow-2xl">
          <div className="relative w-full aspect-[4/3] sm:aspect-[1984/1240]">
            <Image
              src={getCertificateImage()}
              alt="Certificate Preview"
              fill
              className="object-contain opacity-90"
              priority
            />

            {/* Overlay using percentage positioning */}
            <div className="absolute inset-0 pointer-events-none select-none">
              
              {/* 🔥 Adjust this percentage to move text up/down */}
              <div className="absolute top-[55%] sm:top-[58%] w-full text-center px-4 -translate-y-12">
                
              <p
                className="
                  font-bold text-white drop-shadow-lg
                  text-base            /* default mobile (≈16px) */
                  sm:text-xl           /* ≥640px */
                  md:text-2xl          /* ≥768px */
                  lg:text-[40px]       /* desktop */
                  leading-tight
                  break-words
                  px-2
                "
                style={{ WebkitTextStroke: '1px #001F3F' }}
              >
                {student.name}
              </p>

              <p
                className="
                  text-white/90 font-medium
                  text-xs               /* mobile */
                  sm:text-sm
                  md:text-base
                  lg:text-[15px]
                  mt-1
                  px-2
                "
              >
                With a General Weighted Average (GWA) of {student.gpa}
              </p>

              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={downloadPDF}
            disabled={downloading}
            size="lg"
            className={`
              relative w-full h-14 gap-3 text-base font-bold
              transition-all duration-300
              ${downloading
                ? "bg-zinc-800 text-zinc-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-cyan-500 text-white active:scale-95"
              }
            `}
          >
            {downloading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Download PDF Certificate
              </>
            )}
          </Button>

          <p className="text-center text-[10px] text-white/30 uppercase tracking-[0.2em]">
            Congrats again! You survived first sem! 🚀
          </p>
        </div>

      </CardContent>
    </Card>
  )
}