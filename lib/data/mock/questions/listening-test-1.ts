import type { Test } from "@/lib/data/types"

// Original practice content. Mirrors the 4-part structure of Aptis General
// Listening (short dialogues, opinion matching, dialogue comprehension, long
// monologue/interview). Real audio recordings are not yet available — each
// part references a placeholder clip via audioClipId, resolved in
// lib/data/mock/audio-config.ts. See that file for the deferred-audio note.
export const listeningTest1: Test = {
  id: "listening-test-1",
  skill: "listening",
  title: "Nghe — Đề luyện tập số 1",
  description: "4 phần theo cấu trúc bài thi Nghe Aptis: hội thoại ngắn, ghép quan điểm, hội thoại chi tiết, bài nói dài.",
  durationMinutes: 30,
  parts: [
    {
      id: "ls1-p1",
      order: 1,
      title: "Phần 1 — Hội thoại ngắn",
      instructions: "Nghe 4 đoạn hội thoại/độc thoại ngắn rồi chọn đáp án đúng cho mỗi câu hỏi.",
      audioClipId: "listening-test-1-part-1",
      questions: [
        {
          id: "ls1-p1-q1",
          type: "multiple-choice",
          prompt: "Where does the conversation most likely take place?",
          options: [
            { id: "a", label: "At a train station" },
            { id: "b", label: "At a restaurant" },
            { id: "c", label: "At a doctor's office" },
            { id: "d", label: "At a hotel reception" },
          ],
          correctOptionId: "d",
          explanation: "Người nói nhắc đến việc nhận phòng (\"check-in\") và số phòng, đây là các từ khóa gắn với quầy lễ tân khách sạn.",
        },
        {
          id: "ls1-p1-q2",
          type: "multiple-choice",
          prompt: "What does the man ask the woman to do?",
          options: [
            { id: "a", label: "Call him back later" },
            { id: "b", label: "Send an email confirmation" },
            { id: "c", label: "Bring the documents tomorrow" },
            { id: "d", label: "Wait in the lobby" },
          ],
          correctOptionId: "b",
          explanation: "Người nói yêu cầu \"could you send me a confirmation email\" — cụ thể là gửi email xác nhận, không phải gọi lại hay mang tài liệu.",
        },
        {
          id: "ls1-p1-q3",
          type: "multiple-choice",
          prompt: "How does the speaker feel about the delay?",
          options: [
            { id: "a", label: "Annoyed" },
            { id: "b", label: "Relieved" },
            { id: "c", label: "Indifferent" },
            { id: "d", label: "Excited" },
          ],
          correctOptionId: "a",
          explanation: "Giọng điệu và từ ngữ của người nói (\"this is so frustrating\") thể hiện sự khó chịu, không phải nhẹ nhõm hay thờ ơ.",
        },
        {
          id: "ls1-p1-q4",
          type: "multiple-choice",
          prompt: "What will the speakers most likely do next?",
          options: [
            { id: "a", label: "Reschedule the meeting" },
            { id: "b", label: "Leave the building" },
            { id: "c", label: "Order some food" },
            { id: "d", label: "Start the presentation" },
          ],
          correctOptionId: "a",
          explanation: "Cuối đoạn hội thoại, hai người thống nhất sẽ dời cuộc họp sang thời điểm khác do sự cố phát sinh.",
        },
      ],
    },
    {
      id: "ls1-p2",
      order: 2,
      title: "Phần 2 — Ghép quan điểm",
      instructions: "Nghe ba người nói về chủ đề \"làm việc nhóm\" rồi ghép mỗi câu với người phù hợp.",
      audioClipId: "listening-test-1-part-2",
      questions: [
        {
          id: "ls1-p2-q1",
          type: "matching",
          prompts: [
            { id: "s1", label: "This speaker prefers working alone on most tasks." },
            { id: "s2", label: "This speaker believes teamwork produces better ideas." },
            { id: "s3", label: "This speaker finds group meetings time-consuming." },
          ],
          options: [
            { id: "speaker-a", label: "Speaker A" },
            { id: "speaker-b", label: "Speaker B" },
            { id: "speaker-c", label: "Speaker C" },
          ],
          correctMap: {
            s1: "speaker-c",
            s2: "speaker-b",
            s3: "speaker-a",
          },
          explanation: "Speaker A nói thích làm việc một mình; Speaker B nhấn mạnh làm việc nhóm tạo ra ý tưởng tốt hơn; Speaker C phàn nàn các cuộc họp nhóm tốn thời gian.",
        },
      ],
    },
    // TODO: add explanations to Part 3/4 questions (skipped for now — Part
    // 1/2 above cover the representative sample for the review feature).
    {
      id: "ls1-p3",
      order: 3,
      title: "Phần 3 — Hội thoại chi tiết",
      instructions: "Nghe đoạn hội thoại giữa hai đồng nghiệp và trả lời các câu hỏi.",
      audioClipId: "listening-test-1-part-3",
      questions: [
        {
          id: "ls1-p3-q1",
          type: "multiple-choice",
          prompt: "What is the main topic of the conversation?",
          options: [
            { id: "a", label: "Planning a client presentation" },
            { id: "b", label: "Booking annual leave" },
            { id: "c", label: "Reviewing a budget report" },
            { id: "d", label: "Hiring a new team member" },
          ],
          correctOptionId: "a",
        },
        {
          id: "ls1-p3-q2",
          type: "multiple-choice",
          prompt: "What does the woman suggest?",
          options: [
            { id: "a", label: "Postponing the presentation" },
            { id: "b", label: "Adding more data slides" },
            { id: "c", label: "Practising the presentation together" },
            { id: "d", label: "Cancelling the meeting" },
          ],
          correctOptionId: "c",
        },
        {
          id: "ls1-p3-q3",
          type: "multiple-choice",
          prompt: "What concern does the man raise?",
          options: [
            { id: "a", label: "The client might arrive late" },
            { id: "b", label: "The room hasn't been booked" },
            { id: "c", label: "There isn't enough time to prepare" },
            { id: "d", label: "The report contains errors" },
          ],
          correctOptionId: "c",
        },
      ],
    },
    {
      id: "ls1-p4",
      order: 4,
      title: "Phần 4 — Bài nói dài",
      instructions: "Nghe một đoạn phỏng vấn dài và trả lời các câu hỏi chi tiết.",
      audioClipId: "listening-test-1-part-4",
      questions: [
        {
          id: "ls1-p4-q1",
          type: "multiple-choice",
          prompt: "What is the speaker's profession?",
          options: [
            { id: "a", label: "Architect" },
            { id: "b", label: "Urban planner" },
            { id: "c", label: "Journalist" },
            { id: "d", label: "Environmental scientist" },
          ],
          correctOptionId: "b",
        },
        {
          id: "ls1-p4-q2",
          type: "multiple-choice",
          prompt: "According to the speaker, what is the biggest challenge facing cities today?",
          options: [
            { id: "a", label: "Rising housing costs" },
            { id: "b", label: "Air pollution" },
            { id: "c", label: "Traffic congestion" },
            { id: "d", label: "Lack of green space" },
          ],
          correctOptionId: "a",
        },
        {
          id: "ls1-p4-q3",
          type: "multiple-choice",
          prompt: "What solution does the speaker propose?",
          options: [
            { id: "a", label: "Building more highways" },
            { id: "b", label: "Mixed-use neighbourhood development" },
            { id: "c", label: "Reducing city populations" },
            { id: "d", label: "Banning private vehicles entirely" },
          ],
          correctOptionId: "b",
        },
        {
          id: "ls1-p4-q4",
          type: "multiple-choice",
          prompt: "How does the speaker feel about the next ten years?",
          options: [
            { id: "a", label: "Pessimistic" },
            { id: "b", label: "Uncertain" },
            { id: "c", label: "Cautiously optimistic" },
            { id: "d", label: "Completely confident" },
          ],
          correctOptionId: "c",
        },
      ],
    },
  ],
}
