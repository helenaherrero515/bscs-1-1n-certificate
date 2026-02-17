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
      
      const imgWidthMm = (canvas.width * 0.264583) / 4
      const imgHeightMm = (canvas.height * 0.264583) / 4

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

        {/* Certificate Preview Container */}
        <div className="relative w-full overflow-hidden rounded-lg shadow-2xl border border-white/5">
          <div
            ref={certRef}
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: '16 / 10',
              backgroundImage: "url('/certificate_bg.png')",
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          >
            {/* Logo Section */}
            <div className="absolute left-1/2 top-[5%] -translate-x-1/2">
              <img
                src="/logo.png"
                alt="Class Logo"
                className="h-auto w-40 drop-shadow-lg md:w-33"
                crossOrigin="anonymous"
              />
            </div>

            {/* Dynamic Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center px-[10%] text-center">
              
              <h2 
                className="absolute top-[28%] w-full font-sans font-bold italic text-white"
                style={{
                  fontSize: 'clamp(1rem, 4vw, 2.8rem)',
                  textShadow: '0 0 10px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                Certificate of Recognition
              </h2>

              {/* Adjusted top position to 38% to create space */}
              <p className="absolute top-[40%] w-full text-[8px] font-bold uppercase tracking-widest text-white/90 sm:text-[10px] md:text-xs">
                This certificate is awarded to
              </p>

              {/* Added underline and moved to 42% */}
              <p
                className="absolute top-[39.5%] w-full font-display font-bold text-white"
                style={{
                  WebkitTextStroke: '1px #031642', 
                  paintOrder: 'stroke fill',
                  textShadow: '0 4px 10px rgba(0,0,0,0.4)',
                  fontSize: 'clamp(2rem, 5.5vw, 4rem)',
                }}
              >
                {student.name}
              </p>

              <p className="absolute top-[60%] w-full text-[8px] font-bold text-white/90 sm:text-sm">
                from BSCS 1-1N
              </p>

              {/* Description Paragraphs */}
              <div className="absolute top-[66%] flex w-[75%] flex-col gap-1 md:gap-2">
                <p className="text-[7px] leading-tight text-white sm:text-[9px] md:text-[12px] lg:text-[13px]">
                  With a General Weighted Average (GWA) of{' '}
                  <strong className="font-bold underline underline-offset-1">{student.gpa}</strong>,
                  this certifies that the student is a Bachelor of Science in Computer
                  Science student at the{' '}
                  <strong className="font-bold">Polytechnic University of the Philippines</strong>, 
                  who has demonstrated outstanding academic performance.
                </p>

                <p className="text-[7px] leading-tight text-white sm:text-[9px] md:text-[12px] lg:text-[13px]">
                  In recognition of high scholastic achievement, the distinction of{' '}
                  <strong className="font-bold">{awardLabel}</strong> is hereby
                  conferred for the First Semester of{' '}
                  <strong className="font-bold italic">A.Y. 2025–2026</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={downloadPDF}
            disabled={isDownloading}
            size="lg"
            className="flex-1 gap-2 bg-gradient-to-r from-green-700 to-green-600 text-white hover:from-green-800 hover:to-green-700"
          >
            <Download className="h-5 w-5" />
            {isDownloading ? 'Processing...' : 'Download PDF'}
          </Button>
          <Button
            onClick={downloadPNG}
            disabled={isDownloading}
            size="lg"
            className="flex-1 gap-2 bg-white text-dark gray border border-white hover:bg-gray-200 font-bold shadow-md transition-colors"
          >
            <FileImage className="h-5 w-5" />
            {isDownloading ? 'Processing...' : 'Download PNG'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}