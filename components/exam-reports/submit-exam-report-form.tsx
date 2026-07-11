"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { SkillQuestionPicker } from "@/components/exam-reports/skill-question-picker"
import { SKILL_META, SKILLS, TEST_CENTERS, type QuestionBankEntry, type Skill } from "@/lib/data/types"

export function SubmitExamReportForm({
  entriesBySkill,
}: {
  entriesBySkill: Record<Skill, QuestionBankEntry[]>
}) {
  const router = useRouter()
  const [examDate, setExamDate] = React.useState<Date | undefined>(undefined)
  const [testCenter, setTestCenter] = React.useState("")
  const [selectedBySkill, setSelectedBySkill] = React.useState<Record<Skill, Set<string>>>(
    () => Object.fromEntries(SKILLS.map((skill) => [skill, new Set<string>()])) as Record<Skill, Set<string>>,
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  function toggleQuestion(skill: Skill, questionId: string) {
    setSelectedBySkill((prev) => {
      const next = new Set(prev[skill])
      if (next.has(questionId)) next.delete(questionId)
      else next.add(questionId)
      return { ...prev, [skill]: next }
    })
  }

  const totalSelected = SKILLS.reduce((sum, skill) => sum + selectedBySkill[skill].size, 0)

  async function handleSubmit() {
    if (!examDate || !testCenter) {
      toast.error("Vui lòng chọn ngày thi và cơ sở thi")
      return
    }
    if (totalSelected === 0) {
      toast.error("Vui lòng chọn ít nhất một câu hỏi")
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/exam-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examDate: format(examDate, "yyyy-MM-dd"),
          testCenter,
          questionIdsBySkill: Object.fromEntries(SKILLS.map((skill) => [skill, [...selectedBySkill[skill]]])),
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.error ?? "Không thể gửi đề")
        return
      }
      router.push(`/review-de/${data.id}`)
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup className="sm:flex-row sm:gap-4">
        <Field className="flex-1">
          <FieldLabel htmlFor="exam-date">Ngày thi</FieldLabel>
          <DatePicker value={examDate} onChange={setExamDate} placeholder="Chọn ngày thi" />
        </Field>
        <Field className="flex-1">
          <FieldLabel htmlFor="test-center">Cơ sở thi</FieldLabel>
          <Select value={testCenter} onValueChange={setTestCenter}>
            <SelectTrigger id="test-center" className="w-full">
              <SelectValue placeholder="Chọn cơ sở thi" />
            </SelectTrigger>
            <SelectContent>
              {TEST_CENTERS.map((center) => (
                <SelectItem key={center} value={center}>
                  {center}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-2">
        <FieldLabel>Câu hỏi vừa thi theo từng phần</FieldLabel>
        <Accordion type="multiple" defaultValue={[...SKILLS]}>
          {SKILLS.map((skill) => (
            <AccordionItem key={skill} value={skill}>
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  {SKILL_META[skill].label}
                  {selectedBySkill[skill].size > 0 ? (
                    <Badge variant="secondary">{selectedBySkill[skill].size} câu</Badge>
                  ) : null}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <SkillQuestionPicker
                  entries={entriesBySkill[skill]}
                  selected={selectedBySkill[skill]}
                  onToggle={(questionId) => toggleQuestion(skill, questionId)}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="w-fit">
        {isSubmitting ? <Spinner /> : null}
        Gửi đề ({totalSelected} câu đã chọn)
      </Button>
    </div>
  )
}
