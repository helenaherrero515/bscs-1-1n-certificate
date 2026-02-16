import { NextRequest, NextResponse } from "next/server"
import studentsData from "@/data/students.json"

interface Student {
  name: string
  student_id: string
  award: "PL" | "DL"
}

const students: Student[] = studentsData as Student[]

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const name = searchParams.get("name")?.trim()
  const studentId = searchParams.get("student_id")?.trim()

  if (!name || !studentId) {
    return NextResponse.json(
      { error: "Both name and student_id are required." },
      { status: 400 }
    )
  }

  const pattern = /^2025-\d{5}-MN-0$/
  if (!pattern.test(studentId)) {
    return NextResponse.json(
      { error: "Invalid Student ID format. Expected: 2025-XXXXX-MN-0" },
      { status: 400 }
    )
  }

  const student = students.find(
    (s) =>
      s.name.toLowerCase() === name.toLowerCase() &&
      s.student_id === studentId
  )

  if (!student) {
    return NextResponse.json(
      {
        error:
          "Student not found. Please check your name and ID, or contact your block representative.",
      },
      { status: 404 }
    )
  }

  return NextResponse.json({ student })
}
