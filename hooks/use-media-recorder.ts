"use client"

import * as React from "react"

export type RecorderStatus = "idle" | "requesting-permission" | "recording" | "stopped" | "error"

export function useMediaRecorder() {
  const [status, setStatus] = React.useState<RecorderStatus>("idle")
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null)
  const [durationSeconds, setDurationSeconds] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const streamRef = React.useRef<MediaStream | null>(null)
  const chunksRef = React.useRef<Blob[]>([])
  const startedAtRef = React.useRef<number>(0)

  const cleanupStream = React.useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }, [])

  React.useEffect(() => cleanupStream, [cleanupStream])

  const startRecording = React.useCallback(async () => {
    setError(null)
    setStatus("requesting-permission")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        setAudioUrl((previous) => {
          if (previous) URL.revokeObjectURL(previous)
          return URL.createObjectURL(blob)
        })
        setDurationSeconds(Math.round((Date.now() - startedAtRef.current) / 1000))
        cleanupStream()
      }

      startedAtRef.current = Date.now()
      recorder.start()
      setStatus("recording")
    } catch {
      setError("Không thể truy cập micro. Vui lòng cấp quyền và thử lại.")
      setStatus("error")
    }
  }, [cleanupStream])

  const stopRecording = React.useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
      setStatus("stopped")
    }
  }, [])

  const reset = React.useCallback(() => {
    setAudioUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return null
    })
    setDurationSeconds(0)
    setError(null)
    setStatus("idle")
  }, [])

  return { status, audioUrl, durationSeconds, error, startRecording, stopRecording, reset }
}
