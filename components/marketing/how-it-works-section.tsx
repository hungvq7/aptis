const STEPS = [
  { title: "Đăng ký tài khoản", description: "Tạo tài khoản miễn phí bằng email chỉ trong 1 phút." },
  { title: "Chọn kỹ năng", description: "Chọn một trong bốn kỹ năng Nghe, Nói, Đọc, Viết để bắt đầu." },
  { title: "Làm bài thi thử", description: "Làm bài theo đúng thời gian và cấu trúc như đề thi thật." },
  { title: "Xem kết quả & tiến bộ", description: "Nhận điểm số chi tiết theo từng phần và theo dõi tiến bộ theo thời gian." },
]

export function HowItWorksSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 flex flex-col gap-2">
        <h2 className="font-heading text-3xl font-medium tracking-tight">Bắt đầu chỉ trong 4 bước</h2>
        <p className="text-muted-foreground">Đơn giản, nhanh chóng, không cần cài đặt gì thêm.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <div key={step.title} className="flex flex-col gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary font-heading text-sm font-medium text-primary-foreground">
              {index + 1}
            </span>
            <h3 className="font-medium">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
