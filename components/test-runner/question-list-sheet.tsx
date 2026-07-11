"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { isPartAnyAnswered } from "@/lib/test-runner/part-status"
import { SKILL_META, type Answer, type Part, type Test } from "@/lib/data/types"

function PartRow({
  part,
  index,
  answers,
  isCurrent,
  isVisited,
  onJump,
}: {
  part: Part
  index: number
  answers: Record<string, Answer>
  isCurrent: boolean
  isVisited: boolean
  onJump: (index: number) => void
}) {
  const attempted = isPartAnyAnswered(part, answers)
  return (
    <button
      type="button"
      onClick={() => onJump(index)}
      className={cn(
        "flex w-full items-center justify-between gap-2 border-b border-border/60 px-4 py-3 text-left text-sm transition-colors",
        isCurrent ? "bg-secondary" : "hover:bg-muted",
      )}
    >
      <div className="flex flex-col">
        <span className="font-medium">{(index + 1).toString().padStart(2, "0")}</span>
        <span className="text-xs text-muted-foreground">{part.title}</span>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Badge variant="outline" className="text-[10px]">
          {isVisited ? "Seen" : "Unseen"}
        </Badge>
        <Badge variant={attempted ? "default" : "secondary"} className="text-[10px]">
          {attempted ? "Đã làm" : "Chưa làm"}
        </Badge>
      </div>
    </button>
  )
}

export function QuestionListSheet({
  open,
  onOpenChange,
  test,
  parts,
  answers,
  bookmarkedQuestionIds,
  visitedPartIndices,
  currentPartIndex,
  onJump,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  test: Test
  parts: Part[]
  answers: Record<string, Answer>
  bookmarkedQuestionIds: Set<string>
  visitedPartIndices: Set<number>
  currentPartIndex: number
  onJump: (index: number) => void
}) {
  const skillMeta = SKILL_META[test.skill]
  const bookmarkedPartIndices = parts
    .map((part, index) => ({ part, index }))
    .filter(({ part }) => part.questions.some((question) => bookmarkedQuestionIds.has(question.id)))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full p-0 sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Question List</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="all" className="flex flex-1 flex-col overflow-hidden">
          <TabsList className="mx-4 w-fit">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="bookmarked">Bookmarked ({bookmarkedPartIndices.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="flex-1 overflow-y-auto">
            <div className="border-y border-border/60 px-4 py-3 text-sm font-medium text-muted-foreground">
              Aptis General {skillMeta.shortLabel} Instructions
            </div>
            <div className="px-4 py-2 text-xs font-medium text-muted-foreground">
              {skillMeta.shortLabel} — {parts.length} Questions
            </div>
            {parts.map((part, index) => (
              <PartRow
                key={part.id}
                part={part}
                index={index}
                answers={answers}
                isCurrent={index === currentPartIndex}
                isVisited={visitedPartIndices.has(index)}
                onJump={(i) => {
                  onJump(i)
                  onOpenChange(false)
                }}
              />
            ))}
          </TabsContent>

          <TabsContent value="bookmarked" className="flex-1 overflow-y-auto">
            {bookmarkedPartIndices.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                Chưa có câu hỏi nào được đánh dấu.
              </p>
            ) : (
              bookmarkedPartIndices.map(({ part, index }) => (
                <PartRow
                  key={part.id}
                  part={part}
                  index={index}
                  answers={answers}
                  isCurrent={index === currentPartIndex}
                  isVisited={visitedPartIndices.has(index)}
                  onJump={(i) => {
                    onJump(i)
                    onOpenChange(false)
                  }}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
