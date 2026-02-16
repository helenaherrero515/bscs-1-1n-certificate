"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

const STUDENT_ID_PATTERN = /^2025-\d{5}-MN-0$/

export function CertificateForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [errors, setErrors] = useState<{ name?: string; studentId?: string }>(
    {}
  )
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  function validate() {
    const newErrors: { name?: string; studentId?: string } = {}
    if (!name.trim()) {
      newErrors.name = "Student name is required."
    }
    if (!studentId.trim()) {
      newErrors.studentId = "Student ID is required."
    } else if (!STUDENT_ID_PATTERN.test(studentId.trim())) {
      newErrors.studentId =
        "Invalid format. Use 2025-XXXXX-MN-0 (e.g. 2025-00001-MN-0)."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiError("")

    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch(
        `/api/verify-student?name=${encodeURIComponent(name.trim())}&student_id=${encodeURIComponent(studentId.trim())}`
      )
      const data = await res.json()

      if (!res.ok) {
        setApiError(data.error || "Student not found in the database.")
        return
      }

      // Redirect to the result page with student data
      const student = data.student
      const params = new URLSearchParams({
        name: student.name,
        student_id: student.student_id,
        award: student.award,
      })
      router.push(`/result?${params.toString()}`)
    } catch {
      setApiError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-card-foreground/10 bg-card/80 shadow-xl backdrop-blur-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="font-medium text-card-foreground">
              Student Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Juan Dela Cruz"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors((p) => ({ ...p, name: undefined }))
              }}
              className={`bg-card/60 text-card-foreground placeholder:text-card-foreground/40 ${
                errors.name
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-card-foreground/15"
              }`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="student-id" className="font-medium text-card-foreground">
              Student ID
            </Label>
            <Input
              id="student-id"
              placeholder="2025-XXXXX-MN-0"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value)
                if (errors.studentId)
                  setErrors((p) => ({ ...p, studentId: undefined }))
              }}
              className={`bg-card/60 text-card-foreground placeholder:text-card-foreground/40 ${
                errors.studentId
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-card-foreground/15"
              }`}
              aria-invalid={!!errors.studentId}
              aria-describedby={
                errors.studentId ? "student-id-error" : undefined
              }
            />
            {errors.studentId && (
              <p
                id="student-id-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.studentId}
              </p>
            )}
            <p className="text-xs text-card-foreground/50">
              {"Format: 2025-XXXXX-MN-0"}
            </p>
          </div>

          {apiError && (
            <div
              className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {apiError}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Get My Certificate
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
