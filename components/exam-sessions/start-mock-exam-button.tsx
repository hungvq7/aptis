"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function StartMockExamButton() {
  const router = useRouter()
  const [isStarting, setIsStarting] = React.useState(false)

  async function handleStart() {
    setIsStarting(true)
    try {
      const response = await fetch("/api/exam-sessions", { method: "POST" })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.error ?? "Không thể bắt đầu thi thử")
        return
      }
      router.push(`/bai-thi/${data.attemptId}`)
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <Button onClick={handleStart} disabled={isStarting} size="lg">
      {isStarting ? <Spinner /> : null}
      Bắt đầu thi thử
    </Button>
  )
}
