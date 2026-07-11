import { MultipleChoiceQuestionRenderer } from "@/components/test-runner/question-renderers/multiple-choice-question"
import { ReorderQuestionRenderer } from "@/components/test-runner/question-renderers/reorder-question"
import { GapFillQuestionRenderer } from "@/components/test-runner/question-renderers/gap-fill-question"
import { MatchingQuestionRenderer } from "@/components/test-runner/question-renderers/matching-question"
import { ShortAnswerQuestionRenderer } from "@/components/test-runner/question-renderers/short-answer-question"
import { EssayQuestionRenderer } from "@/components/test-runner/question-renderers/essay-question"
import { SpeakingPromptQuestionRenderer } from "@/components/test-runner/question-renderers/speaking-prompt-question"
import type { Answer, Question } from "@/lib/data/types"

export function RenderQuestion({
  question,
  answer,
  onChange,
}: {
  question: Question
  answer?: Answer
  onChange: (answer: Answer) => void
}) {
  switch (question.type) {
    case "multiple-choice":
      return (
        <MultipleChoiceQuestionRenderer
          question={question}
          answer={answer?.type === "multiple-choice" ? answer : undefined}
          onChange={onChange}
        />
      )
    case "reorder":
      return (
        <ReorderQuestionRenderer
          question={question}
          answer={answer?.type === "reorder" ? answer : undefined}
          onChange={onChange}
        />
      )
    case "gap-fill":
      return (
        <GapFillQuestionRenderer
          question={question}
          answer={answer?.type === "gap-fill" ? answer : undefined}
          onChange={onChange}
        />
      )
    case "matching":
      return (
        <MatchingQuestionRenderer
          question={question}
          answer={answer?.type === "matching" ? answer : undefined}
          onChange={onChange}
        />
      )
    case "short-answer":
      return (
        <ShortAnswerQuestionRenderer
          question={question}
          answer={answer?.type === "short-answer" ? answer : undefined}
          onChange={onChange}
        />
      )
    case "essay":
      return (
        <EssayQuestionRenderer
          question={question}
          answer={answer?.type === "essay" ? answer : undefined}
          onChange={onChange}
        />
      )
    case "speaking-prompt":
      return (
        <SpeakingPromptQuestionRenderer
          question={question}
          answer={answer?.type === "speaking-prompt" ? answer : undefined}
          onChange={onChange}
        />
      )
  }
}
