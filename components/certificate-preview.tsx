'use client'

import { useRef, useState } from 'react'
import { Download, Trophy, Medal, FileImage } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

interface StudentResult {
  name: string
  student_id: string
  award: 'PL' | 'DL'
  gpa: string
}

interface CertificatePreviewProps {
  student: StudentResult
}

export function CertificatePreview({ student }: CertificatePreviewProps) {
  const certRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const awardLabel =
    student.award === 'PL' ? "President's Lister" : "Dean's Lister"

  const awardBg =
    student.award === 'PL'
      ? 'bg-amber-100 text-amber-900'
      : 'bg-blue-100 text-blue-900'

  async function downloadPDF() {
    if (!certRef.current) return
    setIsDownloading(true)

    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 4,
        useCORS: true,
        allowTaint: true,
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png', 1.0)
      
      // Calculate dimensions in mm (1px = 0.264583mm)
      // We divide by the scale (4) to get the original intended CSS size in mm
      const imgWidthMm = (canvas.width * 0.264583) / 4
      const imgHeightMm = (canvas.height * 0.264583) / 4

      // Create PDF with EXACT dimensions of the certificate
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [imgWidthMm, imgHeightMm],
      })

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidthMm, imgHeightMm)
      pdf.save(`Certificate_${student.name.replace(/\s+/g, '_')}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to download PDF.')
    } finally {
      setIsDownloading(false)
    }
  }

  async function downloadPNG() {
    if (!certRef.current) return
    setIsDownloading(true)

    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 4,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: null,
      })

      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png', 1.0)
      link.download = `Certificate_${student.name.replace(/\s+/g, '_')}.png`
      link.click()
    } catch (error) {
      console.error('Error generating PNG:', error)
      alert('Failed to download PNG.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Card className="border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
      <CardContent className="flex flex-col gap-6 pt-6">
        <div className="flex items-center justify-between rounded-lg border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            {student.award === 'PL' ? (
              <Trophy className="h-5 w-5 text-amber-500" />
            ) : (
              <Medal className="h-5 w-5 text-blue-400" />
            )}
            <span className="text-lg font-semibold text-foreground">
              {student.name}
            </span>
          </div>
          <Badge className={`${awardBg} border-0 font-semibold`}>
            {awardLabel}
          </Badge>
        </div>

        <div
          ref={certRef}
          className="relative w-full overflow-hidden rounded-lg shadow-2xl"
          style={{
            aspectRatio: '16 / 10',
            backgroundImage: "url('/certificate_bg.png')",
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute left-1/2 top-4 -translate-x-1/2">
            <img
              src="/logo.png"
              alt="Class Logo"
              className="h-auto w-28 drop-shadow-lg md:w-40"
              crossOrigin="anonymous"
            />
          </div>

          <div className="absolute inset-0 flex flex-col items-center px-8 text-center">
            
            <h2 
              className="absolute top-[20%] w-full font-sans font-bold italic text-white"
              style={{
                fontSize: 'clamp(1.2rem, 4.5vw, 3.2rem)',
                textShadow: '0 0 15px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '0.02em'
              }}
            >
              Certificate of Recognition
            </h2>

            {/* Separated positions to prevent overlap */}
            <p
              className="absolute top-[38%] w-full text-[10px] font-bold uppercase tracking-widest text-white/90 sm:text-xs"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
            >
              This certificate is awarded to
            </p>

            <p
              className="absolute top-[40%] w-full font-display font-bold text-white"
              style={{
                WebkitTextStroke: '1.2px #4A90E2', 
                paintOrder: 'stroke fill',
                textShadow: '0 4px 12px rgba(0,0,0,0.4)',
                fontSize: 'clamp(1.5rem, 6vw, 4rem)',
                lineHeight: '1',
              }}
            >
              {student.name}
            </p>

            <p
              className="absolute top-[60%] w-full text-[10px] font-bold text-white/90 sm:text-sm"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
            >
              from BSCS 1-1N
            </p>

            <div className="absolute top-[65%] flex w-[70%] flex-col gap-3">
              <p
                className="text-[9px] leading-relaxed text-white sm:text-[10px] md:text-[13px]"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
              >
                With a General Weighted Average (GWA) of{' '}
                <strong className="font-bold underline underline-offset-2">{student.gpa}</strong>,
                this certifies that the student is a Bachelor of Science in Computer
                Science student at the{' '}
                <strong className="font-bold">Polytechnic University of the Philippines</strong>, 
                who has demonstrated outstanding academic performance and consistent 
                excellence throughout the semester.
              </p>

              <p
                className="text-[9px] leading-relaxed text-white sm:text-[10px] md:text-[13px]"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
              >
                In recognition of high scholastic achievement, the distinction of{' '}
                <strong className="font-bold">{awardLabel}</strong> is hereby
                conferred for the First Semester of{' '}
                <strong className="font-bold italic">A.Y. 2025–2026</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={downloadPDF}
            disabled={isDownloading}
            size="lg"
            className="flex-1 gap-2 bg-gradient-to-r from-green-700 to-green-600 text-white hover:from-green-800 hover:to-green-700"
          >
            <Download className="h-5 w-5" />
            {isDownloading ? 'Optimizing...' : 'Download PDF'}
          </Button>
          <Button
            onClick={downloadPNG}
            disabled={isDownloading}
            size="lg"
            variant="outline"
            className="flex-1 gap-2"
          >
            <FileImage className="h-5 w-5" />
            {isDownloading ? 'Optimizing...' : 'Download PNG'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
