"use client"

import { ChevronLeftIcon, ChevronRightIcon, InfoIcon, LogOutIcon, MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function BottomToolbar({
  onOpenQuestionList,
  currentPartInstructions,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  onExit,
}: {
  onOpenQuestionList: () => void
  currentPartInstructions: string
  canGoPrevious: boolean
  canGoNext: boolean
  onPrevious: () => void
  onNext: () => void
  onExit: () => void
}) {
  return (
    <footer className="flex shrink-0 items-center gap-2 border-t border-border/60 px-4 py-3 sm:px-6">
      <Button type="button" variant="outline" size="icon" onClick={onOpenQuestionList} aria-label="Danh sách câu hỏi">
        <MenuIcon />
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" size="icon" aria-label="Hướng dẫn">
            <InfoIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" align="start" className="max-w-xs text-sm">
          {currentPartInstructions}
        </PopoverContent>
      </Popover>

      <div className="flex-1" />

      <Button type="button" variant="outline" disabled={!canGoPrevious} onClick={onPrevious}>
        <ChevronLeftIcon />
        Previous
      </Button>
      <Button type="button" variant="outline" disabled={!canGoNext} onClick={onNext}>
        Next
        <ChevronRightIcon />
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="button" variant="ghost" size="icon" aria-label="Thoát">
            <LogOutIcon />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Thoát bài thi?</AlertDialogTitle>
            <AlertDialogDescription>
              Bài làm của bạn sẽ được lưu và bạn có thể tiếp tục sau. Bài thi sẽ chưa được nộp.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tiếp tục làm bài</AlertDialogCancel>
            <AlertDialogAction onClick={onExit}>Thoát</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </footer>
  )
}
