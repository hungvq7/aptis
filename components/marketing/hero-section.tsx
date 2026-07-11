import Link from "next/link"
import { ArrowRightIcon, CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloatingBlobs } from "@/components/decor/floating-blobs"

const HIGHLIGHTS = [
  "Bộ đề bám sát cấu trúc thi Aptis thật",
  "Chấm điểm tự động cho phần Nghe & Đọc",
  "Luyện Nói với ghi âm ngay trên trình duyệt",
]

export function HeroSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            Luyện thi Aptis chuẩn quốc tế
          </span>
          <h1 className="text-balance font-heading text-4xl font-medium tracking-tight sm:text-5xl">
            Luyện thi Aptis toàn diện với Nghe, Nói, Đọc, Viết
          </h1>
          <p className="text-pretty text-lg text-muted-foreground">
            Nền tảng luyện tập với bộ câu hỏi được thiết kế theo đúng cấu trúc từng phần thi Aptis,
            giúp bạn làm quen với đề thi thật và theo dõi tiến bộ theo từng kỹ năng.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/dang-ky">
                Bắt đầu miễn phí
                <ArrowRightIcon />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dang-nhap">Tôi đã có tài khoản</Link>
            </Button>
          </div>
          <ul className="flex flex-col gap-2 pt-2">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckIcon className="size-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-4xl bg-gradient-to-br from-primary/15 via-secondary to-accent shadow-md ring-1 ring-foreground/5">
          <FloatingBlobs />
          <div className="absolute inset-0 grid grid-cols-2 gap-4 p-8">
            {[
              { label: "Nghe", value: "4 phần" },
              { label: "Nói", value: "4 phần" },
              { label: "Đọc", value: "5 phần" },
              { label: "Viết", value: "4 phần" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col justify-between rounded-3xl bg-card/90 p-4 shadow-sm ring-1 ring-foreground/5"
              >
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="font-heading text-2xl font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
