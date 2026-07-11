"use client"

import * as React from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { RichTextToolbar } from "@/components/test-runner/rich-text-toolbar"

export function RichTextEditable({
  initialValue,
  onChange,
  placeholder,
  minHeightClassName = "min-h-16",
  maxWords,
}: {
  initialValue: string
  onChange: (text: string) => void
  placeholder?: string
  minHeightClassName?: string
  /** When set, typing beyond this many words is truncated back down (composition-safe, so Vietnamese IME input is never interrupted mid-character). */
  maxWords?: number
}) {
  const editorRef = React.useRef<HTMLDivElement>(null)
  const isComposingRef = React.useRef(false)

  // Uncontrolled by design: content is set once on mount from initialValue and
  // never re-synced via dangerouslySetInnerHTML on re-render, or the caret
  // would jump on every keystroke. Callers must pass a stable `key` (e.g. the
  // question id) so React remounts (and this effect reruns) when switching
  // to a different question.
  React.useEffect(() => {
    if (editorRef.current) editorRef.current.innerText = initialValue
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function enforceLimit() {
    const el = editorRef.current
    if (!el || maxWords == null) return
    const words = el.innerText.trim().length > 0 ? el.innerText.trim().split(/\s+/) : []
    if (words.length <= maxWords) return

    const truncated = words.slice(0, maxWords).join(" ")
    el.innerText = truncated
    const range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(false)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
    onChange(truncated)
  }

  function handleInput(event: React.FormEvent<HTMLDivElement>) {
    onChange(event.currentTarget.innerText)
    // Skip while composing (e.g. Vietnamese IME assembling a diacritic) so
    // truncation never interrupts an in-progress character.
    if (!isComposingRef.current) enforceLimit()
  }

  function handleCompositionEnd(event: React.CompositionEvent<HTMLDivElement>) {
    isComposingRef.current = false
    onChange(event.currentTarget.innerText)
    enforceLimit()
  }

  function blockClipboard(event: React.ClipboardEvent<HTMLDivElement>) {
    event.preventDefault()
    toast.error("Không thể dán hoặc sao chép nội dung trong bài thi")
  }

  return (
    <div className="flex flex-col gap-2">
      <RichTextToolbar />
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onCompositionStart={() => {
          isComposingRef.current = true
        }}
        onCompositionEnd={handleCompositionEnd}
        onPaste={blockClipboard}
        onCopy={blockClipboard}
        onCut={blockClipboard}
        data-placeholder={placeholder}
        className={cn(
          "w-full resize-none rounded-2xl border border-transparent bg-input/50 px-3 py-3 text-base whitespace-pre-wrap outline-none transition-[color,box-shadow,background-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm",
          "empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]",
          minHeightClassName,
        )}
      />
    </div>
  )
}
