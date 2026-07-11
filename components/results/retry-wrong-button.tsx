"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { RotateCcwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function RetryWrongButton({ sourceAttemptId }: { sourceAttemptId: string }) {
  const router = useRouter()
  const [isStarting, setIsStarting] = React.useState(false)

  async function handleRetry() {
    setIsStarting(true)
    try {
      const response = await fetch("/api/attempts/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceAttemptId }),
      })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.error ?? "Không thể tạo bài ôn tập")
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
    <Button onClick={handleRetry} disabled={isStarting} variant="outline">
      {isStarting ? <Spinner /> : <RotateCcwIcon />}
      Ôn tập câu sai
    </Button>
  )
}
