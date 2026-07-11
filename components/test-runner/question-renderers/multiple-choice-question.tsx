"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { MultipleChoiceAnswer, MultipleChoiceQuestion } from "@/lib/data/types"

export function MultipleChoiceQuestionRenderer({
  question,
  answer,
  onChange,
}: {
  question: MultipleChoiceQuestion
  answer?: MultipleChoiceAnswer
  onChange: (answer: MultipleChoiceAnswer) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">{question.prompt}</p>
      <RadioGroup
        value={answer?.selectedOptionId ?? undefined}
        onValueChange={(value) =>
          onChange({ questionId: question.id, type: "multiple-choice", selectedOptionId: value })
        }
      >
        {question.options.map((option, index) => {
          const id = `${question.id}-${option.id}`
          const letter = String.fromCharCode(65 + index)
          return (
            <div key={option.id} className="flex items-center gap-2">
              <RadioGroupItem value={option.id} id={id} />
              <Label htmlFor={id} className="font-normal">
                <span className="mr-1.5 font-medium">{letter}.</span>
                {option.label}
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    </div>
  )
}
