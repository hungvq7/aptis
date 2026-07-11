import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session/current-user"

// Deliberately outside the (dashboard) route group: test-taking needs a
// distraction-free, sidebar-free layout. Still protected — see
// middleware.ts's PROTECTED_PREFIXES, which includes "/bai-thi".
export default async function ExamLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect("/dang-nhap")

  return <div className="min-h-screen bg-background">{children}</div>
}
