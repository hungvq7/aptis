"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function StartTestButton({
  testId,
  size = "default",
}: {
  testId: string
  size?: "default" | "sm"
}) {
  const router = useRouter()
  const [isStarting, setIsStarting] = React.useState(false)

  async function handleStart() {
    setIsStarting(true)
    try {
      const response = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId }),
      })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.error ?? "Không thể bắt đầu bài thi")
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
    <Button onClick={handleStart} disabled={isStarting} size={size}>
      {isStarting ? <Spinner /> : null}
      Bắt đầu
    </Button>
  )
}
