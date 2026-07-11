"use client"

import { BoldIcon, ItalicIcon, ListIcon, ListOrderedIcon, UnderlineIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

const COMMANDS = [
  { command: "bold", icon: BoldIcon, label: "Đậm" },
  { command: "italic", icon: ItalicIcon, label: "Nghiêng" },
  { command: "underline", icon: UnderlineIcon, label: "Gạch chân" },
  { command: "insertUnorderedList", icon: ListIcon, label: "Danh sách" },
  { command: "insertOrderedList", icon: ListOrderedIcon, label: "Danh sách số" },
] as const

export function RichTextToolbar() {
  function runCommand(command: string) {
    document.execCommand(command)
  }

  return (
    <div className="flex items-center gap-1 rounded-2xl border border-border/60 bg-muted/40 p-1">
      {COMMANDS.map(({ command, icon: Icon, label }) => (
        <Button
          key={command}
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          // onMouseDown (not onClick) + preventDefault keeps the contentEditable
          // selection intact so document.execCommand acts on the right range.
          onMouseDown={(event) => {
            event.preventDefault()
            runCommand(command)
          }}
        >
          <Icon />
        </Button>
      ))}
    </div>
  )
}
