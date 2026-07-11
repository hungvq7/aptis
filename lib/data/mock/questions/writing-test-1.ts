import type { Test } from "@/lib/data/types"

// Original practice content. Mirrors the 4-part structure of Aptis General
// Writing (short personal-info answers, short reply message, short
// email, and two longer texts on one topic — informal + formal register).
export const writingTest1: Test = {
  id: "writing-test-1",
  skill: "writing",
  title: "Viết — Đề luyện tập số 1",
  description: "4 phần theo cấu trúc bài thi Viết Aptis: trả lời ngắn, tin nhắn phản hồi, email, hai đoạn văn theo văn phong khác nhau.",
  durationMinutes: 50,
  parts: [
    {
      id: "wr1-p1",
      order: 1,
      title: "Phần 1 — Trả lời ngắn",
      instructions: "Trả lời ba câu hỏi ngắn dưới đây bằng câu hoàn chỉnh, mỗi câu 1–2 câu.",
      questions: [
        {
          id: "wr1-p1-q1",
          type: "short-answer",
          prompt: "What is your full name and where do you currently live?",
          minWords: 3,
          maxWords: 20,
        },
        {
          id: "wr1-p1-q2",
          type: "short-answer",
          prompt: "What do you do — are you a student or do you work? Describe it briefly.",
          minWords: 3,
          maxWords: 20,
        },
        {
          id: "wr1-p1-q3",
          type: "short-answer",
          prompt: "What do you usually do in your free time?",
          minWords: 3,
          maxWords: 20,
        },
      ],
    },
    {
      id: "wr1-p2",
      order: 2,
      title: "Phần 2 — Tin nhắn phản hồi",
      instructions: "Viết một tin nhắn ngắn phản hồi tình huống dưới đây, khoảng 20–30 từ.",
      questions: [
        {
          id: "wr1-p2-q1",
          type: "short-answer",
          prompt:
            "Your friend messages you: \"I'm thinking of visiting your city next month — any recommendations on where to stay?\" Write a short reply.",
          minWords: 20,
          maxWords: 30,
        },
      ],
    },
    {
      id: "wr1-p3",
      order: 3,
      title: "Phần 3 — Viết email",
      instructions: "Viết một email ngắn theo tình huống dưới đây, khoảng 40–50 từ.",
      questions: [
        {
          id: "wr1-p3-q1",
          type: "short-answer",
          prompt:
            "You recently ordered a product online, but it arrived damaged. Write an email to the company explaining the problem and what you would like them to do.",
          minWords: 40,
          maxWords: 50,
        },
      ],
    },
    {
      id: "wr1-p4",
      order: 4,
      title: "Phần 4 — Hai đoạn văn theo văn phong khác nhau",
      instructions:
        "Viết hai đoạn văn về cùng một chủ đề: một đoạn theo văn phong không trang trọng (diễn đàn) và một đoạn theo văn phong trang trọng (bài luận), mỗi đoạn khoảng 120–150 từ.",
      questions: [
        {
          id: "wr1-p4-q1",
          type: "essay",
          prompt:
            "Topic: \"Should schools reduce the amount of homework given to students?\" Write an informal forum post sharing your personal opinion, as if replying to other members of an online discussion group.",
          minWords: 120,
          maxWords: 150,
          timeLimitMinutes: 15,
        },
        {
          id: "wr1-p4-q2",
          type: "essay",
          prompt:
            "Same topic: \"Should schools reduce the amount of homework given to students?\" Now write a formal essay presenting arguments for and against, and give your own conclusion.",
          minWords: 120,
          maxWords: 150,
          timeLimitMinutes: 15,
        },
      ],
    },
  ],
}
