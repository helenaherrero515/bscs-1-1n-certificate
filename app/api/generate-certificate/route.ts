import { NextRequest, NextResponse } from "next/server"
import { PDFDocument, rgb } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import { readFileSync } from "fs"
import path from "path"
import studentsData from "@/data/students.json"

interface Student {
  name: string
  student_id: string
  gpa: string
  award: 'PL' | 'DL' | 'AA'
}

const students: Student[] = studentsData as Student[]
const POPPINS_BOLD_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Bold.ttf"
let poppinsBoldCache: ArrayBuffer | null = null

const PDF_COORDINATES = {
  PAGE_WIDTH: 1984,
  PAGE_HEIGHT: 1240,
  CENTER_X: 992,
  NAME_Y: 565,
  NAME_FONT_SIZE: 120,
  GWA_Y: 475,
  GWA_FONT_SIZE: 29,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // We only need name and student_id to verify the identity
    const { name, student_id } = body 

    // Find the student in the local JSON data 
    const student = students.find(
      (s) => s.name.toLowerCase() === name.toLowerCase() && s.student_id === student_id
    )

    if (!student) {
      return NextResponse.json({ error: "Student verification failed" }, { status: 403 })
    }

    // FIX: Use student.award from the JSON file, not the request body
    const fileName = student.award === "PL" 
      ? "certificate_pl.png" 
      : student.award === "DL" 
        ? "certificate_dl.png" 
        : "certificate_acad.png"
    
    const certificatePath = path.join(process.cwd(), "public", "certificates", fileName)
    const pngBytes = readFileSync(certificatePath)

    if (!poppinsBoldCache) {
      const fontRes = await fetch(POPPINS_BOLD_URL)
      poppinsBoldCache = await fontRes.arrayBuffer()
    }

    const pdfDoc = await PDFDocument.create()
    pdfDoc.registerFontkit(fontkit)
    const poppinsFont = await pdfDoc.embedFont(poppinsBoldCache)
    const embeddedImage = await pdfDoc.embedPng(pngBytes)

    const page = pdfDoc.addPage([PDF_COORDINATES.PAGE_WIDTH, PDF_COORDINATES.PAGE_HEIGHT])
    page.drawImage(embeddedImage, { x: 0, y: 0, width: PDF_COORDINATES.PAGE_WIDTH, height: PDF_COORDINATES.PAGE_HEIGHT })

    const navyBlue = rgb(0, 31 / 255, 63 / 255)
    const white = rgb(1, 1, 1)

    const nameWidth = poppinsFont.widthOfTextAtSize(name, PDF_COORDINATES.NAME_FONT_SIZE)
    const nameX = PDF_COORDINATES.CENTER_X - (nameWidth / 2)

    const gwaText = `With a General Weighted Average (GWA) of ${student.gpa}`
    const gwaWidth = poppinsFont.widthOfTextAtSize(gwaText, PDF_COORDINATES.GWA_FONT_SIZE)
    const gwaX = PDF_COORDINATES.CENTER_X - (gwaWidth / 2)

    const offsets = [[-1.5, 0], [1.5, 0], [0, -1.5], [0, 1.5]]
    for (const [dx, dy] of offsets) {
      page.drawText(name, {
        x: nameX + dx,
        y: PDF_COORDINATES.NAME_Y + dy,
        size: PDF_COORDINATES.NAME_FONT_SIZE,
        font: poppinsFont,
        color: navyBlue,
      })
    }

    page.drawText(name, { x: nameX, y: PDF_COORDINATES.NAME_Y, size: PDF_COORDINATES.NAME_FONT_SIZE, font: poppinsFont, color: white })
    page.drawText(gwaText, { x: gwaX, y: PDF_COORDINATES.GWA_Y, size: PDF_COORDINATES.GWA_FONT_SIZE, font: poppinsFont, color: white })

    const pdfBytes = await pdfDoc.save()
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Certificate_${name.replace(/\s+/g, "_")}.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}