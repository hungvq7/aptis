import Link from "next/link"
import { redirect } from "next/navigation"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { getCurrentUser } from "@/lib/session/current-user"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  // Defense in depth — middleware already redirects unauthenticated requests
  // away from this route group, but a Server Component should never assume.
  if (!user) redirect("/dang-nhap")

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/60 px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Xin chào, {user.name}</span>
        </header>
        <div className="flex-1 p-4 sm:p-6">
          <div className="mx-auto w-full max-w-[1440px]">{children}</div>
        </div>
        <footer className="shrink-0 border-t border-border/60 px-4 py-4 sm:px-6">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Aptis Prep</p>
            <div className="flex gap-4">
              <Link href="/lien-he" className="hover:text-foreground">
                Liên hệ hỗ trợ
              </Link>
              <Link href="/gioi-thieu" className="hover:text-foreground">
                Giới thiệu
              </Link>
            </div>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  )
}
