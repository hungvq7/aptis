import Link from "next/link"
import { GraduationCap } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-muted p-4 dark:bg-background">
      <Link href="/" className="flex items-center gap-2 text-lg font-heading font-medium">
        <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <GraduationCap className="size-5" />
        </span>
        Aptis Prep
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
