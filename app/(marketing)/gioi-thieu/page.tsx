import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Giới thiệu — Aptis Prep",
}

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-16 sm:px-6">
      <h1 className="font-heading text-3xl font-medium tracking-tight">Giới thiệu về Aptis Prep</h1>
      <p className="text-muted-foreground">
        Aptis Prep là nền tảng luyện thi Aptis trực tuyến, được xây dựng để giúp người học làm quen với
        cấu trúc bài thi thật thông qua các bài luyện tập cho cả 4 kỹ năng Nghe, Nói, Đọc và Viết.
      </p>
      <p className="text-muted-foreground">
        Mỗi bài luyện tập được thiết kế bám sát định dạng từng phần thi, giúp học viên vừa làm quen với
        dạng câu hỏi, vừa rèn luyện kỹ năng quản lý thời gian trước kỳ thi chính thức.
      </p>
    </div>
  )
}
