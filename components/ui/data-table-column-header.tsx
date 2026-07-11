"use client"

import type { Column } from "@tanstack/react-table"
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: {
  column: Column<TData, TValue>
  title: string
  className?: string
}) {
  if (!column.getCanSort()) {
    return <div className={cn("text-sm font-medium", className)}>{title}</div>
  }

  const sorted = column.getIsSorted()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={cn("-ml-3 h-8 data-[state=open]:bg-accent", className)}>
          <span>{title}</span>
          {sorted === "desc" ? (
            <ArrowDownIcon />
          ) : sorted === "asc" ? (
            <ArrowUpIcon />
          ) : (
            <ChevronsUpDownIcon className="text-muted-foreground/70" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          <ArrowUpIcon className="text-muted-foreground/70" />
          Tăng dần
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          <ArrowDownIcon className="text-muted-foreground/70" />
          Giảm dần
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
