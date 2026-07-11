import { Award, Flame, Rocket, Sparkles, Target, Trophy, type LucideIcon } from "lucide-react"
import { FloatingBlobs } from "@/components/decor/floating-blobs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { Badge, StreakInfo } from "@/lib/data/types"

const BADGE_ICONS: Record<string, LucideIcon> = {
  rocket: Rocket,
  flame: Flame,
  trophy: Trophy,
  sparkles: Sparkles,
  target: Target,
  award: Award,
}

export function WelcomeBanner({
  userName,
  streak,
  badges,
}: {
  userName: string
  streak: StreakInfo
  badges: Badge[]
}) {
  const earnedBadges = badges.filter((badge) => badge.earned)

  return (
    <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-primary via-primary/85 to-indigo-600 p-6 text-primary-foreground shadow-md sm:p-8">
      <FloatingBlobs />
      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-heading text-2xl font-medium tracking-tight">Chào {userName} 👋</p>
          <p className="text-sm text-primary-foreground/85">
            {streak.practicedToday
              ? "Bạn đã luyện tập hôm nay — tiếp tục phát huy nhé!"
              : "Luyện tập hôm nay để giữ chuỗi ngày học của bạn."}
          </p>
          <div className="flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium">
            <Flame className="size-4" />
            {streak.currentStreak} ngày liên tiếp
          </div>
        </div>

        {earnedBadges.length > 0 ? (
          <div className="flex items-center gap-2">
            {earnedBadges.slice(0, 4).map((badge) => {
              const Icon = BADGE_ICONS[badge.icon] ?? Award
              return (
                <Tooltip key={badge.id}>
                  <TooltipTrigger asChild>
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-lg">
                      <Icon className="size-5" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex flex-col gap-0.5 py-0.5">
                      <p className="font-medium">{badge.label}</p>
                      <p className="text-background/70">{badge.description}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}
