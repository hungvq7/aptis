import { HeadphonesIcon } from "lucide-react"
import { getAudioUrl } from "@/lib/data/mock/audio-config"

export function AudioPlayer({ audioClipId }: { audioClipId: string | undefined }) {
  const src = getAudioUrl(audioClipId)
  if (!src) return null

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <HeadphonesIcon className="size-4" />
      </span>
      <audio controls src={src} className="h-9 w-full" />
    </div>
  )
}
