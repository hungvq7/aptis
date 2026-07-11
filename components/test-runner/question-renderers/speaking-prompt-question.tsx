"use client"

import * as React from "react"
import Image from "next/image"
import { MicIcon, PlayIcon, RotateCcwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TimerDisplay } from "@/components/test-runner/timer-display"
import { useMediaRecorder } from "@/hooks/use-media-recorder"
import type { SpeakingPromptAnswer, SpeakingPromptQuestion } from "@/lib/data/types"

type Phase = "idle" | "prep" | "recording" | "done"

export function SpeakingPromptQuestionRenderer({
  question,
  onChange,
}: {
  question: SpeakingPromptQuestion
  answer?: SpeakingPromptAnswer
  onChange: (answer: SpeakingPromptAnswer) => void
}) {
  const [phase, setPhase] = React.useState<Phase>("idle")
  const [prepRemaining, setPrepRemaining] = React.useState(question.prepSeconds)
  const [recordRemaining, setRecordRemaining] = React.useState(question.recordSeconds)
  const recorder = useMediaRecorder()

  React.useEffect(() => {
    if (phase !== "prep") return
    if (prepRemaining <= 0) {
      const id = setTimeout(() => {
        setPhase("recording")
        recorder.startRecording()
      }, 0)
      return () => clearTimeout(id)
    }
    const timeout = setTimeout(() => setPrepRemaining((s) => s - 1), 1000)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, prepRemaining])

  React.useEffect(() => {
    if (phase !== "recording") return
    if (recordRemaining <= 0) {
      const id = setTimeout(() => {
        recorder.stopRecording()
        setPhase("done")
      }, 0)
      return () => clearTimeout(id)
    }
    const timeout = setTimeout(() => setRecordRemaining((s) => s - 1), 1000)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, recordRemaining])

  React.useEffect(() => {
    if (recorder.audioUrl) {
      onChange({
        questionId: question.id,
        type: "speaking-prompt",
        hasRecording: true,
        durationSeconds: recorder.durationSeconds,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recorder.audioUrl])

  function handleStart() {
    setPrepRemaining(question.prepSeconds)
    setRecordRemaining(question.recordSeconds)
    setPhase("prep")
  }

  function handleRetry() {
    recorder.reset()
    setPhase("idle")
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-pretty">{question.prompt}</p>
      {question.imageUrls && question.imageUrls.length > 0 ? (
        <div className={`grid gap-3 ${question.imageUrls.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {question.imageUrls.map((src) => (
            <div key={src} className="overflow-hidden rounded-2xl ring-1 ring-foreground/10">
              <Image src={src} alt="" width={640} height={400} className="h-auto w-full" />
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4">
        {phase === "idle" && (
          <Button type="button" onClick={handleStart} className="w-fit">
            <MicIcon />
            Bắt đầu trả lời
          </Button>
        )}

        {phase === "prep" && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Thời gian chuẩn bị:</span>
            <TimerDisplay seconds={prepRemaining} warnBelowSeconds={5} />
          </div>
        )}

        {phase === "recording" && (
          <div className="flex items-center gap-2 text-sm">
            <span className="flex size-2 animate-pulse rounded-full bg-destructive" />
            <span className="text-muted-foreground">Đang ghi âm:</span>
            <TimerDisplay seconds={recordRemaining} warnBelowSeconds={5} />
          </div>
        )}

        {recorder.status === "error" && (
          <p className="text-sm text-destructive">{recorder.error}</p>
        )}

        {phase === "done" && recorder.audioUrl && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <PlayIcon className="size-4" />
              Nghe lại câu trả lời của bạn
            </div>
            <audio controls src={recorder.audioUrl} className="h-10 w-full" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="w-fit" onClick={handleRetry}>
                  <RotateCcwIcon />
                  Ghi âm lại
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bản ghi âm sẽ được lưu trữ khi tích hợp với hệ thống chính thức</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  )
}
