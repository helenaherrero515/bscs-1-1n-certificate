import { NextRequest, NextResponse } from "next/server"
import { PDFDocument, rgb } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import { readFile } from "fs/promises"
import path from "path"
import studentsData from "@/data/students.json"

interface Student {
  name: string
  student_id: string
  award: "PL" | "DL"
}

const students: Student[] = studentsData as Student[]

// Load Poppins Bold TTF from disk (cached after first read)
let poppinsBoldBuffer: Buffer | null = null
async function getPoppinsBold(): Promise<Buffer> {
  if (poppinsBoldBuffer) return poppinsBoldBuffer
  const fontPath = path.join(process.cwd(), "public", "fonts", "Poppins-Bold.ttf")
  poppinsBoldBuffer = await readFile(fontPath)
  return poppinsBoldBuffer
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, student_id, award } = body

    if (!name || !student_id || !award) {
      return NextResponse.json(
        { error: "Missing required fields: name, student_id, award." },
        { status: 400 }
      )
    }

    const student = students.find(
      (s) =>
        s.name.toLowerCase() === name.toLowerCase() &&
        s.student_id === student_id &&
        s.award === award
    )

    if (!student) {
      return NextResponse.json(
        { error: "Student verification failed." },
        { status: 403 }
      )
    }

    // Load the certificate template image (PNG)
    const templateFileName =
      award === "PL" ? "certificate_pl.png" : "certificate_dl.png"
    const templatePath = path.join(
      process.cwd(),
      "public",
      "certificates",
      templateFileName
    )
    const templateBytes = await readFile(templatePath)

    // Create PDF and register fontkit for custom fonts
    const pdfDoc = await PDFDocument.create()
    pdfDoc.registerFontkit(fontkit)

    // Embed the Poppins Bold font
    const poppinsBytes = await getPoppinsBold()
    const poppinsFont = await pdfDoc.embedFont(poppinsBytes)

    // Embed the template image as PNG
    const templateImage = await pdfDoc.embedPng(templateBytes)
    const imgDims = templateImage.scale(1)

    // Use landscape orientation matching the certificate template
    const pageWidth = Math.max(imgDims.width, 842)
    const pageHeight = Math.max(imgDims.height, 595)

    const page = pdfDoc.addPage([pageWidth, pageHeight])

    // Draw the template image as the background
    page.drawImage(templateImage, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
    })

    // Draw the student name in Poppins Bold at 110pt
    // White fill with light baby blue stroke (simulated via offset draws)
    const nameFontSize = 110
    const nameWidth = poppinsFont.widthOfTextAtSize(student.name, nameFontSize)
    const nameHeight = poppinsFont.heightAtSize(nameFontSize)
    const nameX = (pageWidth - nameWidth) / 2
    const nameY = pageHeight * 0.56 - nameHeight / 2

    // Stroke color #6B8EFF
    const strokeColor = rgb(0.42, 0.557, 1.0)

    // Simulate 2px stroke by drawing the text at offsets in the stroke color
    const strokeOffset = 2
    const offsets = [
      [-strokeOffset, 0],
      [strokeOffset, 0],
      [0, -strokeOffset],
      [0, strokeOffset],
      [-strokeOffset, -strokeOffset],
      [-strokeOffset, strokeOffset],
      [strokeOffset, -strokeOffset],
      [strokeOffset, strokeOffset],
    ]

    for (const [dx, dy] of offsets) {
      page.drawText(student.name, {
        x: nameX + dx,
        y: nameY + dy,
        size: nameFontSize,
        font: poppinsFont,
        color: strokeColor,
      })
    }

    // Draw the white fill on top
    page.drawText(student.name, {
      x: nameX,
      y: nameY,
      size: nameFontSize,
      font: poppinsFont,
      color: rgb(1, 1, 1),
    })

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Certificate_${award}_${student.name.replace(/\s+/g, "_")}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Certificate generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate certificate." },
      { status: 500 }
    )
  }
}
