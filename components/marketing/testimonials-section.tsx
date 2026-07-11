import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const TESTIMONIALS = [
  {
    name: "Thu Hà",
    role: "Ứng viên du học",
    quote: "Luyện đúng cấu trúc đề thi giúp mình tự tin hơn hẳn khi vào phòng thi thật.",
  },
  {
    name: "Quốc Bảo",
    role: "Nhân viên văn phòng",
    quote: "Phần luyện Nói với ghi âm rất tiện, mình có thể nghe lại và tự sửa lỗi phát âm.",
  },
  {
    name: "Minh Anh",
    role: "Sinh viên năm cuối",
    quote: "Giao diện rõ ràng, dễ theo dõi tiến bộ của bản thân qua từng lần luyện tập.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 flex flex-col gap-2">
        <h2 className="font-heading text-3xl font-medium tracking-tight">Học viên nói gì?</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {TESTIMONIALS.map((item) => (
          <Card key={item.name}>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-pretty text-muted-foreground">&ldquo;{item.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
