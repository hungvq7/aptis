"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { GraduationCap, LayoutDashboard, UserRound, ChartColumnIcon, ClipboardListIcon, ShuffleIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserMenu } from "@/components/dashboard/user-menu"
import { SKILL_ICONS } from "@/lib/data/skill-icons"
import { SKILL_META, type SessionUser } from "@/lib/data/types"

export function AppSidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/bang-dieu-khien" className="flex items-center gap-2 px-2 py-1 font-heading text-base font-medium">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </span>
          Aptis Prep
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/bang-dieu-khien"}>
                  <Link href="/bang-dieu-khien">
                    <LayoutDashboard />
                    <span>Bảng điều khiển</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/thong-ke"}>
                  <Link href="/thong-ke">
                    <ChartColumnIcon />
                    <span>Thống kê</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/review-de")}>
                  <Link href="/review-de">
                    <ClipboardListIcon />
                    <span>Review đề</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/thi-thu-tong-hop")}>
                  <Link href="/thi-thu-tong-hop">
                    <ShuffleIcon />
                    <span>Thi thử tổng hợp</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Kỹ năng luyện thi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.values(SKILL_META).map((skill) => {
                const Icon = SKILL_ICONS[skill.icon]
                const href = `/ky-nang/${skill.slug}`
                return (
                  <SidebarMenuItem key={skill.id}>
                    <SidebarMenuButton asChild isActive={pathname.startsWith(href)}>
                      <Link href={href}>
                        <Icon />
                        <span>{skill.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/ho-so"}>
                  <Link href="/ho-so">
                    <UserRound />
                    <span>Hồ sơ</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserMenu user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
