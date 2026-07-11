import type { Test } from "@/lib/data/types"

// Original practice content authored for this project. Structurally mirrors
// the publicly documented Aptis General Reading format (5 parts: word/gap
// choice, sentence reordering, opinion matching, cloze, heading matching) —
// it does not reproduce real Aptis exam questions.
export const readingTest1: Test = {
  id: "reading-test-1",
  skill: "reading",
  title: "Đọc — Đề luyện tập số 1",
  description: "5 phần theo đúng cấu trúc bài thi Đọc Aptis: chọn từ, sắp xếp câu, ghép ý kiến, điền khuyết đoạn văn, ghép tiêu đề.",
  durationMinutes: 35,
  parts: [
    {
      id: "rd1-p1",
      order: 1,
      title: "Phần 1 — Chọn từ đúng",
      instructions: "Chọn từ phù hợp nhất để hoàn thành mỗi câu.",
      questions: [
        {
          id: "rd1-p1-q1",
          type: "multiple-choice",
          prompt: "I have lived in this city ___ five years.",
          options: [
            { id: "a", label: "for" },
            { id: "b", label: "since" },
            { id: "c", label: "during" },
            { id: "d", label: "while" },
          ],
          correctOptionId: "a",
          explanation: "\"For\" đi với khoảng thời gian (five years); \"since\" cần một mốc thời gian cụ thể (since 2019).",
        },
        {
          id: "rd1-p1-q2",
          type: "multiple-choice",
          prompt: "She is responsible ___ managing the entire marketing team.",
          options: [
            { id: "a", label: "of" },
            { id: "b", label: "for" },
            { id: "c", label: "to" },
            { id: "d", label: "with" },
          ],
          correctOptionId: "b",
          explanation: "Cụm cố định là \"responsible for doing something\".",
        },
        {
          id: "rd1-p1-q3",
          type: "multiple-choice",
          prompt: "By the time we arrived, the meeting ___ already started.",
          options: [
            { id: "a", label: "has" },
            { id: "b", label: "was" },
            { id: "c", label: "had" },
            { id: "d", label: "is" },
          ],
          correctOptionId: "c",
          explanation: "Hành động xảy ra trước một thời điểm khác trong quá khứ ⇒ dùng thì quá khứ hoàn thành (had started).",
        },
        {
          id: "rd1-p1-q4",
          type: "multiple-choice",
          prompt: "The report needs to be submitted ___ Friday at the latest.",
          options: [
            { id: "a", label: "until" },
            { id: "b", label: "by" },
            { id: "c", label: "on" },
            { id: "d", label: "at" },
          ],
          correctOptionId: "b",
          explanation: "\"By\" nghĩa là \"chậm nhất là\" (deadline), phù hợp với \"at the latest\".",
        },
        {
          id: "rd1-p1-q5",
          type: "multiple-choice",
          prompt: "Neither of the candidates ___ suitable for the position.",
          options: [
            { id: "a", label: "are" },
            { id: "b", label: "is" },
            { id: "c", label: "were" },
            { id: "d", label: "have" },
          ],
          correctOptionId: "b",
          explanation: "\"Neither of\" luôn đi với động từ số ít (is), dù theo sau là danh từ số nhiều.",
        },
      ],
    },
    {
      id: "rd1-p2",
      order: 2,
      title: "Phần 2 — Sắp xếp câu",
      instructions: "Sắp xếp các câu sau theo đúng thứ tự để tạo thành một đoạn văn hoàn chỉnh và mạch lạc.",
      questions: [
        {
          id: "rd1-p2-q1",
          type: "reorder",
          instructions: "Đoạn văn nói về quá trình một công ty chuyển sang làm việc từ xa.",
          items: [
            { id: "i1", label: "At first, the transition to remote work seemed like it would be a major challenge for the company." },
            { id: "i2", label: "However, after just two weeks, most employees had already adapted to the new routine." },
            { id: "i3", label: "Managers introduced short daily video calls to keep every team connected and informed." },
            { id: "i4", label: "As a result, productivity actually increased slightly compared to the previous quarter." },
            { id: "i5", label: "Encouraged by these results, the company decided to make remote work a permanent option." },
            { id: "i6", label: "Today, more than half of the staff choose to work from home at least three days a week." },
          ],
          correctOrder: ["i1", "i3", "i2", "i4", "i5", "i6"],
          explanation: "Câu 1 mở đầu bằng \"At first\"; câu 3 nói về giải pháp (video calls) trước khi câu 2 nêu kết quả (\"However, after...\"); các câu còn lại theo trình tự nguyên nhân → kết quả → hiện tại.",
        },
      ],
    },
    {
      id: "rd1-p3",
      order: 3,
      title: "Phần 3 — Ghép ý kiến",
      instructions: "Đọc ba đoạn ý kiến ngắn dưới đây, sau đó ghép mỗi câu hỏi với người tương ứng.",
      passages: [
        { id: "person-a", title: "Minh", body: "I love working from home. I save two hours a day on commuting and I'm far more focused without office noise around me. The only downside is that I sometimes miss quick face-to-face chats with colleagues." },
        { id: "person-b", title: "Lan", body: "For me, the office is essential. I need the structure of leaving home and I find it much easier to collaborate on creative projects when everyone is in the same room." },
        { id: "person-c", title: "Duc", body: "I think a mix of both is best. I go to the office twice a week for meetings and work from home the rest of the time — it gives me flexibility without losing team connection." },
      ],
      questions: [
        {
          id: "rd1-p3-q1",
          type: "matching",
          prompts: [
            { id: "s1", label: "Who prefers a combination of office and home working?" },
            { id: "s2", label: "Who finds it easier to be creative in person?" },
            { id: "s3", label: "Who saves time by not commuting?" },
            { id: "s4", label: "Who occasionally misses informal conversations with coworkers?" },
          ],
          options: [
            { id: "person-a", label: "Minh" },
            { id: "person-b", label: "Lan" },
            { id: "person-c", label: "Duc" },
          ],
          correctMap: {
            s1: "person-c",
            s2: "person-b",
            s3: "person-a",
            s4: "person-a",
          },
          explanation: "Duc nói \"a mix of both\"; Lan nói dễ sáng tạo hơn khi làm việc cùng phòng; Minh nói tiết kiệm thời gian di chuyển và thỉnh thoảng nhớ những cuộc trò chuyện ngắn với đồng nghiệp.",
        },
      ],
    },
    {
      id: "rd1-p4",
      order: 4,
      title: "Phần 4 — Điền từ vào đoạn văn",
      instructions: "Chọn từ phù hợp nhất cho mỗi chỗ trống trong đoạn văn.",
      questions: [
        {
          id: "rd1-p4-q1",
          type: "gap-fill",
          passageTemplate:
            "Public libraries have {{g1}} a great deal over the past two decades. They are no longer just places to {{g2}} books; many now offer free internet access, community events, and even equipment for hire. This shift has {{g3}} libraries to attract a much {{g4}} range of visitors than before, including young families and small business owners. {{g5}}, some critics argue that libraries should focus {{g6}} on their traditional role. Despite this debate, most surveys suggest that the public {{g7}} strongly supports these new services.",
          gaps: [
            { id: "g1", correctOptionId: "a", options: [{ id: "a", label: "changed" }, { id: "b", label: "changing" }, { id: "c", label: "change" }, { id: "d", label: "changes" }] },
            { id: "g2", correctOptionId: "b", options: [{ id: "a", label: "borrows" }, { id: "b", label: "borrow" }, { id: "c", label: "borrowed" }, { id: "d", label: "borrowing" }] },
            { id: "g3", correctOptionId: "c", options: [{ id: "a", label: "let" }, { id: "b", label: "made" }, { id: "c", label: "allowed" }, { id: "d", label: "helped" }] },
            { id: "g4", correctOptionId: "d", options: [{ id: "a", label: "wide" }, { id: "b", label: "widest" }, { id: "c", label: "as wide" }, { id: "d", label: "wider" }] },
            { id: "g5", correctOptionId: "b", options: [{ id: "a", label: "Moreover" }, { id: "b", label: "However" }, { id: "c", label: "Therefore" }, { id: "d", label: "Similarly" }] },
            { id: "g6", correctOptionId: "a", options: [{ id: "a", label: "solely" }, { id: "b", label: "hardly" }, { id: "c", label: "rarely" }, { id: "d", label: "barely" }] },
            { id: "g7", correctOptionId: "c", options: [{ id: "a", label: "still" }, { id: "b", label: "already" }, { id: "c", label: "generally" }, { id: "d", label: "ever" }] },
          ],
          explanation: "g1: \"have\" + động từ ở dạng phân từ hoàn thành (changed); g2: \"to\" + động từ nguyên mẫu (borrow); g3: \"allowed\" khớp nghĩa \"cho phép\"; g4: sau \"much\" cần dạng so sánh hơn (wider); g5: ý tương phản cần \"However\"; g6: \"solely\" nghĩa \"chỉ/duy nhất\"; g7: \"generally\" phù hợp với \"most surveys\".",
        },
      ],
    },
    {
      id: "rd1-p5",
      order: 5,
      title: "Phần 5 — Ghép tiêu đề",
      instructions: "Đọc bài viết dưới đây và ghép tiêu đề phù hợp nhất với mỗi đoạn văn. Có một tiêu đề không sử dụng.",
      passages: [
        { id: "para-1", title: "Đoạn 1", body: "Urban farming has grown rapidly in cities around the world over the last decade. What began as a small hobby for enthusiasts has turned into a serious source of fresh produce for many urban neighbourhoods." },
        { id: "para-2", title: "Đoạn 2", body: "One of the biggest advantages is the reduction in transport distance. Vegetables grown on a rooftop only minutes from a local market require far less fuel to reach consumers than produce shipped from distant farms." },
        { id: "para-3", title: "Đoạn 3", body: "However, urban farming is not without its challenges. Limited space means yields are often small, and the initial cost of setting up rooftop or vertical growing systems can be high." },
        { id: "para-4", title: "Đoạn 4", body: "City councils in several countries have begun offering grants and tax incentives to encourage more urban farming projects, recognising their potential to improve food security and community wellbeing." },
        { id: "para-5", title: "Đoạn 5", body: "Looking ahead, experts predict that advances in hydroponics and vertical-growing technology will make urban farms significantly more productive, potentially reshaping how cities feed themselves within a generation." },
      ],
      questions: [
        {
          id: "rd1-p5-q1",
          type: "matching",
          prompts: [
            { id: "para-1", label: "Đoạn 1" },
            { id: "para-2", label: "Đoạn 2" },
            { id: "para-3", label: "Đoạn 3" },
            { id: "para-4", label: "Đoạn 4" },
            { id: "para-5", label: "Đoạn 5" },
          ],
          options: [
            { id: "h1", label: "The growing popularity of a modern trend" },
            { id: "h2", label: "Environmental benefits of shorter supply chains" },
            { id: "h3", label: "Limitations that growers still face" },
            { id: "h4", label: "Government support for new initiatives" },
            { id: "h5", label: "Future technology and its potential impact" },
            { id: "h6", label: "A comparison with traditional rural farming" },
          ],
          correctMap: {
            "para-1": "h1",
            "para-2": "h2",
            "para-3": "h3",
            "para-4": "h4",
            "para-5": "h5",
          },
          explanation: "Mỗi đoạn có một ý chính rõ ràng: xu hướng phổ biến, lợi ích môi trường, hạn chế, hỗ trợ từ chính quyền, và công nghệ tương lai — tiêu đề h6 (so sánh với nông nghiệp truyền thống) không khớp với đoạn nào nên không được dùng.",
        },
      ],
    },
  ],
}
