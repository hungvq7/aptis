import Link from "next/link"
import { GraduationCap, MailIcon } from "lucide-react"
import { SKILL_META, SKILLS } from "@/lib/data/types"

const COMPANY_LINKS = [
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/lien-he", label: "Liên hệ" },
]

const SUPPORT_LINKS = [
  { href: "/dang-nhap", label: "Đăng nhập" },
  { href: "/dang-ky", label: "Đăng ký" },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2 font-heading text-lg font-medium">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="size-5" />
            </span>
            Aptis Prep
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">
            Nền tảng luyện thi Aptis trực tuyến với bộ câu hỏi bám sát cấu trúc đề thi thật, chấm điểm tự động
            và theo dõi tiến bộ theo từng kỹ năng.
          </p>
          <a
            href="mailto:hotro@aptisprep.example"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <MailIcon className="size-4" />
            hotro@aptisprep.example
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-heading text-sm font-medium">Kỹ năng luyện thi</p>
          <nav className="flex flex-col gap-2">
            {SKILLS.map((skill) => (
              <Link
                key={skill}
                href="/#ky-nang"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {SKILL_META[skill].label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-heading text-sm font-medium">Công ty</p>
          <nav className="flex flex-col gap-2">
            {COMPANY_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-heading text-sm font-medium">Tài khoản</p>
          <nav className="flex flex-col gap-2">
            {SUPPORT_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Aptis Prep. Nền tảng luyện thi Aptis trực tuyến.</p>
          <p>Nội dung luyện tập tự biên soạn, không sao chép từ đề thi Aptis chính thức.</p>
        </div>
      </div>
    </footer>
  )
}
