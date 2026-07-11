import { Headphones, Mic, BookOpen, PenLine, type LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SKILL_META, type Skill } from "@/lib/data/types"

const ICONS: Record<Skill, LucideIcon> = {
  listening: Headphones,
  speaking: Mic,
  reading: BookOpen,
  writing: PenLine,
}

const PART_COUNTS: Record<Skill, number> = {
  listening: 4,
  speaking: 4,
  reading: 5,
  writing: 4,
}

export function SkillsOverviewSection() {
  const skills = Object.values(SKILL_META)

  return (
    <section id="ky-nang" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 flex flex-col gap-2">
        <h2 className="font-heading text-3xl font-medium tracking-tight">4 kỹ năng, đúng cấu trúc đề thi</h2>
        <p className="text-muted-foreground">
          Mỗi kỹ năng được chia thành các phần thi riêng biệt, mô phỏng sát với bài thi Aptis thật.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((skill) => {
          const Icon = ICONS[skill.id]
          return (
            <Card key={skill.id}>
              <CardHeader>
                <span className="mb-2 flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <CardTitle className="flex items-center gap-2 text-base">
                  {skill.label}
                  <Badge variant="secondary">{PART_COUNTS[skill.id]} phần</Badge>
                </CardTitle>
                <CardDescription>{skill.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
