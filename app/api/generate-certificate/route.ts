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
}

const students: Student[] = studentsData as Student[]
const POPPINS_BOLD_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Bold.ttf"
let poppinsBoldCache: ArrayBuffer | null = null

// FIXED COORDINATES: Synced for 1984x1240 Template
const PDF_COORDINATES = {
  PAGE_WIDTH: 1984,
  PAGE_HEIGHT: 1240,
  CENTER_X: 992,
  NAME_Y: 540,           // Centered vertically from bottom
  NAME_FONT_SIZE: 170,   
  GWA_Y: 480,            
  GWA_FONT_SIZE: 29,     
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, student_id, award } = body // Use award from body

    const student = students.find(
      (s) => s.name.toLowerCase() === name.toLowerCase() && s.student_id === student_id
    )

    if (!student) {
      return NextResponse.json({ error: "Student verification failed" }, { status: 403 })
    }

    // Determine background based on award
    const fileName = award === "PL" ? "certificate_pl.png" : award === "DL" ? "certificate_dl.png" : "certificate_acad.png"
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

    // Name Centering
    const nameWidth = poppinsFont.widthOfTextAtSize(name, PDF_COORDINATES.NAME_FONT_SIZE)
    const nameX = PDF_COORDINATES.CENTER_X - (nameWidth / 2)

    // GWA Centering
    const gwaText = `With a General Weighted Average (GWA) of ${student.gpa}`
    const gwaWidth = poppinsFont.widthOfTextAtSize(gwaText, PDF_COORDINATES.GWA_FONT_SIZE)
    const gwaX = PDF_COORDINATES.CENTER_X - (gwaWidth / 2)

    // Draw Name with Bold Stroke
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