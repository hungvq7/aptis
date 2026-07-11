"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ChevronsUpDown, LogOut, Moon, Sun, UserRound } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import type { SessionUser } from "@/lib/data/types"

export function UserMenu({ user }: { user: SessionUser }) {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/dang-nhap")
    router.refresh()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar size="sm">
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden text-left">
                <span className="truncate text-sm font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
            <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/ho-so">
                <UserRound />
                Hồ sơ
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
              {resolvedTheme === "dark" ? <Sun /> : <Moon />}
              Chế độ {resolvedTheme === "dark" ? "sáng" : "tối"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
              <LogOut />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
