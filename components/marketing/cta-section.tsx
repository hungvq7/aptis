import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <div className="flex flex-col items-center gap-4 rounded-4xl bg-primary px-6 py-14 text-center text-primary-foreground">
        <h2 className="font-heading text-3xl font-medium tracking-tight">Sẵn sàng luyện thi Aptis?</h2>
        <p className="max-w-xl text-pretty text-primary-foreground/80">
          Tạo tài khoản miễn phí và bắt đầu làm bài thi thử ngay hôm nay.
        </p>
        <Button asChild size="lg" variant="secondary">
          <Link href="/dang-ky">
            Đăng ký miễn phí
            <ArrowRightIcon />
          </Link>
        </Button>
      </div>
    </section>
  )
}
