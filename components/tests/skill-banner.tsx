import { FloatingBlobs } from "@/components/decor/floating-blobs"
import { SKILL_ICONS } from "@/lib/data/skill-icons"
import { SKILL_META, type Skill } from "@/lib/data/types"

const SKILL_GRADIENTS: Record<Skill, string> = {
  listening: "from-sky-400 via-cyan-500 to-blue-600",
  speaking: "from-rose-400 via-pink-500 to-fuchsia-600",
  reading: "from-blue-400 via-indigo-500 to-violet-600",
  writing: "from-emerald-400 via-teal-500 to-green-600",
}

export function SkillBanner({ skill }: { skill: Skill }) {
  const meta = SKILL_META[skill]
  const Icon = SKILL_ICONS[meta.icon]

  return (
    <div
      className={`relative overflow-hidden rounded-4xl bg-gradient-to-br p-6 text-white shadow-md sm:p-8 ${SKILL_GRADIENTS[skill]}`}
    >
      <FloatingBlobs />
      <div className="relative z-10 flex items-center gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-lg">
          <Icon className="size-7" />
        </span>
        <div>
          <p className="font-heading text-2xl font-medium tracking-tight">{meta.label}</p>
          <p className="text-sm text-white/85">{meta.description}</p>
        </div>
      </div>
    </div>
  )
}
