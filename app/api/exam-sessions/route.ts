import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session/current-user"
import { getTestRepository } from "@/lib/data/provider"

export async function POST() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { session, firstAttemptId } = await getTestRepository().createExamSession(user.id)
  return NextResponse.json({ sessionId: session.id, attemptId: firstAttemptId })
}
