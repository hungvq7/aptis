import { cn } from "@/lib/utils"

export function formatTime(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds)
  const hours = Math.floor(clamped / 3600)
  const minutes = Math.floor((clamped % 3600) / 60)
  const seconds = clamped % 60
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function TimerDisplay({
  seconds,
  warnBelowSeconds = 120,
  className,
}: {
  seconds: number
  warnBelowSeconds?: number
  className?: string
}) {
  const isLow = seconds <= warnBelowSeconds
  return (
    <span
      className={cn(
        "font-mono text-sm font-medium tabular-nums",
        isLow ? "text-destructive" : "text-foreground",
        className,
      )}
    >
      {formatTime(seconds)}
    </span>
  )
}
