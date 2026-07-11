import type { Test } from "@/lib/data/types"

// Original practice content. Mirrors the 4-part structure of Aptis General
// Speaking (personal info, describe a photo, compare two photos, long-turn
// discussion). Photo prompts use placeholder images under /public/speaking —
// see the imageUrls note below.
export const speakingTest1: Test = {
  id: "speaking-test-1",
  skill: "speaking",
  title: "Nói — Đề luyện tập số 1",
  description: "4 phần theo cấu trúc bài thi Nói Aptis: giới thiệu bản thân, mô tả ảnh, so sánh ảnh, thảo luận chủ đề.",
  durationMinutes: 12,
  parts: [
    {
      id: "sp1-p1",
      order: 1,
      title: "Phần 1 — Giới thiệu bản thân",
      instructions: "Trả lời ba câu hỏi ngắn về bản thân. Bạn có 30 giây để chuẩn bị và 45 giây để trả lời mỗi câu.",
      questions: [
        {
          id: "sp1-p1-q1",
          type: "speaking-prompt",
          prompt: "What is your name and where are you from?",
          prepSeconds: 10,
          recordSeconds: 30,
        },
        {
          id: "sp1-p1-q2",
          type: "speaking-prompt",
          prompt: "Tell me about your job or your studies.",
          prepSeconds: 15,
          recordSeconds: 45,
        },
        {
          id: "sp1-p1-q3",
          type: "speaking-prompt",
          prompt: "What do you like to do in your free time, and why?",
          prepSeconds: 15,
          recordSeconds: 45,
        },
      ],
    },
    {
      id: "sp1-p2",
      order: 2,
      title: "Phần 2 — Mô tả ảnh",
      instructions: "Mô tả bức ảnh dưới đây càng chi tiết càng tốt trong thời gian cho phép.",
      questions: [
        {
          id: "sp1-p2-q1",
          type: "speaking-prompt",
          prompt: "Describe what you can see in this photo.",
          imageUrls: ["/speaking/photo-office.svg"],
          prepSeconds: 20,
          recordSeconds: 45,
        },
      ],
    },
    {
      id: "sp1-p3",
      order: 3,
      title: "Phần 3 — So sánh hai ảnh",
      instructions: "So sánh hai bức ảnh dưới đây và nêu ý kiến cá nhân của bạn.",
      questions: [
        {
          id: "sp1-p3-q1",
          type: "speaking-prompt",
          prompt: "Compare these two photos of people working. Which situation would you prefer, and why?",
          imageUrls: ["/speaking/photo-office.svg", "/speaking/photo-remote.svg"],
          prepSeconds: 30,
          recordSeconds: 60,
        },
      ],
    },
    {
      id: "sp1-p4",
      order: 4,
      title: "Phần 4 — Thảo luận chủ đề",
      instructions: "Nêu quan điểm và giải thích lý do của bạn về chủ đề dưới đây.",
      questions: [
        {
          id: "sp1-p4-q1",
          type: "speaking-prompt",
          prompt:
            "Some people think technology has made communication between people worse, not better. Do you agree or disagree? Give reasons and examples to support your opinion.",
          prepSeconds: 45,
          recordSeconds: 90,
        },
      ],
    },
  ],
}
