import { AudioPlayer } from "@/components/test-runner/audio-player"
import { PassageSplitView } from "@/components/test-runner/passage-split-view"
import { RenderQuestion } from "@/components/test-runner/render-question"
import type { Answer, Part } from "@/lib/data/types"

function QuestionList({
  part,
  answers,
  onAnswerChange,
}: {
  part: Part
  answers: Record<string, Answer>
  onAnswerChange: (answer: Answer) => void
}) {
  return (
    <div className="flex flex-col gap-6">
      {part.questions.map((question) => (
        <RenderQuestion
          key={question.id}
          question={question}
          answer={answers[question.id]}
          onChange={onAnswerChange}
        />
      ))}
    </div>
  )
}

export function PartContent({
  part,
  answers,
  onAnswerChange,
}: {
  part: Part
  answers: Record<string, Answer>
  onAnswerChange: (answer: Answer) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-heading text-lg font-medium">{part.title}</h2>
        <p className="text-sm text-muted-foreground">{part.instructions}</p>
      </div>

      {part.audioClipId ? <AudioPlayer audioClipId={part.audioClipId} /> : null}

      {part.passages && part.passages.length > 0 ? (
        <PassageSplitView passages={part.passages}>
          <QuestionList part={part} answers={answers} onAnswerChange={onAnswerChange} />
        </PassageSplitView>
      ) : (
        <QuestionList part={part} answers={answers} onAnswerChange={onAnswerChange} />
      )}
    </div>
  )
}
