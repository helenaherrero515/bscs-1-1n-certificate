import { NextRequest, NextResponse } from "next/server"
import { PDFDocument, rgb } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import { readFileSync, existsSync } from "fs"
import path from "path"
import studentsData from "@/data/students.json"

interface Student {
  name: string
  student_id: string
  award: "PL" | "DL"
}

const students: Student[] = studentsData as Student[]

// Google Fonts CDN URL for Poppins Bold TTF
const POPPINS_BOLD_URL =
  "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Bold.ttf"

// Cache assets in memory
let poppinsBoldCache: ArrayBuffer | null = null
const templateCache: Record<string, Buffer> = {}

function loadTemplateFromDisk(fileName: string): Buffer {
  // Try multiple possible paths where Vercel might place public assets
  const possiblePaths = [
    path.join(process.cwd(), "public", "certificates", fileName),
    path.join(process.cwd(), ".next", "static", "certificates", fileName),
    path.join("/var/task", "public", "certificates", fileName),
    path.join("/var/task", ".next", "server", "app", "certificates", fileName),
  ]

  for (const p of possiblePaths) {
    if (existsSync(p)) {
      console.log(`[v0] Found template at: ${p}`)
      return readFileSync(p)
    }
  }

  throw new Error(
    `Template ${fileName} not found. Tried: ${possiblePaths.join(", ")}`
  )
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

    // Load certificate template from disk (works on both local and Vercel)
    const templateFileName =
      award === "PL" ? "certificate_pl.png" : "certificate_dl.png"

    if (!templateCache[templateFileName]) {
      templateCache[templateFileName] = loadTemplateFromDisk(templateFileName)
    }
    const templateBytes = templateCache[templateFileName]

    // Fetch Poppins Bold from Google Fonts CDN (avoids self-fetch issue on Vercel)
    if (!poppinsBoldCache) {
      console.log("[v0] Fetching Poppins Bold from CDN...")
      const fontRes = await fetch(POPPINS_BOLD_URL)
      if (!fontRes.ok) {
        throw new Error(`Failed to fetch Poppins Bold: ${fontRes.status}`)
      }
      poppinsBoldCache = await fontRes.arrayBuffer()
      console.log("[v0] Poppins Bold fetched successfully")
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
    console.error("[v0] Certificate generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate certificate.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
