import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Liên hệ — Aptis Prep",
}

export default function ContactPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-16 sm:px-6">
      <h1 className="font-heading text-3xl font-medium tracking-tight">Liên hệ</h1>
      <p className="text-muted-foreground">
        Bạn có câu hỏi hoặc góp ý về nền tảng? Hãy gửi email cho đội ngũ Aptis Prep, chúng tôi sẽ phản hồi
        sớm nhất có thể.
      </p>
      <p className="text-sm text-muted-foreground">Email: hotro@aptisprep.example</p>
    </div>
  )
}
