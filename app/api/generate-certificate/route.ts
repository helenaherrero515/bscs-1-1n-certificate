import { NextRequest, NextResponse } from "next/server"
import { PDFDocument, rgb } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import studentsData from "@/data/students.json"

interface Student {
  name: string
  student_id: string
  award: "PL" | "DL"
}

const students: Student[] = studentsData as Student[]

// Cache fetched assets in memory across requests
let poppinsBoldCache: ArrayBuffer | null = null
const templateCache: Record<string, ArrayBuffer> = {}

async function fetchAsset(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  return res.arrayBuffer()
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

    // Build the base URL from the incoming request
    const origin = request.nextUrl.origin

    // Fetch the certificate template PNG via HTTP (works on Vercel)
    const templateFileName =
      award === "PL" ? "certificate_pl.png" : "certificate_dl.png"
    const templateUrl = `${origin}/certificates/${templateFileName}`

    if (!templateCache[templateFileName]) {
      templateCache[templateFileName] = await fetchAsset(templateUrl)
    }
    const templateBytes = templateCache[templateFileName]

    // Fetch the Poppins Bold font via HTTP
    if (!poppinsBoldCache) {
      poppinsBoldCache = await fetchAsset(`${origin}/fonts/Poppins-Bold.ttf`)
    }

    // Create PDF and register fontkit for custom fonts
    const pdfDoc = await PDFDocument.create()
    pdfDoc.registerFontkit(fontkit)

    // Embed the Poppins Bold font
    const poppinsFont = await pdfDoc.embedFont(new Uint8Array(poppinsBoldCache))

    // Embed the template image as PNG
    const templateImage = await pdfDoc.embedPng(new Uint8Array(templateBytes))
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
    // White fill with #6B8EFF stroke (simulated via offset draws)
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
