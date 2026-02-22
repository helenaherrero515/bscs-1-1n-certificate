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
    if (student.award === 'PL') return <Trophy className="h-6 w-6 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
    if (student.award === 'DL') return <Medal className="h-6 w-6 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
    return <Award className="h-6 w-6 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]" />
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
        body: JSON.stringify({
          name: student.name,
          student_id: student.student_id,
          gpa: student.gpa,
          award: student.award,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.details || 'Failed to generate PDF')
      }

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
      console.error('Error generating PDF:', err)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card className="border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl overflow-hidden">
      <CardContent className="flex flex-col gap-6 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {getAwardIcon()}
            <h3 className="text-xl sm:text-2xl poppins-bold text-white tracking-tight">
              {student.name}
            </h3>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-inner">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-200/90">
              {getAwardLabel()}
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative group overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Student ID</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-lg font-mono font-bold text-white/90">{student.student_id}</p>
              <button onClick={copyToClipboard} className="text-white/40 hover:text-white transition-colors">
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="relative group overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">GWA</p>
            <p className="mt-1 text-lg font-bold text-white/90">{student.gpa}</p>
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="relative group rounded-xl border border-white/10 bg-zinc-950 overflow-hidden shadow-2xl">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1984 / 1240' }}>
            <Image
              src={getCertificateImage()}
              alt="Certificate Preview"
              fill
              className="object-contain opacity-90 transition-opacity group-hover:opacity-100"
              priority
            />
            {/* Overlay with Independent Margins */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <div className="w-full text-center" style={{ marginTop: '3.5%' }}>
                 <p
                   className="font-bold text-white px-4 drop-shadow-lg"
                   style={{
                     fontSize: 'min(7vw, 50px)',
                     WebkitTextStroke: 'min(0.15vw, 1px) #001F3F',
                     marginTop: '0px'
                   }}
                 >
                   {student.name}
                 </p>
                 <p
                   className="text-white/90 font-medium"
                   style={{ 
                     fontSize: 'min(1.6vw, 15px)', 
                     fontFamily: 'Arial, sans-serif',
                     marginTop: '-1%' 
                   }}
                 >
                   With a General Weighted Average (GWA) of {student.gpa}
                 </p>
                </div>
            </div>
          </div>
        </div>

        {/* UPDATED: Cyan Blue Glowing Button */}
        <div className="flex flex-col">
          <Button 
            onClick={downloadPDF} 
            disabled={downloading} 
            size="lg" 
            className={`
              relative w-full h-14 gap-3 text-base font-bold transition-all duration-300
              ${downloading 
                ? "bg-zinc-800 text-zinc-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(0,0,0,0.5)] active:scale-95"
              }
            `}
          >
            {downloading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="tracking-wide">Generating PDF...</span>
                <div className="absolute inset-0 rounded-md bg-cyan-400/20 animate-pulse" />
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Download PDF Certificate
              </>
            )}
          </Button>
          <p className="mt-3 text-center text-[10px] text-white/30 uppercase tracking-[0.2em]">
            CONGRATS AGAIN! YOU SURVIVED FIRST SEM!!! ONTO THE NEXT ONE! 🚀
          </p>
        </div>
      </CardContent>
    </Card>
  )
}